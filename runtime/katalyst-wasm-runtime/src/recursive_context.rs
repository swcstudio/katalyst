/// Recursive Context Framework for Self-Improving AI Systems
/// 
/// This module provides a framework for implementing recursive contexts that can
/// extend, refine, and evolve themselves through iterative improvement cycles.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use chrono::{DateTime, Utc};

#[cfg(feature = "pyo3")]
use pyo3::prelude::*;

use crate::field_resonance::{NeuralField, ResonanceMeasurer};
use crate::prompt_program::PromptProgram;

/// Improvement strategy types
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum ImprovementStrategy {
    StepRefinement,
    ContextEnrichment,
    PatternExtraction,
    ErrorCorrection,
    PerformanceOptimization,
    CoherenceEnhancement,
}

/// Evaluation metric types
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum EvaluationMetric {
    Correctness,
    Completeness,
    Coherence,
    Efficiency,
    Clarity,
    Relevance,
}

/// Recursive iteration state
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecursiveIteration {
    pub iteration_number: usize,
    pub input: String,
    pub output: String,
    pub evaluation_score: f32,
    pub improvements_applied: Vec<String>,
    pub timestamp: String,
    #[wasm_bindgen(skip)]
    pub metadata: HashMap<String, serde_json::Value>,
}

#[wasm_bindgen]
impl RecursiveIteration {
    #[wasm_bindgen(constructor)]
    pub fn new(iteration_number: usize, input: String, output: String) -> Self {
        Self {
            iteration_number,
            input,
            output,
            evaluation_score: 0.0,
            improvements_applied: Vec::new(),
            timestamp: Utc::now().to_rfc3339(),
            metadata: HashMap::new(),
        }
    }

    #[wasm_bindgen(js_name = setScore)]
    pub fn set_score(&mut self, score: f32) {
        self.evaluation_score = score;
    }

    #[wasm_bindgen(js_name = addImprovement)]
    pub fn add_improvement(&mut self, improvement: String) {
        self.improvements_applied.push(improvement);
    }
}

/// Self-improvement loop configuration
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SelfImprovementLoop {
    pub evaluation_metric: EvaluationMetric,
    pub improvement_strategy: ImprovementStrategy,
    pub improvement_threshold: f32,
    pub max_depth: usize,
    pub enabled: bool,
}

#[wasm_bindgen]
impl SelfImprovementLoop {
    #[wasm_bindgen(constructor)]
    pub fn new(
        evaluation_metric: EvaluationMetric,
        improvement_strategy: ImprovementStrategy
    ) -> Self {
        Self {
            evaluation_metric,
            improvement_strategy,
            improvement_threshold: 0.1,
            max_depth: 3,
            enabled: true,
        }
    }

    #[wasm_bindgen(js_name = withThreshold)]
    pub fn with_threshold(mut self, threshold: f32) -> Self {
        self.improvement_threshold = threshold;
        self
    }

    #[wasm_bindgen(js_name = withMaxDepth)]
    pub fn with_max_depth(mut self, depth: usize) -> Self {
        self.max_depth = depth;
        self
    }
}

/// Symbolic residue tracker
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SymbolicResidue {
    pub content: String,
    pub state: String, // "surfaced", "integrated", "echo"
    pub strength: f32,
    pub source_iteration: usize,
    pub timestamp: String,
}

#[wasm_bindgen]
impl SymbolicResidue {
    #[wasm_bindgen(constructor)]
    pub fn new(content: String, state: String, strength: f32, source_iteration: usize) -> Self {
        Self {
            content,
            state,
            strength,
            source_iteration,
            timestamp: Utc::now().to_rfc3339(),
        }
    }

    #[wasm_bindgen(js_name = decay)]
    pub fn decay(&mut self, factor: f32) {
        self.strength *= (1.0 - factor);
        if self.strength < 0.1 {
            self.state = "echo".to_string();
        }
    }

    #[wasm_bindgen(js_name = integrate)]
    pub fn integrate(&mut self) {
        self.state = "integrated".to_string();
        self.strength = self.strength.min(0.8);
    }
}

/// Main recursive framework
#[wasm_bindgen]
pub struct RecursiveFramework {
    pub id: String,
    pub description: String,
    #[wasm_bindgen(skip)]
    pub neural_field: NeuralField,
    #[wasm_bindgen(skip)]
    pub improvement_loops: Vec<SelfImprovementLoop>,
    #[wasm_bindgen(skip)]
    pub iterations: Vec<RecursiveIteration>,
    #[wasm_bindgen(skip)]
    pub symbolic_residues: Vec<SymbolicResidue>,
    pub current_depth: usize,
    pub max_iterations: usize,
}

