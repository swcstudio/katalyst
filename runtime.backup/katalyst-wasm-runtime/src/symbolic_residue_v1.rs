/// Symbolic Residue V1 - Implementation of the Symbolic Residue Schema
/// 
/// This module implements the symbolicResidue.v1.json schema for tracking
/// and managing symbolic residue in semantic fields.

use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use chrono::Utc;

#[cfg(feature = "pyo3")]
use pyo3::prelude::*;

/// Residue state types as defined in the schema
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum ResidueState {
    #[serde(rename = "surfaced")]
    Surfaced,
    #[serde(rename = "echo")]
    Echo,
    #[serde(rename = "integrated")]
    Integrated,
    #[serde(rename = "shadow")]
    Shadow,
    #[serde(rename = "orphaned")]
    Orphaned,
}

/// Interaction types for residue
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum InteractionType {
    #[serde(rename = "integration")]
    Integration,
    #[serde(rename = "resonance")]
    Resonance,
    #[serde(rename = "echo")]
    Echo,
    #[serde(rename = "inhibition")]
    Inhibition,
    #[serde(rename = "amplification")]
    Amplification,
}

/// Surface mode for residue operations
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum SurfaceMode {
    #[serde(rename = "standard")]
    Standard,
    #[serde(rename = "recursive")]
    Recursive,
    #[serde(rename = "deep")]
    Deep,
    #[serde(rename = "adaptive")]
    Adaptive,
}

/// Compression algorithm types
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum CompressionAlgorithm {
    #[serde(rename = "semantic")]
    Semantic,
    #[serde(rename = "pattern")]
    Pattern,
    #[serde(rename = "entropy")]
    Entropy,
    #[serde(rename = "hybrid")]
    Hybrid,
}

/// Integration method types
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum IntegrationMethod {
    #[serde(rename = "direct")]
    Direct,
    #[serde(rename = "gradual")]
    Gradual,
    #[serde(rename = "resonant")]
    Resonant,
    #[serde(rename = "attractor-mediated")]
    AttractorMediated,
}

/// Propagation pattern for echoes
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum PropagationPattern {
    #[serde(rename = "radial")]
    Radial,
    #[serde(rename = "directed")]
    Directed,
    #[serde(rename = "attractor-guided")]
    AttractorGuided,
    #[serde(rename = "boundary-following")]
    BoundaryFollowing,
}

/// Individual residue interaction
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResidueInteraction {
    pub target: String,
    #[serde(rename = "type")]
    pub interaction_type: InteractionType,
    pub strength_delta: f64,
    pub timestamp: Option<String>,
}

/// Individual tracked residue
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrackedResidue {
    pub id: String,
    pub content: String,
    pub source: Option<String>,
    pub strength: f64,
    pub state: ResidueState,
    #[wasm_bindgen(skip)]
    pub interactions: Vec<ResidueInteraction>,
}

#[wasm_bindgen]
impl TrackedResidue {
    #[wasm_bindgen(constructor)]
    pub fn new(id: String, content: String, strength: f64, state: ResidueState) -> Self {
        Self {
            id,
            content,
            source: None,
            strength: strength.max(0.0).min(1.0),
            state,
            interactions: Vec::new(),
        }
    }
    
    #[wasm_bindgen(js_name = setSource)]
    pub fn set_source(&mut self, source: String) {
        self.source = Some(source);
    }
    
    #[wasm_bindgen(js_name = addInteraction)]
    pub fn add_interaction(
        &mut self, 
        target: String, 
        interaction_type: InteractionType, 
        strength_delta: f64
    ) {
        self.interactions.push(ResidueInteraction {
            target,
            interaction_type,
            strength_delta,
            timestamp: Some(Utc::now().to_rfc3339()),
        });
        
        // Update strength based on interaction
        self.strength = (self.strength + strength_delta).max(0.0).min(1.0);
    }
    
    #[wasm_bindgen(js_name = updateState)]
    pub fn update_state(&mut self, new_state: ResidueState) {
        self.state = new_state;
    }
    
    #[wasm_bindgen(js_name = getStrength)]
    pub fn get_strength(&self) -> f64 {
        self.strength
    }
    
    #[wasm_bindgen(js_name = toJson)]
    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(self).unwrap_or_default()
    }
}

/// Residue tracking metrics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResidueMetrics {
    pub integrated_count: u32,
    pub surfaced_count: u32,
    pub echo_count: u32,
    pub average_strength: f64,
    pub integration_rate: f64,
}

