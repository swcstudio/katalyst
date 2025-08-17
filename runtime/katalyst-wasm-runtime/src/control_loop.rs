/// Control Loop for Context-Based AI Orchestration
/// 
/// This module provides a flexible control loop implementation for orchestrating
/// context-based interactions with language models, optimized for WebAssembly deployment.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use chrono::{DateTime, Utc};
use async_trait::async_trait;

#[cfg(feature = "pyo3")]
use pyo3::prelude::*;

/// Loop state enum
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum LoopState {
    Idle,
    Running,
    Paused,
    Completed,
    Failed,
}

/// Evaluation result
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum EvaluationResult {
    Continue,
    Complete,
    Retry,
    Abort,
}

/// Context entry in the loop
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContextEntry {
    pub key: String,
    #[wasm_bindgen(skip)]
    pub value: serde_json::Value,
    pub timestamp: String,
    pub iteration: usize,
}

#[wasm_bindgen]
impl ContextEntry {
    #[wasm_bindgen(constructor)]
    pub fn new(key: String, value: String, iteration: usize) -> Self {
        Self {
            key,
            value: serde_json::Value::String(value),
            timestamp: Utc::now().to_rfc3339(),
            iteration,
        }
    }

    #[wasm_bindgen(js_name = getValue)]
    pub fn get_value(&self) -> String {
        match &self.value {
            serde_json::Value::String(s) => s.clone(),
            v => v.to_string(),
        }
    }
}

/// History entry for tracking loop execution
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HistoryEntry {
    pub iteration: usize,
    pub input: String,
    pub output: String,
    pub evaluation: EvaluationResult,
    pub timestamp: String,
    #[wasm_bindgen(skip)]
    pub metadata: HashMap<String, serde_json::Value>,
}

#[wasm_bindgen]
impl HistoryEntry {
    #[wasm_bindgen(constructor)]
    pub fn new(iteration: usize, input: String, output: String, evaluation: EvaluationResult) -> Self {
        Self {
            iteration,
            input,
            output,
            evaluation,
            timestamp: Utc::now().to_rfc3339(),
            metadata: HashMap::new(),
        }
    }

    #[wasm_bindgen(js_name = addMetadata)]
    pub fn add_metadata(&mut self, key: String, value: String) {
        self.metadata.insert(key, serde_json::Value::String(value));
    }
}

/// Context manager for the control loop
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContextManager {
    #[wasm_bindgen(skip)]
    pub context: HashMap<String, serde_json::Value>,
    #[wasm_bindgen(skip)]
    pub history: Vec<ContextEntry>,
    pub max_tokens: usize,
    pub reserved_tokens: usize,
}

#[wasm_bindgen]
impl ContextManager {
    #[wasm_bindgen(constructor)]
    pub fn new(max_tokens: usize, reserved_tokens: usize) -> Self {
        Self {
            context: HashMap::new(),
            history: Vec::new(),
            max_tokens,
            reserved_tokens,
        }
    }

    #[wasm_bindgen(js_name = update)]
    pub fn update(&mut self, key: String, value: String, iteration: usize) {
        self.context.insert(key.clone(), serde_json::Value::String(value.clone()));
        self.history.push(ContextEntry::new(key, value, iteration));
    }

    #[wasm_bindgen(js_name = get)]
    pub fn get(&self, key: &str) -> Option<String> {
        self.context.get(key).map(|v| match v {
            serde_json::Value::String(s) => s.clone(),
            v => v.to_string(),
        })
    }

    #[wasm_bindgen(js_name = getContextString)]
    pub fn get_context_string(&self) -> String {
        let mut parts = Vec::new();
        
        for (key, value) in &self.context {
            let value_str = match value {
                serde_json::Value::String(s) => s.clone(),
                v => v.to_string(),
            };
            parts.push(format!("{}: {}", key, value_str));
        }
        
        parts.join("\n")
    }

    #[wasm_bindgen(js_name = clear)]
    pub fn clear(&mut self) {
        self.context.clear();
        self.history.clear();
    }

    #[wasm_bindgen(js_name = toJson)]
    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(&self.context).unwrap_or_default()
    }
}

/// Model interface trait for different AI providers
#[async_trait(?Send)]
pub trait ModelInterface {
    async fn generate(&self, context: &str, max_tokens: usize) -> Result<String, String>;
    fn get_name(&self) -> String;
}

/// Mock model for testing
pub struct MockModel {
    name: String,
}

impl MockModel {
    pub fn new(name: String) -> Self {
        Self { name }
    }
}

#[async_trait(?Send)]
impl ModelInterface for MockModel {
    async fn generate(&self, context: &str, _max_tokens: usize) -> Result<String, String> {
        Ok(format!("Mock response to: {}", context))
    }

    fn get_name(&self) -> String {
        self.name.clone()
    }
}

/// Strategy for evaluating loop iterations
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvaluationStrategy {
    pub max_iterations: usize,
    pub success_threshold: f32,
    pub retry_on_error: bool,
    pub early_stop: bool,
}