#[wasm_bindgen]
impl RecursiveFramework {
    #[wasm_bindgen(constructor)]
    pub fn new(description: String) -> Self {
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            description,
            neural_field: NeuralField::new(),
            improvement_loops: Vec::new(),
            iterations: Vec::new(),
            symbolic_residues: Vec::new(),
            current_depth: 0,
            max_iterations: 5,
        }
    }

    #[wasm_bindgen(js_name = addImprovementLoop)]
    pub fn add_improvement_loop(&mut self, loop_config: SelfImprovementLoop) {
        self.improvement_loops.push(loop_config);
    }

    #[wasm_bindgen(js_name = executeRecursive)]
    pub async fn execute_recursive(
        &mut self,
        input: String,
        max_iterations: usize
    ) -> Result<String, JsValue> {
        self.max_iterations = max_iterations;
        let mut current_input = input.clone();
        let mut current_output = String::new();
        
        for iteration in 0..max_iterations {
            // Execute iteration
            current_output = self.execute_iteration(&current_input, iteration).await?;
            
            // Evaluate output
            let score = self.evaluate_output(&current_output, iteration);
            
            // Create iteration record
            let mut iter_record = RecursiveIteration::new(
                iteration,
                current_input.clone(),
                current_output.clone()
            );
            iter_record.set_score(score);
            
            // Apply improvements if needed
            if self.should_improve(score) {
                let improvements = self.generate_improvements(&current_output, score);
                for improvement in &improvements {
                    iter_record.add_improvement(improvement.clone());
                }
                current_input = self.apply_improvements(&current_output, improvements);
            } else {
                // Good enough, stop iterating
                self.iterations.push(iter_record);
                break;
            }
            
            self.iterations.push(iter_record);
            
            // Track symbolic residue
            self.track_residue(&current_output, iteration);
        }
        
        Ok(current_output)
    }

    async fn execute_iteration(&mut self, input: &str, iteration: usize) -> Result<String, JsValue> {
        // Build context with neural field state
        let context = self.build_recursive_context(input, iteration);
        
        // Here we would call the actual model
        // For now, return enhanced mock response
        let output = format!(
            "Iteration {}: Processing '{}' with {} residues and {} field patterns",
            iteration,
            input,
            self.symbolic_residues.len(),
            self.neural_field.get_pattern_count()
        );
        
        // Update neural field
        self.update_neural_field(&output);
        
        Ok(output)
    }

    fn build_recursive_context(&self, input: &str, iteration: usize) -> String {
        let mut context = format!("Iteration: {}\nInput: {}\n", iteration, input);
        
        // Add previous iterations context
        if !self.iterations.is_empty() {
            context.push_str("\nPrevious iterations:\n");
            for iter in self.iterations.iter().rev().take(3) {
                context.push_str(&format!(
                    "- Iteration {}: Score {:.2}\n",
                    iter.iteration_number,
                    iter.evaluation_score
                ));
            }
        }
        
        // Add symbolic residue context
        if !self.symbolic_residues.is_empty() {
            context.push_str("\nActive residues:\n");
            for residue in self.symbolic_residues.iter()
                .filter(|r| r.strength > 0.3)
                .take(5) {
                context.push_str(&format!(
                    "- {} (strength: {:.2}, state: {})\n",
                    residue.content,
                    residue.strength,
                    residue.state
                ));
            }
        }
        
        // Add neural field metrics
        context.push_str(&format!(
            "\nField state: coherence={:.2}, stability={:.2}, entropy={:.2}\n",
            self.neural_field.coherence,
            self.neural_field.stability,
            self.neural_field.entropy
        ));
        
        context
    }

    fn evaluate_output(&self, output: &str, _iteration: usize) -> f32 {
        // Simple evaluation based on output characteristics
        let mut score = 0.5;
        
        // Length-based scoring
        if output.len() > 50 {
            score += 0.1;
        }
        
        // Check for structure
        if output.contains("Iteration") {
            score += 0.1;
        }
        
        // Check field metrics
        score += self.neural_field.coherence * 0.2;
        score += self.neural_field.stability * 0.1;
        
        score.min(1.0)
    }

    fn should_improve(&self, score: f32) -> bool {
        // Check if improvement is needed based on active loops
        for loop_config in &self.improvement_loops {
            if loop_config.enabled && score < (1.0 - loop_config.improvement_threshold) {
                return true;
            }
        }
        false
    }

    fn generate_improvements(&self, output: &str, score: f32) -> Vec<String> {
        let mut improvements = Vec::new();
        
        for loop_config in &self.improvement_loops {
            if !loop_config.enabled {
                continue;
            }
            
            match loop_config.improvement_strategy {
                ImprovementStrategy::StepRefinement => {
                    improvements.push(format!("Refine steps in: {}", output));
                },
                ImprovementStrategy::ContextEnrichment => {
                    improvements.push("Add more context from field history".to_string());
                },
                ImprovementStrategy::PatternExtraction => {
                    improvements.push("Extract and amplify successful patterns".to_string());
                },
                ImprovementStrategy::ErrorCorrection => {
                    if score < 0.5 {
                        improvements.push("Correct identified errors".to_string());
                    }
                },
                ImprovementStrategy::PerformanceOptimization => {
                    improvements.push("Optimize for efficiency".to_string());
                },
                ImprovementStrategy::CoherenceEnhancement => {
                    if self.neural_field.coherence < 0.7 {
                        improvements.push("Enhance field coherence".to_string());
                    }
                },
            }
        }
        
        improvements
    }

    fn apply_improvements(&self, output: &str, improvements: Vec<String>) -> String {
        let mut improved = output.to_string();
        
        for improvement in improvements {
            improved = format!("{}\nApplying: {}", improved, improvement);
        }
        
        improved
    }

    fn track_residue(&mut self, output: &str, iteration: usize) {
        // Extract potential residue from output
        let words: Vec<&str> = output.split_whitespace().collect();
        
        for chunk in words.chunks(3) {
            if chunk.len() == 3 {
                let residue_content = chunk.join(" ");
                
                // Check if this residue already exists
                let exists = self.symbolic_residues.iter()
                    .any(|r| r.content == residue_content);
                
                if !exists && residue_content.len() > 10 {
                    let residue = SymbolicResidue::new(
                        residue_content,
                        "surfaced".to_string(),
                        0.5,
                        iteration
                    );
                    self.symbolic_residues.push(residue);
                }
            }
        }
        
        // Decay old residues
        for residue in &mut self.symbolic_residues {
            if residue.source_iteration < iteration {
                residue.decay(0.1);
            }
        }
        
        // Remove very weak residues
        self.symbolic_residues.retain(|r| r.strength > 0.05);
    }

    fn update_neural_field(&mut self, output: &str) {
        use crate::field_resonance::Pattern;
        
        // Add output as pattern to field
        let pattern = Pattern::new(output.to_string(), 0.7);
        self.neural_field.add_pattern(pattern);
        
        // Update field metrics (simplified)
        self.neural_field.coherence = (self.neural_field.coherence * 0.9 + 0.1).min(1.0);
        self.neural_field.stability = (self.neural_field.stability * 0.95 + 0.05).min(1.0);
        self.neural_field.entropy = (self.neural_field.entropy * 0.9).max(0.1);
    }

    #[wasm_bindgen(js_name = getIterationHistory)]
    pub fn get_iteration_history(&self) -> String {
        serde_json::to_string_pretty(&self.iterations).unwrap_or_default()
    }

    #[wasm_bindgen(js_name = getSymbolicResidues)]
    pub fn get_symbolic_residues(&self) -> String {
        serde_json::to_string_pretty(&self.symbolic_residues).unwrap_or_default()
    }

    #[wasm_bindgen(js_name = getFieldMetrics)]
    pub fn get_field_metrics(&self) -> String {
        serde_json::json!({
            "coherence": self.neural_field.coherence,
            "stability": self.neural_field.stability,
            "entropy": self.neural_field.entropy,
            "pattern_count": self.neural_field.get_pattern_count(),
            "attractor_count": self.neural_field.get_attractor_count()
        }).to_string()
    }

    #[wasm_bindgen(js_name = reset)]
    pub fn reset(&mut self) {
        self.iterations.clear();
        self.symbolic_residues.clear();
        self.neural_field = NeuralField::new();
        self.current_depth = 0;
    }
}

