/// Scoring Functions for Context Engineering Evaluation
/// 
/// This module provides comprehensive scoring and evaluation functions for
/// assessing the quality, coherence, and effectiveness of AI-generated content
/// and neural field states.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[cfg(feature = "pyo3")]
use pyo3::prelude::*;

/// Scoring dimension types
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum ScoringDimension {
    Coherence,
    Completeness,
    Correctness,
    Clarity,
    Relevance,
    Creativity,
    Efficiency,
    Safety,
    Factuality,
    Consistency,
}

/// Score aggregation methods
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum AggregationMethod {
    Mean,
    WeightedMean,
    Harmonic,
    Geometric,
    Min,
    Max,
    Median,
}

/// Individual score result
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Score {
    pub dimension: ScoringDimension,
    pub value: f32,
    pub confidence: f32,
    pub explanation: String,
}

#[wasm_bindgen]
impl Score {
    #[wasm_bindgen(constructor)]
    pub fn new(dimension: ScoringDimension, value: f32) -> Self {
        Self {
            dimension,
            value: value.max(0.0).min(1.0),
            confidence: 1.0,
            explanation: String::new(),
        }
    }

    #[wasm_bindgen(js_name = withConfidence)]
    pub fn with_confidence(mut self, confidence: f32) -> Self {
        self.confidence = confidence.max(0.0).min(1.0);
        self
    }

    #[wasm_bindgen(js_name = withExplanation)]
    pub fn with_explanation(mut self, explanation: String) -> Self {
        self.explanation = explanation;
        self
    }

    #[wasm_bindgen(js_name = getWeightedValue)]
    pub fn get_weighted_value(&self) -> f32 {
        self.value * self.confidence
    }
}

/// Composite score with multiple dimensions
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompositeScore {
    #[wasm_bindgen(skip)]
    pub scores: Vec<Score>,
    #[wasm_bindgen(skip)]
    pub weights: HashMap<ScoringDimension, f32>,
    pub aggregation_method: AggregationMethod,
}

#[wasm_bindgen]
impl CompositeScore {
    #[wasm_bindgen(constructor)]
    pub fn new(aggregation_method: AggregationMethod) -> Self {
        Self {
            scores: Vec::new(),
            weights: HashMap::new(),
            aggregation_method,
        }
    }

    #[wasm_bindgen(js_name = addScore)]
    pub fn add_score(&mut self, score: Score) {
        self.scores.push(score);
    }

    #[wasm_bindgen(js_name = setWeight)]
    pub fn set_weight(&mut self, dimension: ScoringDimension, weight: f32) {
        self.weights.insert(dimension, weight.max(0.0));
    }

    #[wasm_bindgen(js_name = calculate)]
    pub fn calculate(&self) -> f32 {
        if self.scores.is_empty() {
            return 0.0;
        }

        match self.aggregation_method {
            AggregationMethod::Mean => self.calculate_mean(),
            AggregationMethod::WeightedMean => self.calculate_weighted_mean(),
            AggregationMethod::Harmonic => self.calculate_harmonic_mean(),
            AggregationMethod::Geometric => self.calculate_geometric_mean(),
            AggregationMethod::Min => self.calculate_min(),
            AggregationMethod::Max => self.calculate_max(),
            AggregationMethod::Median => self.calculate_median(),
        }
    }

    fn calculate_mean(&self) -> f32 {
        let sum: f32 = self.scores.iter().map(|s| s.get_weighted_value()).sum();
        sum / self.scores.len() as f32
    }

    fn calculate_weighted_mean(&self) -> f32 {
        let mut weighted_sum = 0.0;
        let mut total_weight = 0.0;

        for score in &self.scores {
            let weight = self.weights.get(&score.dimension).unwrap_or(&1.0);
            weighted_sum += score.get_weighted_value() * weight;
            total_weight += weight;
        }

        if total_weight > 0.0 {
            weighted_sum / total_weight
        } else {
            self.calculate_mean()
        }
    }

    fn calculate_harmonic_mean(&self) -> f32 {
        let reciprocal_sum: f32 = self.scores
            .iter()
            .map(|s| {
                let value = s.get_weighted_value();
                if value > 0.0 { 1.0 / value } else { 0.0 }
            })
            .sum();
        
        if reciprocal_sum > 0.0 {
            self.scores.len() as f32 / reciprocal_sum
        } else {
            0.0
        }
    }

    fn calculate_geometric_mean(&self) -> f32 {
        let product: f32 = self.scores
            .iter()
            .map(|s| s.get_weighted_value())
            .fold(1.0, |acc, val| acc * val);
        
        product.powf(1.0 / self.scores.len() as f32)
    }