#[wasm_bindgen]
impl EvaluationStrategy {
    #[wasm_bindgen(constructor)]
    pub fn new(max_iterations: usize) -> Self {
        Self {
            max_iterations,
            success_threshold: 0.8,
            retry_on_error: true,
            early_stop: true,
        }
    }

    #[wasm_bindgen(js_name = withThreshold)]
    pub fn with_threshold(mut self, threshold: f32) -> Self {
        self.success_threshold = threshold;
        self
    }

    #[wasm_bindgen(js_name = withRetry)]
    pub fn with_retry(mut self, retry: bool) -> Self {
        self.retry_on_error = retry;
        self
    }

    #[wasm_bindgen(js_name = withEarlyStop)]
    pub fn with_early_stop(mut self, early_stop: bool) -> Self {
        self.early_stop = early_stop;
        self
    }
}

/// Main control loop structure
#[wasm_bindgen]
pub struct ControlLoop {
    id: String,
    context_manager: ContextManager,
    evaluation_strategy: EvaluationStrategy,
    state: LoopState,
    current_iteration: usize,
    #[wasm_bindgen(skip)]
    history: Vec<HistoryEntry>,
    #[wasm_bindgen(skip)]
    model_name: String,
}

#[wasm_bindgen]
impl ControlLoop {
    #[wasm_bindgen(constructor)]
    pub fn new(max_iterations: usize, max_tokens: usize) -> Self {
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            context_manager: ContextManager::new(max_tokens, 1000),
            evaluation_strategy: EvaluationStrategy::new(max_iterations),
            state: LoopState::Idle,
            current_iteration: 0,
            history: Vec::new(),
            model_name: "default".to_string(),
        }
    }

    #[wasm_bindgen(js_name = setModel)]
    pub fn set_model(&mut self, model_name: String) {
        self.model_name = model_name;
    }

    #[wasm_bindgen(js_name = addContext)]
    pub fn add_context(&mut self, key: String, value: String) {
        self.context_manager.update(key, value, self.current_iteration);
    }

    #[wasm_bindgen(js_name = getState)]
    pub fn get_state(&self) -> LoopState {
        self.state
    }

    #[wasm_bindgen(js_name = getCurrentIteration)]
    pub fn get_current_iteration(&self) -> usize {
        self.current_iteration
    }

    #[wasm_bindgen(js_name = pause)]
    pub fn pause(&mut self) {
        if self.state == LoopState::Running {
            self.state = LoopState::Paused;
        }
    }

    #[wasm_bindgen(js_name = resume)]
    pub fn resume(&mut self) {
        if self.state == LoopState::Paused {
            self.state = LoopState::Running;
        }
    }

    #[wasm_bindgen(js_name = stop)]
    pub fn stop(&mut self) {
        self.state = LoopState::Completed;
    }

    /// Execute a single iteration of the control loop
    #[wasm_bindgen(js_name = executeIteration)]
    pub async fn execute_iteration(&mut self, input: String) -> Result<String, JsValue> {
        if self.state != LoopState::Running && self.state != LoopState::Idle {
            return Err(JsValue::from_str("Loop is not in a runnable state"));
        }

        self.state = LoopState::Running;
        self.current_iteration += 1;

        // Build context with input
        let context = format!(
            "Iteration: {}\nContext:\n{}\nInput: {}",
            self.current_iteration,
            self.context_manager.get_context_string(),
            input
        );

        // Here we would call the actual model
        // For now, return a mock response
        let output = format!("Processing iteration {} with input: {}", self.current_iteration, input);

        // Evaluate the result
        let evaluation = self.evaluate_output(&output);

        // Record history
        let entry = HistoryEntry::new(
            self.current_iteration,
            input,
            output.clone(),
            evaluation,
        );
        self.history.push(entry);

        // Update state based on evaluation
        match evaluation {
            EvaluationResult::Complete => self.state = LoopState::Completed,
            EvaluationResult::Abort => self.state = LoopState::Failed,
            _ => {}
        }

        Ok(output)
    }

    fn evaluate_output(&self, _output: &str) -> EvaluationResult {
        // Simple evaluation logic
        if self.current_iteration >= self.evaluation_strategy.max_iterations {
            EvaluationResult::Complete
        } else {
            EvaluationResult::Continue
        }
    }

    #[wasm_bindgen(js_name = getHistory)]
    pub fn get_history(&self) -> String {
        serde_json::to_string_pretty(&self.history).unwrap_or_default()
    }

    #[wasm_bindgen(js_name = reset)]
    pub fn reset(&mut self) {
        self.state = LoopState::Idle;
        self.current_iteration = 0;
        self.history.clear();
        self.context_manager.clear();
    }

    #[wasm_bindgen(js_name = toJson)]
    pub fn to_json(&self) -> String {
        let data = serde_json::json!({
            "id": self.id,
            "state": self.state,
            "current_iteration": self.current_iteration,
            "max_iterations": self.evaluation_strategy.max_iterations,
            "context": self.context_manager.context,
            "history": self.history,
        });
        
        serde_json::to_string_pretty(&data).unwrap_or_default()
    }
}

