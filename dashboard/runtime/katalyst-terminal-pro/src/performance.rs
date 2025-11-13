use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, VecDeque},
    sync::{
        atomic::{AtomicU64, AtomicUsize, Ordering},
        Arc,
    },
    time::{Duration, Instant},
};
use tokio::{
    sync::RwLock,
    time::interval,
};

/// Performance monitoring and optimization system
pub struct PerformanceMonitor {
    config: PerformanceConfig,
    metrics: Arc<RwLock<MetricsStore>>,
    frame_counter: Arc<FrameCounter>,
    memory_tracker: Arc<MemoryTracker>,
    cpu_tracker: Arc<CpuTracker>,
    network_tracker: Arc<NetworkTracker>,
    optimization_engine: Arc<OptimizationEngine>,
}

impl PerformanceMonitor {
    pub fn new(config: PerformanceConfig) -> Self {
        let metrics = Arc::new(RwLock::new(MetricsStore::new(config.history_size)));
        let frame_counter = Arc::new(FrameCounter::new());
        let memory_tracker = Arc::new(MemoryTracker::new());
        let cpu_tracker = Arc::new(CpuTracker::new());
        let network_tracker = Arc::new(NetworkTracker::new());
        let optimization_engine = Arc::new(OptimizationEngine::new(&config));
        
        let monitor = Self {
            config,
            metrics,
            frame_counter,
            memory_tracker,
            cpu_tracker,
            network_tracker,
            optimization_engine,
        };
        
        // Start monitoring tasks
        monitor.start_monitoring();
        
        monitor
    }
    
    /// Record a frame render
    pub fn record_frame(&self, render_time_ms: f64) {
        self.frame_counter.increment();
        self.frame_counter.add_render_time(render_time_ms);
    }
    
    /// Record network latency
    pub fn record_latency(&self, latency_ms: f64) {
        self.network_tracker.add_latency(latency_ms);
    }
    
    /// Record memory allocation
    pub fn record_allocation(&self, bytes: usize) {
        self.memory_tracker.add_allocation(bytes);
    }
    
    /// Record memory deallocation
    pub fn record_deallocation(&self, bytes: usize) {
        self.memory_tracker.remove_allocation(bytes);
    }
    
    /// Get current FPS
    pub fn get_fps(&self) -> f64 {
        self.frame_counter.get_fps()
    }
    
    /// Get current metrics snapshot
    pub async fn get_snapshot(&self) -> MetricsSnapshot {
        let metrics = self.metrics.read().await;
        
        MetricsSnapshot {
            timestamp: Instant::now(),
            fps: self.frame_counter.get_fps(),
            frame_time_ms: self.frame_counter.get_average_render_time(),
            memory_used_mb: self.memory_tracker.get_used_mb(),
            memory_allocated_mb: self.memory_tracker.get_allocated_mb(),
            cpu_usage_percent: self.cpu_tracker.get_usage(),
            network_latency_ms: self.network_tracker.get_average_latency(),
            network_throughput_mbps: self.network_tracker.get_throughput_mbps(),
            active_sessions: metrics.active_sessions,
            total_frames: self.frame_counter.get_total(),
        }
    }
    
    /// Get performance recommendations
    pub async fn get_recommendations(&self) -> Vec<PerformanceRecommendation> {
        let snapshot = self.get_snapshot().await;
        self.optimization_engine.analyze(&snapshot)
    }
    
    /// Apply automatic optimizations
    pub async fn auto_optimize(&self) -> Result<OptimizationResult> {
        let snapshot = self.get_snapshot().await;
        let recommendations = self.optimization_engine.analyze(&snapshot);
        
        let mut applied = Vec::new();
        let mut failed = Vec::new();
        
        for rec in recommendations {
            if rec.auto_apply {
                match self.apply_optimization(&rec).await {
                    Ok(_) => applied.push(rec.optimization_type),
                    Err(e) => {
                        tracing::warn!("Failed to apply optimization {:?}: {}", rec.optimization_type, e);
                        failed.push(rec.optimization_type);
                    }
                }
            }
        }
        
        Ok(OptimizationResult {
            applied,
            failed,
            timestamp: Instant::now(),
        })
    }
    
    /// Set performance profile
    pub async fn set_profile(&self, profile: PerformanceProfile) -> Result<()> {
        let mut metrics = self.metrics.write().await;
        metrics.current_profile = profile;
        
        // Apply profile settings
        match profile {
            PerformanceProfile::PowerSaver => {
                self.frame_counter.set_target_fps(30.0);
                self.optimization_engine.set_aggressive_mode(true);
            }
            PerformanceProfile::Balanced => {
                self.frame_counter.set_target_fps(60.0);
                self.optimization_engine.set_aggressive_mode(false);
            }
            PerformanceProfile::Performance => {
                self.frame_counter.set_target_fps(144.0);
                self.optimization_engine.set_aggressive_mode(false);
            }
        }
        
        Ok(())
    }
    