impl Default for ResidueMetrics {
    fn default() -> Self {
        Self {
            integrated_count: 0,
            surfaced_count: 0,
            echo_count: 0,
            average_strength: 0.0,
            integration_rate: 0.0,
        }
    }
}

/// Processing strategy configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessingStrategy {
    pub surface_threshold: f64,
    pub integration_threshold: f64,
    pub echo_threshold: f64,
    pub compression_enabled: bool,
    pub auto_integration: bool,
}

impl Default for ProcessingStrategy {
    fn default() -> Self {
        Self {
            surface_threshold: 0.3,
            integration_threshold: 0.7,
            echo_threshold: 0.5,
            compression_enabled: false,
            auto_integration: true,
        }
    }
}

/// Residue tracking configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResidueTracking {
    pub enabled: bool,
    #[serde(rename = "trackedResidues")]
    pub tracked_residues: Vec<TrackedResidue>,
    #[serde(rename = "residueMetrics")]
    pub residue_metrics: ResidueMetrics,
    #[serde(rename = "processingStrategy")]
    pub processing_strategy: ProcessingStrategy,
}

/// Residue type definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResidueTypeDefinition {
    pub description: String,
    pub decay_rate: Option<f64>,
    pub integration_probability: Option<f64>,
    pub resonance_factor: Option<f64>,
    pub stability_factor: Option<f64>,
    pub influence_radius: Option<f64>,
    pub detection_threshold: Option<f64>,
    pub influence_factor: Option<f64>,
    pub reconnection_probability: Option<f64>,
}

/// Surface operation parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SurfaceOperationParams {
    pub mode: SurfaceMode,
    pub sensitivity: f64,
    pub max_count: Option<u32>,
}

/// Compress operation parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompressOperationParams {
    pub ratio: f64,
    pub preserve_semantics: bool,
    pub algorithm: CompressionAlgorithm,
}

/// Integrate operation parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IntegrateOperationParams {
    pub method: IntegrationMethod,
    pub target: String,
    pub strength_factor: f64,
}

/// Echo operation parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EchoOperationParams {
    pub resonance_factor: f64,
    pub decay_rate: f64,
    pub propagation_pattern: PropagationPattern,
}

/// Operation definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResidueOperation {
    pub description: String,
    pub parameters: Value,
}

/// Main Symbolic Residue V1 Schema implementation
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SymbolicResidueV1 {
    #[serde(rename = "residueTracking")]
    #[wasm_bindgen(skip)]
    pub residue_tracking: ResidueTracking,
    
    #[serde(rename = "residueTypes")]
    #[wasm_bindgen(skip)]
    pub residue_types: HashMap<String, ResidueTypeDefinition>,
    
    #[serde(rename = "residueOperations")]
    #[wasm_bindgen(skip)]
    pub residue_operations: HashMap<String, ResidueOperation>,
}

#[wasm_bindgen]
impl SymbolicResidueV1 {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut residue_types = HashMap::new();
        
        // Initialize default residue types
        residue_types.insert("surfaced".to_string(), ResidueTypeDefinition {
            description: "Newly detected symbolic fragments".to_string(),
            decay_rate: Some(0.1),
            integration_probability: Some(0.5),
            resonance_factor: None,
            stability_factor: None,
            influence_radius: None,
            detection_threshold: None,
            influence_factor: None,
            reconnection_probability: None,
        });
        
        residue_types.insert("echo".to_string(), ResidueTypeDefinition {
            description: "Residue that continues to influence the field after removal".to_string(),
            decay_rate: Some(0.05),
            integration_probability: None,
            resonance_factor: Some(1.2),
            stability_factor: None,
            influence_radius: None,
            detection_threshold: None,
            influence_factor: None,
            reconnection_probability: None,
        });
        
        residue_types.insert("integrated".to_string(), ResidueTypeDefinition {
            description: "Residue successfully incorporated into field structure".to_string(),
            decay_rate: None,
            integration_probability: None,
            resonance_factor: None,
            stability_factor: Some(0.9),
            influence_radius: Some(2.0),
            detection_threshold: None,
            influence_factor: None,
            reconnection_probability: None,
        });
        
        residue_types.insert("shadow".to_string(), ResidueTypeDefinition {
            description: "Subtle imprint of previously processed information".to_string(),
            decay_rate: None,
            integration_probability: None,
            resonance_factor: None,
            stability_factor: None,
            influence_radius: None,
            detection_threshold: Some(0.2),
            influence_factor: Some(0.3),
            reconnection_probability: None,
        });
        
