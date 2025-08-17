use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    path::PathBuf,
    sync::Arc,
};
use tokio::{
    fs,
    sync::{broadcast, RwLock},
    time::{interval, Duration},
};
use uuid::Uuid;
use chrono::{DateTime, Utc};

/// Session manager for terminal instances
pub struct SessionManager {
    config: SessionConfig,
    sessions: Arc<RwLock<HashMap<String, Session>>>,
    active_session: Arc<RwLock<Option<String>>>,
    event_tx: broadcast::Sender<SessionEvent>,
    persistence: Arc<SessionPersistence>,
}

impl SessionManager {
    pub async fn new(config: &SessionConfig) -> Result<Self> {
        let (event_tx, _) = broadcast::channel(1024);
        let persistence = Arc::new(SessionPersistence::new(&config.storage_path).await?);
        
        let mut manager = Self {
            config: config.clone(),
            sessions: Arc::new(RwLock::new(HashMap::new())),
            active_session: Arc::new(RwLock::new(None)),
            event_tx,
            persistence,
        };
        
        // Load saved sessions
        manager.load_sessions().await?;
        
        // Start session cleanup task
        manager.start_cleanup_task();
        
        Ok(manager)
    }
    
    /// Register a new session
    pub async fn register_session(&mut self, id: &str, info: crate::SessionInfo) -> Result<()> {
        let session = Session {
            id: id.to_string(),
            info,
            state: SessionState::Active,
            created_at: Utc::now(),
            last_activity: Utc::now(),
            metadata: HashMap::new(),
            history: Vec::new(),
        };
        
        self.sessions.write().await.insert(id.to_string(), session.clone());
        
        // Persist session
        self.persistence.save_session(&session).await?;
        
        // Emit event
        let _ = self.event_tx.send(SessionEvent::Created {
            session_id: id.to_string(),
        });
        
        tracing::info!("Session registered: {}", id);
        Ok(())
    }
    
    /// Get session by ID
    pub async fn get_session(&self, id: &str) -> Option<Session> {
        self.sessions.read().await.get(id).cloned()
    }
    
    /// List all sessions
    pub async fn list_sessions(&self) -> Vec<Session> {
        self.sessions.read().await.values().cloned().collect()
    }
    
    /// Set active session
    pub async fn set_active(&mut self, id: &str) -> Result<()> {
        if self.sessions.read().await.contains_key(id) {
            *self.active_session.write().await = Some(id.to_string());
            
            // Update last activity
            if let Some(session) = self.sessions.write().await.get_mut(id) {
                session.last_activity = Utc::now();
            }
            
            let _ = self.event_tx.send(SessionEvent::Activated {
                session_id: id.to_string(),
            });
            
            Ok(())
        } else {
            Err(anyhow::anyhow!("Session not found: {}", id))
        }
    }
    
    /// Get active session
    pub async fn get_active(&self) -> Option<String> {
        self.active_session.read().await.clone()
    }
    
    /// Update session activity
    pub async fn update_activity(&mut self, id: &str) -> Result<()> {
        if let Some(session) = self.sessions.write().await.get_mut(id) {
            session.last_activity = Utc::now();
            self.persistence.update_activity(id).await?;
        }
        Ok(())
    }
    
    /// Add command to session history
    pub async fn add_to_history(&mut self, id: &str, command: &str) -> Result<()> {
        if let Some(session) = self.sessions.write().await.get_mut(id) {
            let entry = HistoryEntry {
                timestamp: Utc::now(),
                command: command.to_string(),
                directory: std::env::current_dir()
                    .ok()
                    .and_then(|p| p.to_str().map(String::from)),
            };
            
            session.history.push(entry.clone());
            
            // Limit history size
            if session.history.len() > self.config.max_history_size {
                session.history.remove(0);
            }
            
            // Persist history
            self.persistence.add_history_entry(id, &entry).await?;
        }
        
        Ok(())
    }
    
    /// Get session history
    pub async fn get_history(&self, id: &str) -> Vec<HistoryEntry> {
        self.sessions
            .read()
            .await
            .get(id)
            .map(|s| s.history.clone())
            .unwrap_or_default()
    }
    