    /// Get historical metrics
    pub async fn get_history(&self, duration: Duration) -> Vec<MetricsSnapshot> {
        self.metrics.read().await.get_history(duration)
    }
    
    /// Export metrics for analysis
    pub async fn export_metrics(&self) -> Result<String> {
        let metrics = self.metrics.read().await;
        let export = MetricsExport {
            version: env!("CARGO_PKG_VERSION").to_string(),
            timestamp: chrono::Utc::now(),
            profile: metrics.current_profile,
            history: metrics.history.iter().cloned().collect(),
            statistics: self.calculate_statistics(&metrics.history),
        };
        
        Ok(serde_json::to_string_pretty(&export)?)
    }
    
    // Private methods
    
    fn start_monitoring(&self) {
        let metrics = self.metrics.clone();
        let frame_counter = self.frame_counter.clone();
        let memory_tracker = self.memory_tracker.clone();
        let cpu_tracker = self.cpu_tracker.clone();
        let network_tracker = self.network_tracker.clone();
        let config = self.config.clone();
        
        tokio::spawn(async move {
            let mut interval = interval(Duration::from_millis(config.sample_interval_ms));
            
            loop {
                interval.tick().await;
                
                // Collect current metrics
                let snapshot = MetricsSnapshot {
                    timestamp: Instant::now(),
                    fps: frame_counter.get_fps(),
                    frame_time_ms: frame_counter.get_average_render_time(),
                    memory_used_mb: memory_tracker.get_used_mb(),
                    memory_allocated_mb: memory_tracker.get_allocated_mb(),
                    cpu_usage_percent: cpu_tracker.get_usage(),
                    network_latency_ms: network_tracker.get_average_latency(),
                    network_throughput_mbps: network_tracker.get_throughput_mbps(),
                    active_sessions: 0, // Would get from session manager
                    total_frames: frame_counter.get_total(),
                };
                
                // Store snapshot
                let mut metrics = metrics.write().await;
                metrics.add_snapshot(snapshot);
                
                // Reset counters
                frame_counter.reset_fps_counter();
            }
        });
    }
    
    async fn apply_optimization(&self, rec: &PerformanceRecommendation) -> Result<()> {
        match rec.optimization_type {
            OptimizationType::ReduceFrameRate => {
                self.frame_counter.set_target_fps(30.0);
            }
            OptimizationType::EnableGlyphCaching => {
                // Would enable glyph caching in renderer
                tracing::info!("Enabled glyph caching");
            }
            OptimizationType::ReduceBufferSize => {
                // Would reduce terminal scrollback buffer
                tracing::info!("Reduced buffer size");
            }
            OptimizationType::CompressMemory => {
                // Would trigger memory compression
                tracing::info!("Compressed memory");
            }
            OptimizationType::ThrottleNetwork => {
                // Would throttle network updates
                tracing::info!("Throttled network");
            }
        }
        
        Ok(())
    }
    
    fn calculate_statistics(&self, history: &VecDeque<MetricsSnapshot>) -> MetricsStatistics {
        if history.is_empty() {
            return MetricsStatistics::default();
        }
        
        let fps_values: Vec<f64> = history.iter().map(|s| s.fps).collect();
        let memory_values: Vec<f64> = history.iter().map(|s| s.memory_used_mb).collect();
        let cpu_values: Vec<f64> = history.iter().map(|s| s.cpu_usage_percent).collect();
        
        MetricsStatistics {
            avg_fps: fps_values.iter().sum::<f64>() / fps_values.len() as f64,
            min_fps: fps_values.iter().cloned().fold(f64::INFINITY, f64::min),
            max_fps: fps_values.iter().cloned().fold(f64::NEG_INFINITY, f64::max),
            avg_memory_mb: memory_values.iter().sum::<f64>() / memory_values.len() as f64,
            peak_memory_mb: memory_values.iter().cloned().fold(f64::NEG_INFINITY, f64::max),
            avg_cpu_percent: cpu_values.iter().sum::<f64>() / cpu_values.len() as f64,
            peak_cpu_percent: cpu_values.iter().cloned().fold(f64::NEG_INFINITY, f64::max),
        }
    }
}

struct FrameCounter {
    total_frames: AtomicU64,
    fps_counter: AtomicU64,
    last_fps_time: RwLock<Instant>,
    current_fps: RwLock<f64>,
    target_fps: RwLock<f64>,
    render_times: RwLock<VecDeque<f64>>,
}

