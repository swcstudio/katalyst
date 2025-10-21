/// Field Resonance Measurement for Neural Context Engineering
/// 
/// This module provides WebAssembly-compatible tools for measuring resonance,
/// coherence, and other properties of neural fields in context engineering applications.
/// Designed for integration with the Katalyst framework and optimized for WASM runtime.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use chrono::Utc;

#[cfg(feature = "pyo3")]
use pyo3::prelude::*;

/// Configuration for field resonance measurement
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResonanceConfig {
    pub method: String,           // "cosine", "overlap", "embedding"
    pub threshold: f32,           // Minimum threshold for resonance effects
    pub amplification: f32,       // Amplification factor for resonance
    pub sampling: String,         // "full", "random", "strength_weighted"
    pub sample_size: usize,
}

#[wasm_bindgen]
impl ResonanceConfig {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            method: "cosine".to_string(),
            threshold: 0.2,
            amplification: 1.2,
            sampling: "strength_weighted".to_string(),
            sample_size: 100,
        }
    }

    #[wasm_bindgen(js_name = withMethod)]
    pub fn with_method(mut self, method: String) -> Self {
        self.method = method;
        self
    }

    #[wasm_bindgen(js_name = withThreshold)]
    pub fn with_threshold(mut self, threshold: f32) -> Self {
        self.threshold = threshold;
        self
    }
}

/// Pattern representation in the neural field
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Pattern {
    pub content: String,
    pub strength: f32,
    #[wasm_bindgen(skip)]
    pub metadata: HashMap<String, String>,
}

#[wasm_bindgen]
impl Pattern {
    #[wasm_bindgen(constructor)]
    pub fn new(content: String, strength: f32) -> Self {
        Self {
            content,
            strength,
            metadata: HashMap::new(),
        }
    }

    #[wasm_bindgen(js_name = addMetadata)]
    pub fn add_metadata(&mut self, key: String, value: String) {
        self.metadata.insert(key, value);
    }
}

/// Attractor in the neural field
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Attractor {
    pub pattern: String,
    pub strength: f32,
    pub stability: f32,
}

#[wasm_bindgen]
impl Attractor {
    #[wasm_bindgen(constructor)]
    pub fn new(pattern: String, strength: f32, stability: f32) -> Self {
        Self {
            pattern,
            strength,
            stability,
        }
    }
}

/// Field state enum
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum FieldState {
    Stable,
    Resonant,
    Transitioning,
    Chaotic,
    Collapsed,
}

/// Semantic field - a higher-level abstraction over neural fields
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SemanticField {
    pub name: String,
    #[wasm_bindgen(skip)]
    pub neural_field: NeuralField,
    pub state: FieldState,
    pub resonance: f32,
    pub coherence: f32,
    pub last_updated: String,
}

#[wasm_bindgen]
impl SemanticField {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String) -> Self {
        Self {
            name,
            neural_field: NeuralField::new(),
            state: FieldState::Stable,
            resonance: 0.0,
            coherence: 1.0,
            last_updated: chrono::Utc::now().to_rfc3339(),
        }
    }
    
    #[wasm_bindgen(js_name = updateState)]
    pub fn update_state(&mut self, state: FieldState) {
        self.state = state;
        self.last_updated = chrono::Utc::now().to_rfc3339();
    }
    
    #[wasm_bindgen(js_name = updateResonance)]
    pub fn update_resonance(&mut self, resonance: f32) {
        self.resonance = resonance.max(0.0).min(1.0);
        self.last_updated = chrono::Utc::now().to_rfc3339();
        
        // Update state based on resonance
        if self.resonance > 0.8 {
            self.state = FieldState::Resonant;
        } else if self.resonance < 0.2 {
            self.state = FieldState::Collapsed;
        }
    }
    
    #[wasm_bindgen(js_name = updateCoherence)]
    pub fn update_coherence(&mut self, coherence: f32) {
        self.coherence = coherence.max(0.0).min(1.0);
        self.neural_field.coherence = coherence;
        self.last_updated = chrono::Utc::now().to_rfc3339();
        
        // Update state based on coherence
        if self.coherence < 0.3 {
            self.state = FieldState::Chaotic;
        } else if self.coherence > 0.7 && self.state == FieldState::Chaotic {
            self.state = FieldState::Transitioning;
        }
    }
    
    #[wasm_bindgen(js_name = getState)]
    pub fn get_state(&self) -> FieldState {
        self.state
    }
    
    #[wasm_bindgen(js_name = addPattern)]
    pub fn add_pattern(&mut self, pattern: Pattern) {
        self.neural_field.add_pattern(pattern);
        self.last_updated = chrono::Utc::now().to_rfc3339();
    }
    
    #[wasm_bindgen(js_name = addAttractor)]
    pub fn add_attractor(&mut self, attractor: Attractor) {
        self.neural_field.add_attractor(attractor);
        self.last_updated = chrono::Utc::now().to_rfc3339();
    }
}