        residue_types.insert("orphaned".to_string(), ResidueTypeDefinition {
            description: "Residue disconnected from its original context".to_string(),
            decay_rate: Some(0.15),
            integration_probability: None,
            resonance_factor: None,
            stability_factor: None,
            influence_radius: None,
            detection_threshold: None,
            influence_factor: None,
            reconnection_probability: Some(0.3),
        });
        
        // Initialize operations
        let mut residue_operations = HashMap::new();
        
        residue_operations.insert("surface".to_string(), ResidueOperation {
            description: "Operation for surfacing residue".to_string(),
            parameters: serde_json::json!({
                "mode": "standard",
                "sensitivity": 0.5,
                "max_count": 10
            }),
        });
        
        residue_operations.insert("compress".to_string(), ResidueOperation {
            description: "Operation for compressing residue".to_string(),
            parameters: serde_json::json!({
                "ratio": 0.5,
                "preserve_semantics": true,
                "algorithm": "semantic"
            }),
        });
        
        residue_operations.insert("integrate".to_string(), ResidueOperation {
            description: "Operation for integrating residue into field".to_string(),
            parameters: serde_json::json!({
                "method": "gradual",
                "target": "field",
                "strength_factor": 1.0
            }),
        });
        
        residue_operations.insert("echo".to_string(), ResidueOperation {
            description: "Operation for creating residue echoes".to_string(),
            parameters: serde_json::json!({
                "resonance_factor": 1.5,
                "decay_rate": 0.1,
                "propagation_pattern": "radial"
            }),
        });
        