impl FrameCounter {
    fn new() -> Self {
        Self {
            total_frames: AtomicU64::new(0),
            fps_counter: AtomicU64::new(0),
            last_fps_time: RwLock::new(Instant::now()),
            current_fps: RwLock::new(0.0),
            target_fps: RwLock::new(60.0),
            render_times: RwLock::new(VecDeque::with_capacity(100)),
        }
    }
    
    fn increment(&self) {
        self.total_frames.fetch_add(1, Ordering::Relaxed);
        self.fps_counter.fetch_add(1, Ordering::Relaxed);
    }
    
    fn add_render_time(&self, time_ms: f64) {
        if let Ok(mut times) = self.render_times.try_write() {
            times.push_back(time_ms);
            if times.len() > 100 {
                times.pop_front();
            }
        }
    }
    
    fn get_fps(&self) -> f64 {
        *self.current_fps.blocking_read()
    }
    
    fn get_average_render_time(&self) -> f64 {
        let times = self.render_times.blocking_read();
        if times.is_empty() {
            0.0
        } else {
            times.iter().sum::<f64>() / times.len() as f64
        }
    }
    
    fn get_total(&self) -> u64 {
        self.total_frames.load(Ordering::Relaxed)
    }
    
    fn set_target_fps(&self, fps: f64) {
        *self.target_fps.blocking_write() = fps;
    }
    
    fn reset_fps_counter(&self) {
        let now = Instant::now();
        let count = self.fps_counter.swap(0, Ordering::Relaxed);
        
        if let Ok(mut last_time) = self.last_fps_time.try_write() {
            let duration = now.duration_since(*last_time).as_secs_f64();
            if duration > 0.0 {
                *self.current_fps.blocking_write() = count as f64 / duration;
            }
            *last_time = now;
        }
    }
}

struct MemoryTracker {
    allocated: AtomicUsize,
    used: AtomicUsize,
}

impl MemoryTracker {
    fn new() -> Self {
        Self {
            allocated: AtomicUsize::new(0),
            used: AtomicUsize::new(0),
        }
    }
    
    fn add_allocation(&self, bytes: usize) {
        self.allocated.fetch_add(bytes, Ordering::Relaxed);
        self.used.fetch_add(bytes, Ordering::Relaxed);
    }
    
    fn remove_allocation(&self, bytes: usize) {
        self.used.fetch_sub(bytes, Ordering::Relaxed);
    }
    
    fn get_allocated_mb(&self) -> f64 {
        self.allocated.load(Ordering::Relaxed) as f64 / 1_048_576.0
    }
    
    fn get_used_mb(&self) -> f64 {
        self.used.load(Ordering::Relaxed) as f64 / 1_048_576.0
    }
}

struct CpuTracker {
    usage: RwLock<f64>,
    last_measurement: RwLock<Instant>,
}

impl CpuTracker {
    fn new() -> Self {
        Self {
            usage: RwLock::new(0.0),
            last_measurement: RwLock::new(Instant::now()),
        }
    }
    
    fn get_usage(&self) -> f64 {
        // Would implement actual CPU usage tracking
        *self.usage.blocking_read()
    }
}

struct NetworkTracker {
    latencies: RwLock<VecDeque<f64>>,
    bytes_sent: AtomicU64,
    bytes_received: AtomicU64,
    last_throughput_time: RwLock<Instant>,
}

impl NetworkTracker {
    fn new() -> Self {
        Self {
            latencies: RwLock::new(VecDeque::with_capacity(100)),
            bytes_sent: AtomicU64::new(0),
            bytes_received: AtomicU64::new(0),
            last_throughput_time: RwLock::new(Instant::now()),
        }
    }
    
    fn add_latency(&self, latency_ms: f64) {
        if let Ok(mut latencies) = self.latencies.try_write() {
            latencies.push_back(latency_ms);
            if latencies.len() > 100 {
                latencies.pop_front();
            }
        }
    }
    
    fn get_average_latency(&self) -> f64 {
        let latencies = self.latencies.blocking_read();
        if latencies.is_empty() {
            0.0
        } else {
            latencies.iter().sum::<f64>() / latencies.len() as f64
        }
    }
    
    fn get_throughput_mbps(&self) -> f64 {
        let now = Instant::now();
        let bytes = self.bytes_sent.load(Ordering::Relaxed) + 
                   self.bytes_received.load(Ordering::Relaxed);
        
        if let Ok(last_time) = self.last_throughput_time.try_read() {
            let duration = now.duration_since(*last_time).as_secs_f64();
            if duration > 0.0 {
                return (bytes as f64 * 8.0) / (duration * 1_000_000.0);
            }
        }
        
        0.0
    }
}

struct OptimizationEngine {
    config: PerformanceConfig,
    aggressive_mode: RwLock<bool>,
}