    fn calculate_min(&self) -> f32 {
        self.scores
            .iter()
            .map(|s| s.get_weighted_value())
            .fold(1.0, f32::min)
    }

    fn calculate_max(&self) -> f32 {
        self.scores
            .iter()
            .map(|s| s.get_weighted_value())
            .fold(0.0, f32::max)
    }

    fn calculate_median(&self) -> f32 {
        let mut values: Vec<f32> = self.scores
            .iter()
            .map(|s| s.get_weighted_value())
            .collect();
        values.sort_by(|a, b| a.partial_cmp(b).unwrap());
        
        let len = values.len();
        if len % 2 == 0 {
            (values[len / 2 - 1] + values[len / 2]) / 2.0
        } else {
            values[len / 2]
        }
    }

    #[wasm_bindgen(js_name = getBreakdown)]
    pub fn get_breakdown(&self) -> String {
        let breakdown: Vec<HashMap<String, serde_json::Value>> = self.scores
            .iter()
            .map(|s| {
                let mut map = HashMap::new();
                map.insert("dimension".to_string(), 
                    serde_json::Value::String(format!("{:?}", s.dimension)));
                map.insert("value".to_string(), 
                    serde_json::Value::Number(serde_json::Number::from_f64(s.value as f64).unwrap()));
                map.insert("confidence".to_string(), 
                    serde_json::Value::Number(serde_json::Number::from_f64(s.confidence as f64).unwrap()));
                map.insert("explanation".to_string(), 
                    serde_json::Value::String(s.explanation.clone()));
                map
            })
            .collect();
        
        serde_json::to_string_pretty(&breakdown).unwrap_or_default()
    }
}

/// Text quality scorer
#[wasm_bindgen]
pub struct TextScorer {
    min_length: usize,
    max_length: usize,
    keyword_weights: HashMap<String, f32>,
}