    /// Suspend session
    pub async fn suspend_session(&mut self, id: &str) -> Result<()> {
        if let Some(session) = self.sessions.write().await.get_mut(id) {
            session.state = SessionState::Suspended;
            self.persistence.save_session(session).await?;
            
            let _ = self.event_tx.send(SessionEvent::Suspended {
                session_id: id.to_string(),
            });
        }
        
        Ok(())
    }
    
    /// Resume session
    pub async fn resume_session(&mut self, id: &str) -> Result<()> {
        if let Some(session) = self.sessions.write().await.get_mut(id) {
            session.state = SessionState::Active;
            session.last_activity = Utc::now();
            self.persistence.save_session(session).await?;
            
            let _ = self.event_tx.send(SessionEvent::Resumed {
                session_id: id.to_string(),
            });
        }
        
        Ok(())
    }
    
    /// Close session
    pub async fn close_session(&mut self, id: &str) -> Result<()> {
        if let Some(session) = self.sessions.write().await.remove(id) {
            // Mark as closed in persistence
            self.persistence.mark_closed(id).await?;
            
            // Clear active if this was it
            let mut active = self.active_session.write().await;
            if active.as_ref() == Some(&id.to_string()) {
                *active = None;
            }
            
            let _ = self.event_tx.send(SessionEvent::Closed {
                session_id: id.to_string(),
            });
        }
        
        Ok(())
    }
    
    /// Subscribe to session events
    pub fn subscribe(&self) -> broadcast::Receiver<SessionEvent> {
        self.event_tx.subscribe()
    }
    
    /// Count active sessions
    pub fn count_active(&self) -> usize {
        // Non-async version for stats
        futures::executor::block_on(async {
            self.sessions
                .read()
                .await
                .values()
                .filter(|s| s.state == SessionState::Active)
                .count()
        })
    }
    
    /// Export session
    pub async fn export_session(&self, id: &str) -> Result<String> {
        if let Some(session) = self.sessions.read().await.get(id) {
            let export = SessionExport {
                session: session.clone(),
                timestamp: Utc::now(),
                version: env!("CARGO_PKG_VERSION").to_string(),
            };
            
            Ok(serde_json::to_string_pretty(&export)?)
        } else {
            Err(anyhow::anyhow!("Session not found"))
        }
    }
    
    /// Import session
    pub async fn import_session(&mut self, data: &str) -> Result<String> {
        let export: SessionExport = serde_json::from_str(data)?;
        
        // Generate new ID for imported session
        let new_id = format!("imported-{}", Uuid::new_v4());
        let mut session = export.session;
        session.id = new_id.clone();
        session.created_at = Utc::now();
        
        self.sessions.write().await.insert(new_id.clone(), session.clone());
        self.persistence.save_session(&session).await?;
        
        Ok(new_id)
    }
    
    async fn load_sessions(&mut self) -> Result<()> {
        let sessions = self.persistence.load_all_sessions().await?;
        
        for session in sessions {
            if session.state != SessionState::Closed {
                self.sessions.write().await.insert(session.id.clone(), session);
            }
        }
        
        tracing::info!("Loaded {} sessions", self.sessions.read().await.len());
        Ok(())
    }
    
    fn start_cleanup_task(&self) {
        let sessions = self.sessions.clone();
        let config = self.config.clone();
        let persistence = self.persistence.clone();
        
        tokio::spawn(async move {
            let mut interval = interval(Duration::from_secs(60));
            
            loop {
                interval.tick().await;
                
                let now = Utc::now();
                let mut to_suspend = Vec::new();
                
                // Check for inactive sessions
                for (id, session) in sessions.read().await.iter() {
                    let inactive_duration = now - session.last_activity;
                    
                    if session.state == SessionState::Active 
                        && inactive_duration.num_minutes() > config.suspend_after_minutes as i64 {
                        to_suspend.push(id.clone());
                    }
                }
                
                // Suspend inactive sessions
                for id in to_suspend {
                    if let Some(session) = sessions.write().await.get_mut(&id) {
                        session.state = SessionState::Suspended;
                        let _ = persistence.save_session(session).await;
                        tracing::info!("Auto-suspended inactive session: {}", id);
                    }
                }
            }
        });
    }
}