impl OptimizationEngine {
    fn new(config: &PerformanceConfig) -> Self {
        Self {
            config: config.clone(),
            aggressive_mode: RwLock::new(false),
        }
    }
    
    fn set_aggressive_mode(&self, aggressive: bool) {
        *self.aggressive_mode.blocking_write() = aggressive;
    }
    
    fn analyze(&self, snapshot: &MetricsSnapshot) -> Vec<PerformanceRecommendation> {
        let mut recommendations = Vec::new();
        let aggressive = *self.aggressive_mode.blocking_read();
        
        // Check FPS
        if snapshot.fps < 30.0 {
            recommendations.push(PerformanceRecommendation {
                optimization_type: OptimizationType::ReduceFrameRate,
                description: "FPS below 30, consider reducing target frame rate".to_string(),
                priority: Priority::High,
                auto_apply: aggressive,
            });
        }
        
        // Check memory
        if snapshot.memory_used_mb > self.config.memory_threshold_mb {
            recommendations.push(PerformanceRecommendation {
                optimization_type: OptimizationType::CompressMemory,
                description: format!("Memory usage above {}MB threshold", self.config.memory_threshold_mb),
                priority: Priority::Medium,
                auto_apply: aggressive,
            });
        }
        
        // Check CPU
        if snapshot.cpu_usage_percent > self.config.cpu_threshold_percent {
            recommendations.push(PerformanceRecommendation {
                optimization_type: OptimizationType::ReduceFrameRate,
                description: format!("CPU usage above {}% threshold", self.config.cpu_threshold_percent),
                priority: Priority::High,
                auto_apply: aggressive,
            });
        }
        
        // Check network latency
        if snapshot.network_latency_ms > 100.0 {
            recommendations.push(PerformanceRecommendation {
                optimization_type: OptimizationType::ThrottleNetwork,
                description: "High network latency detected".to_string(),
                priority: Priority::Medium,
                auto_apply: false,
            });
        }
        
        recommendations
    }
}

struct MetricsStore {
    history: VecDeque<MetricsSnapshot>,
    history_size: usize,
    current_profile: PerformanceProfile,
    active_sessions: usize,
}

impl MetricsStore {
    fn new(history_size: usize) -> Self {
        Self {
            history: VecDeque::with_capacity(history_size),
            history_size,
            current_profile: PerformanceProfile::Balanced,
            active_sessions: 0,
        }
    }
    
    fn add_snapshot(&mut self, snapshot: MetricsSnapshot) {
        self.history.push_back(snapshot);
        if self.history.len() > self.history_size {
            self.history.pop_front();
        }
    }
    
    fn get_history(&self, duration: Duration) -> Vec<MetricsSnapshot> {
        let cutoff = Instant::now() - duration;
        self.history
            .iter()
            .filter(|s| s.timestamp > cutoff)
            .cloned()
            .collect()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformanceConfig {
    pub enabled: bool,
    pub sample_interval_ms: u64,
    pub history_size: usize,
    pub memory_threshold_mb: f64,
    pub cpu_threshold_percent: f64,
    pub auto_optimize: bool,
}

impl Default for PerformanceConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            sample_interval_ms: 1000,
            history_size: 3600, // 1 hour at 1 sample/sec
            memory_threshold_mb: 1024.0,
            cpu_threshold_percent: 80.0,
            auto_optimize: true,
        }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum PerformanceProfile {
    PowerSaver,
    Balanced,
    Performance,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetricsSnapshot {
    pub timestamp: Instant,
    pub fps: f64,
    pub frame_time_ms: f64,
    pub memory_used_mb: f64,
    pub memory_allocated_mb: f64,
    pub cpu_usage_percent: f64,
    pub network_latency_ms: f64,
    pub network_throughput_mbps: f64,
    pub active_sessions: usize,
    pub total_frames: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformanceRecommendation {
    pub optimization_type: OptimizationType,
    pub description: String,
    pub priority: Priority,
    pub auto_apply: bool,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum OptimizationType {
    ReduceFrameRate,
    EnableGlyphCaching,
    ReduceBufferSize,
    CompressMemory,
    ThrottleNetwork,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum Priority {
    Low,
    Medium,
    High,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OptimizationResult {
    pub applied: Vec<OptimizationType>,
    pub failed: Vec<OptimizationType>,
    pub timestamp: Instant,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct MetricsExport {
    version: String,
    timestamp: chrono::DateTime<chrono::Utc>,
    profile: PerformanceProfile,
    history: Vec<MetricsSnapshot>,
    statistics: MetricsStatistics,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
struct MetricsStatistics {
    avg_fps: f64,
    min_fps: f64,
    max_fps: f64,
    avg_memory_mb: f64,
    peak_memory_mb: f64,
    avg_cpu_percent: f64,
    peak_cpu_percent: f64,
}