#[wasm_bindgen]
impl TextScorer {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            min_length: 10,
            max_length: 10000,
            keyword_weights: HashMap::new(),
        }
    }

    #[wasm_bindgen(js_name = setLengthBounds)]
    pub fn set_length_bounds(&mut self, min: usize, max: usize) {
        self.min_length = min;
        self.max_length = max;
    }

    #[wasm_bindgen(js_name = addKeyword)]
    pub fn add_keyword(&mut self, keyword: String, weight: f32) {
        self.keyword_weights.insert(keyword.to_lowercase(), weight);
    }

    #[wasm_bindgen(js_name = scoreCoherence)]
    pub fn score_coherence(&self, text: &str) -> Score {
        let sentences = self.split_sentences(text);
        if sentences.is_empty() {
            return Score::new(ScoringDimension::Coherence, 0.0);
        }

        let mut coherence_score = 0.0;
        
        // Check sentence transitions
        for window in sentences.windows(2) {
            let common_words = self.count_common_words(&window[0], &window[1]);
            coherence_score += (common_words as f32 / 10.0).min(1.0);
        }
        
        coherence_score /= sentences.len().max(1) as f32;
        
        // Check paragraph structure
        let paragraphs = text.split("\n\n").count();
        let paragraph_bonus = (paragraphs as f32 / 5.0).min(0.2);
        coherence_score = (coherence_score + paragraph_bonus).min(1.0);
        
        Score::new(ScoringDimension::Coherence, coherence_score)
            .with_explanation(format!("Text has {} sentences and {} paragraphs", 
                sentences.len(), paragraphs))
    }

    #[wasm_bindgen(js_name = scoreCompleteness)]
    pub fn score_completeness(&self, text: &str) -> Score {
        let length = text.len();
        
        // Length-based scoring
        let length_score = if length < self.min_length {
            length as f32 / self.min_length as f32
        } else if length > self.max_length {
            1.0 - ((length - self.max_length) as f32 / self.max_length as f32).min(0.5)
        } else {
            1.0
        };
        
        // Check for structural completeness
        let has_intro = text.len() > 50;
        let has_conclusion = text.contains("conclusion") || text.contains("summary") || 
                           text.contains("finally") || text.contains("in conclusion");
        let has_details = text.contains("for example") || text.contains("specifically") || 
                         text.contains("such as");
        
        let structure_score = (has_intro as u8 + has_conclusion as u8 + has_details as u8) as f32 / 3.0;
        
        let final_score = (length_score * 0.5 + structure_score * 0.5).min(1.0);
        
        Score::new(ScoringDimension::Completeness, final_score)
            .with_explanation(format!("Text length: {}, structural elements: {}/3", 
                length, (has_intro as u8 + has_conclusion as u8 + has_details as u8)))
    }

    #[wasm_bindgen(js_name = scoreClarity)]
    pub fn score_clarity(&self, text: &str) -> Score {
        let sentences = self.split_sentences(text);
        if sentences.is_empty() {
            return Score::new(ScoringDimension::Clarity, 0.0);
        }

        let mut clarity_score = 1.0;
        
        // Penalize very long sentences
        for sentence in &sentences {
            let word_count = sentence.split_whitespace().count();
            if word_count > 40 {
                clarity_score -= 0.1;
            } else if word_count < 5 {
                clarity_score -= 0.05;
            }
        }
        
        // Check for complex words (simplified)
        let complex_word_count = text.split_whitespace()
            .filter(|word| word.len() > 12)
            .count();
        
        let complexity_penalty = (complex_word_count as f32 / 100.0).min(0.3);
        clarity_score = (clarity_score - complexity_penalty).max(0.0);
        
        Score::new(ScoringDimension::Clarity, clarity_score)
            .with_explanation(format!("Average sentence length is reasonable, {} complex words found", 
                complex_word_count))
    }

    #[wasm_bindgen(js_name = scoreRelevance)]
    pub fn score_relevance(&self, text: &str, query: &str) -> Score {
        let text_lower = text.to_lowercase();
        let query_words: Vec<&str> = query.to_lowercase().split_whitespace().collect();
        
        if query_words.is_empty() {
            return Score::new(ScoringDimension::Relevance, 1.0);
        }
        
        let mut matches = 0;
        for word in &query_words {
            if text_lower.contains(word) {
                matches += 1;
            }
        }
        
        let base_score = matches as f32 / query_words.len() as f32;
        
        // Check for keyword weights
        let mut keyword_score = 0.0;
        let mut keyword_count = 0;
        
        for (keyword, weight) in &self.keyword_weights {
            if text_lower.contains(keyword) {
                keyword_score += weight;
                keyword_count += 1;
            }
        }
        
        let weighted_score = if !self.keyword_weights.is_empty() {
            (base_score + keyword_score / self.keyword_weights.len() as f32) / 2.0
        } else {
            base_score
        };
        
        Score::new(ScoringDimension::Relevance, weighted_score.min(1.0))
            .with_explanation(format!("{}/{} query terms found, {} keywords matched", 
                matches, query_words.len(), keyword_count))
    }

    fn split_sentences(&self, text: &str) -> Vec<String> {
        text.split(|c| c == '.' || c == '!' || c == '?')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect()
    }

    fn count_common_words(&self, text1: &str, text2: &str) -> usize {
        let words1: Vec<&str> = text1.to_lowercase().split_whitespace().collect();
        let words2: Vec<&str> = text2.to_lowercase().split_whitespace().collect();
        
        let mut common = 0;
        for word in &words1 {
            if words2.contains(word) && word.len() > 3 {
                common += 1;
            }
        }
        common
    }
}

/// Field quality scorer for neural fields
#[wasm_bindgen]
pub struct FieldScorer {
    coherence_weight: f32,
    stability_weight: f32,
    entropy_weight: f32,
}

#[wasm_bindgen]
impl FieldScorer {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            coherence_weight: 0.4,
            stability_weight: 0.3,
            entropy_weight: 0.3,
        }
    }

    #[wasm_bindgen(js_name = setWeights)]
    pub fn set_weights(&mut self, coherence: f32, stability: f32, entropy: f32) {
        let total = coherence + stability + entropy;
        if total > 0.0 {
            self.coherence_weight = coherence / total;
            self.stability_weight = stability / total;
            self.entropy_weight = entropy / total;
        }
    }

    #[wasm_bindgen(js_name = scoreField)]
    pub fn score_field(&self, coherence: f32, stability: f32, entropy: f32) -> f32 {
        let coherence_score = coherence * self.coherence_weight;
        let stability_score = stability * self.stability_weight;
        
        // Entropy is inverted - lower is better for organization
        let entropy_score = (1.0 - entropy) * self.entropy_weight;
        
        (coherence_score + stability_score + entropy_score).min(1.0)
    }

    #[wasm_bindgen(js_name = scoreFieldEvolution)]
    pub fn score_field_evolution(
        &self,
        before_metrics: Vec<f32>,
        after_metrics: Vec<f32>
    ) -> f32 {
        if before_metrics.len() != 3 || after_metrics.len() != 3 {
            return 0.0;
        }
        
        let before_score = self.score_field(
            before_metrics[0],
            before_metrics[1],
            before_metrics[2]
        );
        
        let after_score = self.score_field(
            after_metrics[0],
            after_metrics[1],
            after_metrics[2]
        );
        
        // Calculate improvement
        let improvement = (after_score - before_score + 1.0) / 2.0;
        improvement.max(0.0).min(1.0)
    }
}