        Self {
            residue_tracking: ResidueTracking {
                enabled: true,
                tracked_residues: Vec::new(),
                residue_metrics: ResidueMetrics::default(),
                processing_strategy: ProcessingStrategy::default(),
            },
            residue_types,
            residue_operations,
        }
    }
    
    #[wasm_bindgen(js_name = fromJson)]
    pub fn from_json(json_str: &str) -> Result<SymbolicResidueV1, JsValue> {
        serde_json::from_str(json_str)
            .map_err(|e| JsValue::from_str(&format!("Failed to parse symbolic residue: {}", e)))
    }
    
    #[wasm_bindgen(js_name = toJson)]
    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(self).unwrap_or_default()
    }
    
    #[wasm_bindgen(js_name = enableTracking)]
    pub fn enable_tracking(&mut self, enabled: bool) {
        self.residue_tracking.enabled = enabled;
    }
    
    #[wasm_bindgen(js_name = addResidue)]
    pub fn add_residue(&mut self, residue: TrackedResidue) {
        self.residue_tracking.tracked_residues.push(residue);
        self.update_metrics();
    }
    
    #[wasm_bindgen(js_name = removeResidue)]
    pub fn remove_residue(&mut self, id: &str) -> Option<TrackedResidue> {
        let index = self.residue_tracking.tracked_residues
            .iter()
            .position(|r| r.id == id)?;
        
        let residue = self.residue_tracking.tracked_residues.remove(index);
        self.update_metrics();
        Some(residue)
    }
    
    #[wasm_bindgen(js_name = getResidue)]
    pub fn get_residue(&self, id: &str) -> Option<TrackedResidue> {
        self.residue_tracking.tracked_residues
            .iter()
            .find(|r| r.id == id)
            .cloned()
    }
    
    #[wasm_bindgen(js_name = updateMetrics)]
    pub fn update_metrics(&mut self) {
        let residues = &self.residue_tracking.tracked_residues;
        
        if residues.is_empty() {
            self.residue_tracking.residue_metrics = ResidueMetrics::default();
            return;
        }
        
        let mut metrics = ResidueMetrics::default();
        let mut total_strength = 0.0;
        
        for residue in residues {
            match residue.state {
                ResidueState::Integrated => metrics.integrated_count += 1,
                ResidueState::Surfaced => metrics.surfaced_count += 1,
                ResidueState::Echo => metrics.echo_count += 1,
                _ => {}
            }
            total_strength += residue.strength;
        }
        
        metrics.average_strength = total_strength / residues.len() as f64;
        
        // Calculate integration rate (integrated / total)
        let total = residues.len() as f64;
        metrics.integration_rate = if total > 0.0 {
            metrics.integrated_count as f64 / total
        } else {
            0.0
        };
        
        self.residue_tracking.residue_metrics = metrics;
    }
    
    #[wasm_bindgen(js_name = surfaceResidues)]
    pub fn surface_residues(&mut self, max_count: Option<u32>) -> Vec<String> {
        let strategy = &self.residue_tracking.processing_strategy;
        let max = max_count.unwrap_or(10);
        let mut surfaced_ids = Vec::new();
        
        for residue in &mut self.residue_tracking.tracked_residues {
            if surfaced_ids.len() >= max as usize {
                break;
            }
            
            if residue.strength >= strategy.surface_threshold 
                && residue.state != ResidueState::Surfaced {
                residue.state = ResidueState::Surfaced;
                surfaced_ids.push(residue.id.clone());
            }
        }
        
        self.update_metrics();
        surfaced_ids
    }
    
    #[wasm_bindgen(js_name = integrateResidues)]
    pub fn integrate_residues(&mut self) -> Vec<String> {
        let strategy = &self.residue_tracking.processing_strategy;
        let mut integrated_ids = Vec::new();
        
        if !strategy.auto_integration {
            return integrated_ids;
        }
        
        for residue in &mut self.residue_tracking.tracked_residues {
            if residue.strength >= strategy.integration_threshold 
                && residue.state == ResidueState::Surfaced {
                residue.state = ResidueState::Integrated;
                integrated_ids.push(residue.id.clone());
            }
        }
        
        self.update_metrics();
        integrated_ids
    }
    
    #[wasm_bindgen(js_name = createEchoes)]
    pub fn create_echoes(&mut self) -> Vec<String> {
        let strategy = &self.residue_tracking.processing_strategy;
        let mut echo_ids = Vec::new();
        
        for residue in &mut self.residue_tracking.tracked_residues {
            if residue.strength >= strategy.echo_threshold 
                && residue.state == ResidueState::Integrated {
                // Create a new echo residue
                let echo_id = format!("{}_echo", residue.id);
                let echo = TrackedResidue::new(
                    echo_id.clone(),
                    format!("Echo of: {}", residue.content),
                    residue.strength * 0.7, // Echoes are weaker
                    ResidueState::Echo
                );
                
                self.residue_tracking.tracked_residues.push(echo);
                echo_ids.push(echo_id);
            }
        }
        
        self.update_metrics();
        echo_ids
    }
    
    #[wasm_bindgen(js_name = decayResidues)]
    pub fn decay_residues(&mut self, decay_factor: f64) {
        for residue in &mut self.residue_tracking.tracked_residues {
            // Apply decay based on state
            let decay_rate = match residue.state {
                ResidueState::Surfaced => 0.1,
                ResidueState::Echo => 0.05,
                ResidueState::Shadow => 0.02,
                ResidueState::Orphaned => 0.15,
                ResidueState::Integrated => 0.0, // Integrated residues don't decay
            };
            
            residue.strength = (residue.strength * (1.0 - decay_rate * decay_factor))
                .max(0.0)
                .min(1.0);
        }
        
        // Remove residues with strength below threshold
        self.residue_tracking.tracked_residues.retain(|r| r.strength > 0.01);
        self.update_metrics();
    }
    
    #[wasm_bindgen(js_name = getMetrics)]
    pub fn get_metrics(&self) -> String {
        serde_json::to_string_pretty(&self.residue_tracking.residue_metrics)
            .unwrap_or_default()
    }
    
    #[wasm_bindgen(js_name = setProcessingStrategy)]
    pub fn set_processing_strategy(
        &mut self,
        surface_threshold: f64,
        integration_threshold: f64,
        echo_threshold: f64,
        compression_enabled: bool,
        auto_integration: bool
    ) {
        self.residue_tracking.processing_strategy = ProcessingStrategy {
            surface_threshold,
            integration_threshold,
            echo_threshold,
            compression_enabled,
            auto_integration,
        };
    }
}

/// Residue Manager for higher-level operations
#[wasm_bindgen]
pub struct ResidueManager {
    schema: SymbolicResidueV1,
    #[wasm_bindgen(skip)]
    operation_log: Vec<String>,
}