/// Builder for creating control loops with fluent API
#[wasm_bindgen]
pub struct ControlLoopBuilder {
    max_iterations: usize,
    max_tokens: usize,
    initial_context: HashMap<String, String>,
    model_name: String,
}

#[wasm_bindgen]
impl ControlLoopBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            max_iterations: 5,
            max_tokens: 4000,
            initial_context: HashMap::new(),
            model_name: "default".to_string(),
        }
    }

    #[wasm_bindgen(js_name = withMaxIterations)]
    pub fn with_max_iterations(mut self, max: usize) -> Self {
        self.max_iterations = max;
        self
    }

    #[wasm_bindgen(js_name = withMaxTokens)]
    pub fn with_max_tokens(mut self, max: usize) -> Self {
        self.max_tokens = max;
        self
    }

    #[wasm_bindgen(js_name = withModel)]
    pub fn with_model(mut self, model: String) -> Self {
        self.model_name = model;
        self
    }

    #[wasm_bindgen(js_name = withContext)]
    pub fn with_context(mut self, key: String, value: String) -> Self {
        self.initial_context.insert(key, value);
        self
    }

    #[wasm_bindgen(js_name = build)]
    pub fn build(self) -> ControlLoop {
        let mut loop_instance = ControlLoop::new(self.max_iterations, self.max_tokens);
        loop_instance.set_model(self.model_name);
        
        for (key, value) in self.initial_context {
            loop_instance.add_context(key, value);
        }
        
        loop_instance
    }
}

/// Pre-built control loop templates
#[wasm_bindgen]
pub struct LoopTemplates;

#[wasm_bindgen]
impl LoopTemplates {
    /// Create a reasoning loop for step-by-step problem solving
    #[wasm_bindgen(js_name = reasoning)]
    pub fn reasoning() -> ControlLoop {
        ControlLoopBuilder::new()
            .with_max_iterations(5)
            .with_context("mode".to_string(), "step_by_step_reasoning".to_string())
            .with_context("objective".to_string(), "solve_problem".to_string())
            .build()
    }

    /// Create a refinement loop for iterative improvement
    #[wasm_bindgen(js_name = refinement)]
    pub fn refinement() -> ControlLoop {
        ControlLoopBuilder::new()
            .with_max_iterations(3)
            .with_context("mode".to_string(), "iterative_refinement".to_string())
            .with_context("objective".to_string(), "improve_quality".to_string())
            .build()
    }

    /// Create a validation loop for checking outputs
    #[wasm_bindgen(js_name = validation)]
    pub fn validation() -> ControlLoop {
        ControlLoopBuilder::new()
            .with_max_iterations(2)
            .with_context("mode".to_string(), "validation".to_string())
            .with_context("objective".to_string(), "verify_correctness".to_string())
            .build()
    }

    /// Create a research loop for information gathering
    #[wasm_bindgen(js_name = research)]
    pub fn research() -> ControlLoop {
        ControlLoopBuilder::new()
            .with_max_iterations(7)
            .with_context("mode".to_string(), "research".to_string())
            .with_context("objective".to_string(), "gather_information".to_string())
            .build()
    }
}

// PyO3 bindings for Python interop
#[cfg(feature = "pyo3")]
#[pymodule]
fn control_loop(_py: Python, m: &PyModule) -> PyResult<()> {
    #[pyfn(m)]
    fn create_control_loop(max_iterations: usize, max_tokens: usize) -> PyResult<String> {
        let loop_instance = ControlLoop::new(max_iterations, max_tokens);
        Ok(loop_instance.to_json())
    }

    #[pyfn(m)]
    fn execute_iteration_sync(loop_json: String, input: String) -> PyResult<String> {
        // This would need async runtime integration for real implementation
        Ok(format!("Mock execution with input: {}", input))
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_control_loop_creation() {
        let loop_instance = ControlLoop::new(5, 4000);
        assert_eq!(loop_instance.get_state(), LoopState::Idle);
        assert_eq!(loop_instance.get_current_iteration(), 0);
    }

    #[test]
    fn test_context_manager() {
        let mut cm = ContextManager::new(4000, 1000);
        cm.update("test".to_string(), "value".to_string(), 1);
        assert_eq!(cm.get("test"), Some("value".to_string()));
    }

    #[test]
    fn test_builder_pattern() {
        let loop_instance = ControlLoopBuilder::new()
            .with_max_iterations(10)
            .with_max_tokens(8000)
            .with_model("gpt-4".to_string())
            .with_context("goal".to_string(), "test".to_string())
            .build();
        
        assert_eq!(loop_instance.get_state(), LoopState::Idle);
    }

    #[tokio::test]
    async fn test_iteration_execution() {
        let mut loop_instance = ControlLoop::new(3, 4000);
        let result = loop_instance.execute_iteration("test input".to_string()).await;
        assert!(result.is_ok());
        assert_eq!(loop_instance.get_current_iteration(), 1);
    }
}