/// Scoring engine that combines multiple scorers
#[wasm_bindgen]
pub struct ScoringEngine {
    text_scorer: TextScorer,
    field_scorer: FieldScorer,
    #[wasm_bindgen(skip)]
    custom_scorers: HashMap<String, Box<dyn Fn(&str) -> f32>>,
}

#[wasm_bindgen]
impl ScoringEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            text_scorer: TextScorer::new(),
            field_scorer: FieldScorer::new(),
            custom_scorers: HashMap::new(),
        }
    }

    #[wasm_bindgen(js_name = scoreText)]
    pub fn score_text(&self, text: &str, query: &str) -> String {
        let mut composite = CompositeScore::new(AggregationMethod::WeightedMean);
        
        // Add dimension scores
        composite.add_score(self.text_scorer.score_coherence(text));
        composite.add_score(self.text_scorer.score_completeness(text));
        composite.add_score(self.text_scorer.score_clarity(text));
        composite.add_score(self.text_scorer.score_relevance(text, query));
        
        // Set default weights
        composite.set_weight(ScoringDimension::Coherence, 0.25);
        composite.set_weight(ScoringDimension::Completeness, 0.25);
        composite.set_weight(ScoringDimension::Clarity, 0.25);
        composite.set_weight(ScoringDimension::Relevance, 0.25);
        
        let overall_score = composite.calculate();
        
        serde_json::json!({
            "overall_score": overall_score,
            "breakdown": serde_json::from_str::<serde_json::Value>(&composite.get_breakdown()).unwrap()
        }).to_string()
    }

    #[wasm_bindgen(js_name = batchScore)]
    pub fn batch_score(&self, texts: Vec<String>, query: &str) -> String {
        let scores: Vec<serde_json::Value> = texts
            .iter()
            .enumerate()
            .map(|(i, text)| {
                let score_json = self.score_text(text, query);
                let mut score: serde_json::Value = serde_json::from_str(&score_json).unwrap();
                score["index"] = serde_json::json!(i);
                score
            })
            .collect();
        
        serde_json::to_string_pretty(&scores).unwrap_or_default()
    }
}

// PyO3 bindings
#[cfg(feature = "pyo3")]
#[pymodule]
fn scoring_functions(_py: Python, m: &PyModule) -> PyResult<()> {
    #[pyfn(m)]
    fn score_text_quality(text: String, query: String) -> PyResult<f32> {
        let engine = ScoringEngine::new();
        let result = engine.score_text(&text, &query);
        
        // Parse JSON and extract overall score
        let parsed: serde_json::Value = serde_json::from_str(&result)
            .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        
        Ok(parsed["overall_score"].as_f64().unwrap_or(0.0) as f32)
    }

    #[pyfn(m)]
    fn score_field_quality(coherence: f32, stability: f32, entropy: f32) -> PyResult<f32> {
        let scorer = FieldScorer::new();
        Ok(scorer.score_field(coherence, stability, entropy))
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_score_creation() {
        let score = Score::new(ScoringDimension::Coherence, 0.8)
            .with_confidence(0.9)
            .with_explanation("Good coherence".to_string());
        
        assert_eq!(score.value, 0.8);
        assert_eq!(score.confidence, 0.9);
        assert_eq!(score.get_weighted_value(), 0.72);
    }

    #[test]
    fn test_composite_score() {
        let mut composite = CompositeScore::new(AggregationMethod::Mean);
        
        composite.add_score(Score::new(ScoringDimension::Coherence, 0.8));
        composite.add_score(Score::new(ScoringDimension::Clarity, 0.6));
        composite.add_score(Score::new(ScoringDimension::Completeness, 0.7));
        
        let result = composite.calculate();
        assert!((result - 0.7).abs() < 0.01);
    }

    #[test]
    fn test_text_scorer() {
        let scorer = TextScorer::new();
        
        let text = "This is a test sentence. It has multiple parts. The structure is clear.";
        let coherence = scorer.score_coherence(text);
        assert!(coherence.value > 0.0);
        
        let clarity = scorer.score_clarity(text);
        assert!(clarity.value > 0.0);
    }

    #[test]
    fn test_field_scorer() {
        let scorer = FieldScorer::new();
        let score = scorer.score_field(0.8, 0.7, 0.3);
        assert!(score > 0.0 && score <= 1.0);
    }
}