/// Builder for recursive frameworks
#[wasm_bindgen]
pub struct RecursiveFrameworkBuilder {
    framework: RecursiveFramework,
}

#[wasm_bindgen]
impl RecursiveFrameworkBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(description: String) -> Self {
        Self {
            framework: RecursiveFramework::new(description),
        }
    }

    #[wasm_bindgen(js_name = withImprovementLoop)]
    pub fn with_improvement_loop(
        mut self,
        metric: EvaluationMetric,
        strategy: ImprovementStrategy
    ) -> Self {
        let loop_config = SelfImprovementLoop::new(metric, strategy);
        self.framework.add_improvement_loop(loop_config);
        self
    }

    #[wasm_bindgen(js_name = withMaxIterations)]
    pub fn with_max_iterations(mut self, max: usize) -> Self {
        self.framework.max_iterations = max;
        self
    }

    #[wasm_bindgen(js_name = build)]
    pub fn build(self) -> RecursiveFramework {
        self.framework
    }
}

/// Pre-built recursive templates
#[wasm_bindgen]
pub struct RecursiveTemplates;

#[wasm_bindgen]
impl RecursiveTemplates {
    #[wasm_bindgen(js_name = problemSolver)]
    pub fn problem_solver() -> RecursiveFramework {
        RecursiveFrameworkBuilder::new("Recursive Problem Solver".to_string())
            .with_improvement_loop(
                EvaluationMetric::Correctness,
                ImprovementStrategy::StepRefinement
            )
            .with_improvement_loop(
                EvaluationMetric::Completeness,
                ImprovementStrategy::ContextEnrichment
            )
            .with_max_iterations(5)
            .build()
    }