/// Neural field representation
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NeuralField {
    #[wasm_bindgen(skip)]
    pub patterns: Vec<Pattern>,
    #[wasm_bindgen(skip)]
    pub attractors: Vec<Attractor>,
    pub coherence: f32,
    pub stability: f32,
    pub entropy: f32,
}

#[wasm_bindgen]
impl NeuralField {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            patterns: Vec::new(),
            attractors: Vec::new(),
            coherence: 0.0,
            stability: 0.0,
            entropy: 1.0,
        }
    }

    #[wasm_bindgen(js_name = addPattern)]
    pub fn add_pattern(&mut self, pattern: Pattern) {
        self.patterns.push(pattern);
    }

    #[wasm_bindgen(js_name = addAttractor)]
    pub fn add_attractor(&mut self, attractor: Attractor) {
        self.attractors.push(attractor);
    }

    #[wasm_bindgen(js_name = getPatternCount)]
    pub fn get_pattern_count(&self) -> usize {
        self.patterns.len()
    }

    #[wasm_bindgen(js_name = getAttractorCount)]
    pub fn get_attractor_count(&self) -> usize {
        self.attractors.len()
    }

    /// Serialize to JSON for JS interop
    #[wasm_bindgen(js_name = toJson)]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }

    /// Deserialize from JSON
    #[wasm_bindgen(js_name = fromJson)]
    pub fn from_json(json: &str) -> Result<NeuralField, JsValue> {
        serde_json::from_str(json)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

/// Main resonance measurer for WebAssembly
#[wasm_bindgen]
pub struct ResonanceMeasurer {
    config: ResonanceConfig,
}

#[wasm_bindgen]
impl ResonanceMeasurer {
    #[wasm_bindgen(constructor)]
    pub fn new(config: ResonanceConfig) -> Self {
        Self { config }
    }

    /// Measure resonance between two patterns
    #[wasm_bindgen(js_name = measureResonance)]
    pub fn measure_resonance(&self, pattern1: &str, pattern2: &str) -> f32 {
        match self.config.method.as_str() {
            "cosine" => self.cosine_similarity(pattern1, pattern2),
            "overlap" => self.word_overlap(pattern1, pattern2),
            _ => self.cosine_similarity(pattern1, pattern2),
        }
    }

    /// Calculate cosine similarity based on word frequency
    fn cosine_similarity(&self, pattern1: &str, pattern2: &str) -> f32 {
        let words1 = self.get_word_freq(pattern1);
        let words2 = self.get_word_freq(pattern2);

        // Find common words
        let mut dot_product = 0.0;
        for (word, freq1) in &words1 {
            if let Some(freq2) = words2.get(word) {
                dot_product += freq1 * freq2;
            }
        }

        // Calculate magnitudes
        let mag1: f32 = words1.values().map(|v| v * v).sum::<f32>().sqrt();
        let mag2: f32 = words2.values().map(|v| v * v).sum::<f32>().sqrt();

        if mag1 == 0.0 || mag2 == 0.0 {
            return 0.0;
        }

        let similarity = dot_product / (mag1 * mag2);

        // Apply threshold and amplification
        if similarity < self.config.threshold {
            0.0
        } else {
            (similarity * self.config.amplification).min(1.0)
        }
    }

    /// Calculate word overlap (Jaccard similarity)
    fn word_overlap(&self, pattern1: &str, pattern2: &str) -> f32 {
        use std::collections::HashSet;

        let words1: HashSet<String> = pattern1.to_lowercase()
            .split_whitespace()
            .map(|s| s.to_string())
            .collect();
        let words2: HashSet<String> = pattern2.to_lowercase()
            .split_whitespace()
            .map(|s| s.to_string())
            .collect();

        if words1.is_empty() || words2.is_empty() {
            return 0.0;
        }

        let intersection = words1.intersection(&words2).count() as f32;
        let union = words1.union(&words2).count() as f32;

        let similarity = intersection / union;

        if similarity < self.config.threshold {
            0.0
        } else {
            (similarity * self.config.amplification).min(1.0)
        }
    }

    /// Get word frequency map
    fn get_word_freq(&self, text: &str) -> HashMap<String, f32> {
        let mut freq = HashMap::new();
        for word in text.to_lowercase().split_whitespace() {
            *freq.entry(word.to_string()).or_insert(0.0) += 1.0;
        }
        freq
    }

    /// Measure field coherence
    #[wasm_bindgen(js_name = measureCoherence)]
    pub fn measure_coherence(&self, field: &NeuralField) -> f32 {
        if field.patterns.is_empty() {
            return 1.0;
        }

        match self.config.method.as_str() {
            "attractor_alignment" => self.attractor_alignment_coherence(field),
            "pairwise" => self.pairwise_coherence(field),
            _ => self.attractor_alignment_coherence(field),
        }
    }

    /// Calculate coherence based on attractor alignment
    fn attractor_alignment_coherence(&self, field: &NeuralField) -> f32 {
        if field.attractors.is_empty() {
            return self.pairwise_coherence(field);
        }

        let patterns = self.sample_patterns(field);
        let mut total_alignment = 0.0;
        let mut total_weight = 0.0;

        for pattern in &patterns {
            let mut best_alignment = 0.0;
            for attractor in &field.attractors {
                let alignment = self.measure_resonance(&pattern.content, &attractor.pattern);
                if alignment > best_alignment {
                    best_alignment = alignment;
                }
            }
            total_alignment += best_alignment * pattern.strength;
            total_weight += pattern.strength;
        }

        if total_weight == 0.0 {
            0.0
        } else {
            total_alignment / total_weight
        }
    }

    /// Calculate pairwise coherence
    fn pairwise_coherence(&self, field: &NeuralField) -> f32 {
        let patterns = self.sample_patterns(field);
        
        if patterns.len() < 2 {
            return 1.0;
        }

        let mut total_resonance = 0.0;
        let mut pair_count = 0;

        for i in 0..patterns.len() {
            for j in (i + 1)..patterns.len() {
                let resonance = self.measure_resonance(
                    &patterns[i].content,
                    &patterns[j].content
                );
                let weighted_resonance = resonance * patterns[i].strength * patterns[j].strength;
                total_resonance += weighted_resonance;
                pair_count += 1;
            }
        }

        if pair_count == 0 {
            0.0
        } else {
            total_resonance / pair_count as f32
        }
    }

    /// Sample patterns based on sampling strategy
    fn sample_patterns(&self, field: &NeuralField) -> Vec<Pattern> {
        let patterns = &field.patterns;
        
        if patterns.is_empty() || 
           self.config.sampling == "full" || 
           patterns.len() <= self.config.sample_size {
            return patterns.clone();
        }

        match self.config.sampling.as_str() {
            "strength_weighted" => {
                let mut sorted_patterns = patterns.clone();
                sorted_patterns.sort_by(|a, b| b.strength.partial_cmp(&a.strength).unwrap());
                sorted_patterns.truncate(self.config.sample_size);
                sorted_patterns
            }
            _ => patterns.clone()
        }
    }

    /// Measure field stability
    #[wasm_bindgen(js_name = measureStability)]
    pub fn measure_stability(&self, field: &NeuralField) -> f32 {
        if field.attractors.is_empty() {
            return 0.0;
        }

        let avg_attractor_strength: f32 = field.attractors
            .iter()
            .map(|a| a.strength)
            .sum::<f32>() / field.attractors.len() as f32;

        let organization = self.measure_coherence(field);

        // Weighted combination
        let attractor_weight = 0.6;
        let organization_weight = 0.4;

        (avg_attractor_strength * attractor_weight + organization * organization_weight).min(1.0)
    }

    /// Calculate field entropy
    #[wasm_bindgen(js_name = calculateEntropy)]
    pub fn calculate_entropy(&self, field: &NeuralField) -> f32 {
        if field.patterns.is_empty() {
            return 1.0;
        }

        let total_strength: f32 = field.patterns.iter().map(|p| p.strength).sum();
        
        if total_strength == 0.0 {
            return 1.0;
        }

        let mut entropy = 0.0;
        for pattern in &field.patterns {
            let p = pattern.strength / total_strength;
            if p > 0.0 {
                entropy -= p * p.log2();
            }
        }

        // Normalize to 0-1 range
        let max_entropy = (field.patterns.len() as f32).log2();
        if max_entropy == 0.0 {
            0.0
        } else {
            entropy / max_entropy
        }
    }

    /// Get comprehensive field metrics
    #[wasm_bindgen(js_name = getFieldMetrics)]
    pub fn get_field_metrics(&self, field: &mut NeuralField) -> String {
        field.coherence = self.measure_coherence(field);
        field.stability = self.measure_stability(field);
        field.entropy = self.calculate_entropy(field);

        let metrics = FieldMetrics {
            coherence: field.coherence,
            stability: field.stability,
            entropy: field.entropy,
            attractor_count: field.attractors.len(),
            pattern_count: field.patterns.len(),
            avg_attractor_strength: if field.attractors.is_empty() {
                0.0
            } else {
                field.attractors.iter().map(|a| a.strength).sum::<f32>() 
                    / field.attractors.len() as f32
            },
            avg_pattern_strength: if field.patterns.is_empty() {
                0.0
            } else {
                field.patterns.iter().map(|p| p.strength).sum::<f32>() 
                    / field.patterns.len() as f32
            },
        };

        serde_json::to_string(&metrics).unwrap_or_default()
    }
}

/// Field metrics structure
#[derive(Debug, Serialize, Deserialize)]
struct FieldMetrics {
    coherence: f32,
    stability: f32,
    entropy: f32,
    attractor_count: usize,
    pattern_count: usize,
    avg_attractor_strength: f32,
    avg_pattern_strength: f32,
}

/// Field analyzer for comprehensive analysis
#[wasm_bindgen]
pub struct FieldAnalyzer {
    measurer: ResonanceMeasurer,
}

#[wasm_bindgen]
impl FieldAnalyzer {
    #[wasm_bindgen(constructor)]
    pub fn new(config: ResonanceConfig) -> Self {
        Self {
            measurer: ResonanceMeasurer::new(config),
        }
    }

    /// Analyze field and generate recommendations
    #[wasm_bindgen(js_name = analyzeField)]
    pub fn analyze_field(&self, field: &mut NeuralField) -> String {
        let metrics = self.measurer.get_field_metrics(field);
        let recommendations = self.generate_recommendations(field);

        let analysis = FieldAnalysis {
            metrics,
            recommendations,
            evolution_potential: self.assess_evolution_potential(field),
        };

        serde_json::to_string(&analysis).unwrap_or_default()
    }

    fn generate_recommendations(&self, field: &NeuralField) -> Vec<String> {
        let mut recommendations = Vec::new();

        if field.attractors.is_empty() {
            recommendations.push("Create initial attractors to provide field structure".to_string());
        } else if field.attractors.len() < 3 {
            recommendations.push("Add more attractors to create a richer field structure".to_string());
        }

        if field.coherence < 0.4 {
            recommendations.push("Increase field coherence through pattern consolidation".to_string());
        }

        if field.stability < 0.3 {
            recommendations.push("Improve field stability by strengthening attractors".to_string());
        } else if field.stability > 0.9 {
            recommendations.push("Introduce controlled instability to enable field evolution".to_string());
        }

        if field.entropy > 0.8 {
            recommendations.push("Reduce entropy through pattern organization".to_string());
        } else if field.entropy < 0.2 {
            recommendations.push("Increase entropy to enable more diverse field states".to_string());
        }

        if recommendations.is_empty() {
            recommendations.push("Maintain current field state with periodic reinforcement".to_string());
        }

        recommendations
    }

    fn assess_evolution_potential(&self, field: &NeuralField) -> String {
        if field.stability > 0.8 && field.entropy < 0.3 {
            "limited - field rigidity".to_string()
        } else if field.stability < 0.3 && field.entropy > 0.7 {
            "unstable - field instability".to_string()
        } else if field.stability > 0.6 && field.entropy > 0.6 {
            "optimal - balanced field".to_string()
        } else {
            "moderate - needs tuning".to_string()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct FieldAnalysis {
    metrics: String,
    recommendations: Vec<String>,
    evolution_potential: String,
}

// PyO3 bindings for Python interop
#[cfg(feature = "pyo3")]
#[pymodule]
fn field_resonance(_py: Python, m: &PyModule) -> PyResult<()> {
    #[pyfn(m)]
    fn create_resonance_measurer(
        method: String, 
        threshold: f32, 
        amplification: f32
    ) -> PyResult<String> {
        let config = ResonanceConfig {
            method,
            threshold,
            amplification,
            sampling: "strength_weighted".to_string(),
            sample_size: 100,
        };
        
        let measurer = ResonanceMeasurer::new(config);
        
        // Return a JSON representation or handle
        Ok(format!("ResonanceMeasurer created with method: {}", measurer.config.method))
    }

    #[pyfn(m)]
    fn measure_pattern_resonance(
        pattern1: String,
        pattern2: String,
        method: String
    ) -> PyResult<f32> {
        let config = ResonanceConfig {
            method,
            threshold: 0.2,
            amplification: 1.2,
            sampling: "full".to_string(),
            sample_size: 100,
        };
        
        let measurer = ResonanceMeasurer::new(config);
        Ok(measurer.measure_resonance(&pattern1, &pattern2))
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_resonance_measurement() {
        let config = ResonanceConfig::new();
        let measurer = ResonanceMeasurer::new(config);

        let pattern1 = "Neural fields enable persistent context";
        let pattern2 = "Context persists through neural field resonance";

        let resonance = measurer.measure_resonance(pattern1, pattern2);
        assert!(resonance > 0.0);
        assert!(resonance <= 1.0);
    }

    #[test]
    fn test_field_coherence() {
        let config = ResonanceConfig::new();
        let measurer = ResonanceMeasurer::new(config);
        
        let mut field = NeuralField::new();
        field.add_pattern(Pattern::new(
            "Neural fields treat context as continuous".to_string(),
            0.9
        ));
        field.add_pattern(Pattern::new(
            "Information persists through resonance".to_string(),
            0.8
        ));
        field.add_attractor(Attractor::new(
            "Neural field resonance enables persistence".to_string(),
            0.85,
            0.9
        ));

        let coherence = measurer.measure_coherence(&field);
        assert!(coherence >= 0.0);
        assert!(coherence <= 1.0);
    }
}