#[wasm_bindgen]
impl ResidueManager {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            schema: SymbolicResidueV1::new(),
            operation_log: Vec::new(),
        }
    }
    
    #[wasm_bindgen(js_name = processField)]
    pub fn process_field(&mut self, field_data: &str) -> String {
        self.log("Starting field processing");
        
        // Simulate field processing
        let surfaced = self.schema.surface_residues(Some(5));
        self.log(&format!("Surfaced {} residues", surfaced.len()));
        
        let integrated = self.schema.integrate_residues();
        self.log(&format!("Integrated {} residues", integrated.len()));
        
        let echoes = self.schema.create_echoes();
        self.log(&format!("Created {} echoes", echoes.len()));
        
        self.schema.decay_residues(1.0);
        self.log("Applied decay to all residues");
        
        self.schema.get_metrics()
    }
    
    #[wasm_bindgen(js_name = addFieldResidue)]
    pub fn add_field_residue(&mut self, content: String, strength: f64) -> String {
        let id = format!("residue_{}", Utc::now().timestamp_millis());
        let residue = TrackedResidue::new(
            id.clone(),
            content,
            strength,
            ResidueState::Surfaced
        );
        
        self.schema.add_residue(residue);
        self.log(&format!("Added residue: {}", id));
        
        id
    }
    
    #[wasm_bindgen(js_name = getOperationLog)]
    pub fn get_operation_log(&self) -> Vec<String> {
        self.operation_log.clone()
    }
    
    #[wasm_bindgen(js_name = clearLog)]
    pub fn clear_log(&mut self) {
        self.operation_log.clear();
    }
    
    fn log(&mut self, message: &str) {
        self.operation_log.push(format!(
            "[{}] {}",
            Utc::now().format("%Y-%m-%d %H:%M:%S"),
            message
        ));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_residue_creation() {
        let residue = TrackedResidue::new(
            "test_id".to_string(),
            "test content".to_string(),
            0.5,
            ResidueState::Surfaced
        );
        
        assert_eq!(residue.id, "test_id");
        assert_eq!(residue.strength, 0.5);
        assert_eq!(residue.state, ResidueState::Surfaced);
    }
    
    #[test]
    fn test_residue_interactions() {
        let mut residue = TrackedResidue::new(
            "test_id".to_string(),
            "test content".to_string(),
            0.5,
            ResidueState::Surfaced
        );
        
        residue.add_interaction(
            "target_1".to_string(),
            InteractionType::Amplification,
            0.2
        );
        
        assert_eq!(residue.strength, 0.7);
        assert_eq!(residue.interactions.len(), 1);
    }
    
    #[test]
    fn test_symbolic_residue_schema() {
        let mut schema = SymbolicResidueV1::new();
        
        assert!(schema.residue_tracking.enabled);
        assert_eq!(schema.residue_types.len(), 5);
        assert_eq!(schema.residue_operations.len(), 4);
        
        // Test adding residue
        let residue = TrackedResidue::new(
            "test".to_string(),
            "content".to_string(),
            0.8,
            ResidueState::Surfaced
        );
        
        schema.add_residue(residue);
        assert_eq!(schema.residue_tracking.tracked_residues.len(), 1);
    }
    
    #[test]
    fn test_metrics_calculation() {
        let mut schema = SymbolicResidueV1::new();
        
        // Add various residues
        schema.add_residue(TrackedResidue::new(
            "1".to_string(), "c1".to_string(), 0.8, ResidueState::Integrated
        ));
        schema.add_residue(TrackedResidue::new(
            "2".to_string(), "c2".to_string(), 0.6, ResidueState::Surfaced
        ));
        schema.add_residue(TrackedResidue::new(
            "3".to_string(), "c3".to_string(), 0.4, ResidueState::Echo
        ));
        
        let metrics = &schema.residue_tracking.residue_metrics;
        assert_eq!(metrics.integrated_count, 1);
        assert_eq!(metrics.surfaced_count, 1);
        assert_eq!(metrics.echo_count, 1);
        assert!((metrics.average_strength - 0.6).abs() < 0.01);
    }
    
    #[test]
    fn test_residue_operations() {
        let mut schema = SymbolicResidueV1::new();
        
        // Add residues for testing
        for i in 0..5 {
            schema.add_residue(TrackedResidue::new(
                format!("res_{}", i),
                format!("content_{}", i),
                0.3 + (i as f64 * 0.1),
                ResidueState::Orphaned
            ));
        }
        
        // Test surfacing
        let surfaced = schema.surface_residues(Some(3));
        assert!(surfaced.len() <= 3);
        
        // Test integration
        schema.set_processing_strategy(0.3, 0.5, 0.4, false, true);
        let integrated = schema.integrate_residues();
        assert!(integrated.len() > 0);
        
        // Test decay
        let initial_count = schema.residue_tracking.tracked_residues.len();
        schema.decay_residues(10.0); // Heavy decay
        assert!(schema.residue_tracking.tracked_residues.len() <= initial_count);
    }
    
    #[test]
    fn test_json_serialization() {
        let schema = SymbolicResidueV1::new();
        let json = schema.to_json();
        
        assert!(json.contains("\"residueTracking\""));
        assert!(json.contains("\"residueTypes\""));
        assert!(json.contains("\"residueOperations\""));
        
        // Test deserialization
        let deserialized = SymbolicResidueV1::from_json(&json);
        assert!(deserialized.is_ok());
    }
}