    #[wasm_bindgen(js_name = creativeWriter)]
    pub fn creative_writer() -> RecursiveFramework {
        RecursiveFrameworkBuilder::new("Recursive Creative Writer".to_string())
            .with_improvement_loop(
                EvaluationMetric::Coherence,
                ImprovementStrategy::CoherenceEnhancement
            )
            .with_improvement_loop(
                EvaluationMetric::Clarity,
                ImprovementStrategy::PatternExtraction
            )
            .with_max_iterations(4)
            .build()
    }

    #[wasm_bindgen(js_name = codeOptimizer)]
    pub fn code_optimizer() -> RecursiveFramework {
        RecursiveFrameworkBuilder::new("Recursive Code Optimizer".to_string())
            .with_improvement_loop(
                EvaluationMetric::Efficiency,
                ImprovementStrategy::PerformanceOptimization
            )
            .with_improvement_loop(
                EvaluationMetric::Correctness,
                ImprovementStrategy::ErrorCorrection
            )
            .with_max_iterations(3)
            .build()
    }
}

// PyO3 bindings
#[cfg(feature = "pyo3")]
#[pymodule]
fn recursive_context(_py: Python, m: &PyModule) -> PyResult<()> {
    #[pyfn(m)]
    fn create_recursive_framework(description: String) -> PyResult<String> {
        let framework = RecursiveFramework::new(description);
        Ok(serde_json::to_string(&framework).unwrap_or_default())
    }

    #[pyfn(m)]
    fn add_improvement_loop(
        framework_json: String,
        metric: String,
        strategy: String
    ) -> PyResult<String> {
        // Parse and update framework
        Ok(framework_json) // Simplified for example
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_recursive_framework_creation() {
        let framework = RecursiveFramework::new("Test Framework".to_string());
        assert_eq!(framework.description, "Test Framework");
        assert_eq!(framework.max_iterations, 5);
    }

    #[test]
    fn test_symbolic_residue() {
        let mut residue = SymbolicResidue::new(
            "test residue".to_string(),
            "surfaced".to_string(),
            0.8,
            0
        );
        
        residue.decay(0.2);
        assert!((residue.strength - 0.64).abs() < 0.01);
        
        residue.integrate();
        assert_eq!(residue.state, "integrated");
    }

    #[test]
    fn test_improvement_loop() {
        let loop_config = SelfImprovementLoop::new(
            EvaluationMetric::Correctness,
            ImprovementStrategy::StepRefinement
        );
        assert_eq!(loop_config.improvement_threshold, 0.1);
        assert_eq!(loop_config.max_depth, 3);
    }

    #[tokio::test]
    async fn test_recursive_execution() {
        let mut framework = RecursiveFramework::new("Test".to_string());
        let result = framework.execute_recursive("test input".to_string(), 2).await;
        assert!(result.is_ok());
    }
}