/// Session persistence layer
struct SessionPersistence {
    db_path: PathBuf,
}

impl SessionPersistence {
    async fn new(storage_path: &PathBuf) -> Result<Self> {
        // Create storage directory if it doesn't exist
        fs::create_dir_all(storage_path).await?;
        
        let db_path = storage_path.join("sessions.db");
        
        // Initialize database
        let persistence = Self { db_path };
        persistence.init_database().await?;
        
        Ok(persistence)
    }
    
    async fn init_database(&self) -> Result<()> {
        // Create sessions file if it doesn't exist
        if !self.db_path.exists() {
            let initial_data = SessionDatabase {
                version: 1,
                sessions: HashMap::new(),
            };
            
            let json = serde_json::to_string_pretty(&initial_data)?;
            fs::write(&self.db_path, json).await?;
        }
        
        Ok(())
    }
    
    async fn save_session(&self, session: &Session) -> Result<()> {
        let mut db = self.load_database().await?;
        db.sessions.insert(session.id.clone(), session.clone());
        self.save_database(&db).await
    }
    
    async fn load_all_sessions(&self) -> Result<Vec<Session>> {
        let db = self.load_database().await?;
        Ok(db.sessions.into_values().collect())
    }
    
    async fn update_activity(&self, id: &str) -> Result<()> {
        let mut db = self.load_database().await?;
        if let Some(session) = db.sessions.get_mut(id) {
            session.last_activity = Utc::now();
        }
        self.save_database(&db).await
    }
    
    async fn add_history_entry(&self, id: &str, entry: &HistoryEntry) -> Result<()> {
        let mut db = self.load_database().await?;
        if let Some(session) = db.sessions.get_mut(id) {
            session.history.push(entry.clone());
            
            // Limit history size
            if session.history.len() > 1000 {
                session.history.remove(0);
            }
        }
        self.save_database(&db).await
    }
    
    async fn mark_closed(&self, id: &str) -> Result<()> {
        let mut db = self.load_database().await?;
        if let Some(session) = db.sessions.get_mut(id) {
            session.state = SessionState::Closed;
        }
        self.save_database(&db).await
    }
    
    async fn load_database(&self) -> Result<SessionDatabase> {
        let json = fs::read_to_string(&self.db_path).await?;
        Ok(serde_json::from_str(&json)?)
    }
    
    async fn save_database(&self, db: &SessionDatabase) -> Result<()> {
        let json = serde_json::to_string_pretty(db)?;
        fs::write(&self.db_path, json).await?;
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: String,
    pub info: crate::SessionInfo,
    pub state: SessionState,
    pub created_at: DateTime<Utc>,
    pub last_activity: DateTime<Utc>,
    pub metadata: HashMap<String, String>,
    pub history: Vec<HistoryEntry>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SessionState {
    Active,
    Suspended,
    Closed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HistoryEntry {
    pub timestamp: DateTime<Utc>,
    pub command: String,
    pub directory: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionConfig {
    pub storage_path: PathBuf,
    pub max_sessions: usize,
    pub max_history_size: usize,
    pub suspend_after_minutes: u32,
    pub auto_save: bool,
}

impl Default for SessionConfig {
    fn default() -> Self {
        let config_dir = dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("katalyst-terminal");
        
        Self {
            storage_path: config_dir.join("sessions"),
            max_sessions: 50,
            max_history_size: 10000,
            suspend_after_minutes: 30,
            auto_save: true,
        }
    }
}

#[derive(Debug, Clone)]
pub enum SessionEvent {
    Created { session_id: String },
    Activated { session_id: String },
    Suspended { session_id: String },
    Resumed { session_id: String },
    Closed { session_id: String },
}

#[derive(Debug, Serialize, Deserialize)]
struct SessionDatabase {
    version: u32,
    sessions: HashMap<String, Session>,
}

#[derive(Debug, Serialize, Deserialize)]
struct SessionExport {
    session: Session,
    timestamp: DateTime<Utc>,
    version: String,
}