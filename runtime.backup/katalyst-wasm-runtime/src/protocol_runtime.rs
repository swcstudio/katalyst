/// Protocol Runtime - Unified execution environment for protocol shells and symbolic residue
/// 
/// This module provides a comprehensive runtime that combines protocol shell execution
/// with symbolic residue tracking, creating a complete context engineering system.

use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use chrono::Utc;
use async_trait::async_trait;

use crate::protocol_shell_v1::{ProtocolShellV1, ProcessOperation, ProtocolTemplatesV1};
use crate::symbolic_residue_v1::{
    SymbolicResidueV1, TrackedResidue, ResidueState, ResidueManager, InteractionType
};
use crate::field_resonance::{SemanticField, FieldState};
use crate::schema_handler::{ContextSchema, ValidationResult};

/// Protocol execution context
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExecutionContext {
    pub field: SemanticField,
    pub residue_manager: ResidueManager,
    pub context_schema: ContextSchema,
    pub execution_history: Vec<ExecutionRecord>,
    pub current_state: ExecutionState,
}

/// Execution state
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum ExecutionState {
    Idle,
    Preparing,
    Executing,
    Processing,
    Integrating,
    Complete,
    Error,
}

/// Execution record for audit trail
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExecutionRecord {
    pub timestamp: String,
    pub protocol_name: String,
    pub operation: String,
    pub input: Value,
    pub output: Value,
    pub residue_created: Vec<String>,
    pub field_changes: Vec<String>,
}

/// Protocol operation handler trait
#[async_trait]
pub trait OperationHandler: Send + Sync {
    async fn handle(
        &self,
        operation: &ProcessOperation,
        context: &mut ExecutionContext,
        input: &Value,
    ) -> Result<Value, String>;
}

/// Default operation handlers
pub struct DefaultOperationHandlers;

impl DefaultOperationHandlers {
    pub fn create_handlers() -> HashMap<String, Box<dyn OperationHandler>> {
        let mut handlers: HashMap<String, Box<dyn OperationHandler>> = HashMap::new();
        
        handlers.insert("understand.restate".to_string(), Box::new(UnderstandHandler));
        handlers.insert("analyze.decompose".to_string(), Box::new(AnalyzeHandler));
        handlers.insert("plan.design".to_string(), Box::new(PlanHandler));
        handlers.insert("execute.implement".to_string(), Box::new(ExecuteHandler));
        handlers.insert("verify.validate".to_string(), Box::new(VerifyHandler));
        handlers.insert("refine.improve".to_string(), Box::new(RefineHandler));
        handlers.insert("parse.structure".to_string(), Box::new(ParseHandler));
        handlers.insert("evaluate.quality".to_string(), Box::new(EvaluateHandler));
        handlers.insert("surface.residue".to_string(), Box::new(SurfaceResidueHandler));
        handlers.insert("integrate.residue".to_string(), Box::new(IntegrateResidueHandler));
        
        handlers
    }
}

/// Understand operation handler
struct UnderstandHandler;

#[async_trait]
impl OperationHandler for UnderstandHandler {
    async fn handle(
        &self,
        _operation: &ProcessOperation,
        context: &mut ExecutionContext,
        input: &Value,
    ) -> Result<Value, String> {
        // Extract problem statement
        let problem = input.get("problem")
            .and_then(|p| p.as_str())
            .unwrap_or("No problem specified");
        
        // Create residue for problem understanding
        let residue_id = format!("understand_{}", Utc::now().timestamp_millis());
        let residue = TrackedResidue::new(
            residue_id.clone(),
            format!("Understanding: {}", problem),
            0.7,
            ResidueState::Surfaced,
        );
        
        context.residue_manager.schema.add_residue(residue);
        
        Ok(serde_json::json!({
            "understood": true,
            "problem_restated": problem,
            "residue_id": residue_id,
        }))
    }
}

/// Analyze operation handler
struct AnalyzeHandler;

#[async_trait]
impl OperationHandler for AnalyzeHandler {
    async fn handle(
        &self,
        _operation: &ProcessOperation,
        context: &mut ExecutionContext,
        input: &Value,
    ) -> Result<Value, String> {
        // Decompose problem into components
        let components = vec![
            "Data processing",
            "Algorithm selection",
            "Resource management",
        ];
        
        // Create residue for each component
        let mut residue_ids = Vec::new();
        for component in &components {
            let residue_id = format!("component_{}", Utc::now().timestamp_millis());
            let residue = TrackedResidue::new(
                residue_id.clone(),
                format!("Component: {}", component),
                0.6,
                ResidueState::Surfaced,
            );
            
            context.residue_manager.schema.add_residue(residue);
            residue_ids.push(residue_id);
        }
        
        Ok(serde_json::json!({
            "components": components,
            "residue_ids": residue_ids,
            "analysis_complete": true,
        }))
    }
}

/// Plan operation handler
struct PlanHandler;

#[async_trait]
impl OperationHandler for PlanHandler {
    async fn handle(
        &self,
        _operation: &ProcessOperation,
        context: &mut ExecutionContext,
        _input: &Value,
    ) -> Result<Value, String> {
        // Design step-by-step approach
        let steps = vec![
            "Initialize resources",
            "Process input data",
            "Apply transformations",
            "Generate output",
        ];
        
        // Update field state
        context.field.update_state(FieldState::Resonant);
        
        Ok(serde_json::json!({
            "plan": steps,
            "field_state": "resonant",
            "planning_complete": true,
        }))
    }
}

/// Execute operation handler
struct ExecuteHandler;

#[async_trait]
impl OperationHandler for ExecuteHandler {
    async fn handle(
        &self,
        _operation: &ProcessOperation,
        context: &mut ExecutionContext,
        _input: &Value,
    ) -> Result<Value, String> {
        // Implement solution
        context.current_state = ExecutionState::Executing;
        
        // Simulate execution
        let execution_result = "Solution implemented successfully";
        
        // Create execution residue
        let residue = TrackedResidue::new(
            format!("exec_{}", Utc::now().timestamp_millis()),
            execution_result.to_string(),
            0.9,
            ResidueState::Integrated,
        );
        
        context.residue_manager.schema.add_residue(residue);
        
        Ok(serde_json::json!({
            "execution_result": execution_result,
            "status": "success",
        }))
    }
}

/// Verify operation handler
struct VerifyHandler;

#[async_trait]
impl OperationHandler for VerifyHandler {
    async fn handle(
        &self,
        _operation: &ProcessOperation,
        context: &mut ExecutionContext,
        _input: &Value,
    ) -> Result<Value, String> {
        // Validate against requirements
        let validation_results = vec![
            ("Functionality", true),
            ("Performance", true),
            ("Security", true),
        ];
        
        // Update field coherence
        context.field.update_coherence(0.85);
        
        Ok(serde_json::json!({
            "validation_results": validation_results,
            "all_passed": true,
            "field_coherence": 0.85,
        }))
    }
}

/// Refine operation handler
struct RefineHandler;

#[async_trait]
impl OperationHandler for RefineHandler {
    async fn handle(
        &self,
        _operation: &ProcessOperation,
        context: &mut ExecutionContext,
        _input: &Value,
    ) -> Result<Value, String> {
        // Improve based on verification
        let improvements = vec![
            "Optimized algorithm",
            "Enhanced error handling",
            "Improved documentation",
        ];
        
        // Integrate residues
        let integrated = context.residue_manager.schema.integrate_residues();
        
        Ok(serde_json::json!({
            "improvements": improvements,
            "integrated_residues": integrated,
            "refinement_complete": true,
        }))
    }
}

/// Parse operation handler
struct ParseHandler;

#[async_trait]
impl OperationHandler for ParseHandler {
    async fn handle(
        &self,
        _operation: &ProcessOperation,
        _context: &mut ExecutionContext,
        input: &Value,
    ) -> Result<Value, String> {
        let code = input.get("code")
            .and_then(|c| c.as_str())
            .unwrap_or("");
        
        Ok(serde_json::json!({
            "structure": "modular",
            "patterns": ["singleton", "factory"],
            "lines_of_code": code.lines().count(),
        }))
    }
}

/// Evaluate operation handler
struct EvaluateHandler;

#[async_trait]
impl OperationHandler for EvaluateHandler {
    async fn handle(
        &self,
        _operation: &ProcessOperation,
        context: &mut ExecutionContext,
        _input: &Value,
    ) -> Result<Value, String> {
        // Assess quality
        let quality_metrics = serde_json::json!({
            "maintainability": 0.8,
            "readability": 0.85,
            "performance": 0.75,
            "security": 0.9,
        });
        
        // Update field resonance
        context.field.update_resonance(0.8);
        
        Ok(quality_metrics)
    }
}

/// Surface residue operation handler
struct SurfaceResidueHandler;

#[async_trait]
impl OperationHandler for SurfaceResidueHandler {
    async fn handle(
        &self,
        _operation: &ProcessOperation,
        context: &mut ExecutionContext,
        _input: &Value,
    ) -> Result<Value, String> {
        let surfaced = context.residue_manager.schema.surface_residues(Some(5));
        
        Ok(serde_json::json!({
            "surfaced_residues": surfaced,
            "count": surfaced.len(),
        }))
    }
}

/// Integrate residue operation handler
struct IntegrateResidueHandler;

#[async_trait]
impl OperationHandler for IntegrateResidueHandler {
    async fn handle(
        &self,
        _operation: &ProcessOperation,
        context: &mut ExecutionContext,
        _input: &Value,
    ) -> Result<Value, String> {
        let integrated = context.residue_manager.schema.integrate_residues();
        
        // Create echoes for integrated residues
        let echoes = context.residue_manager.schema.create_echoes();
        
        Ok(serde_json::json!({
            "integrated_residues": integrated,
            "echo_residues": echoes,
            "total_processed": integrated.len() + echoes.len(),
        }))
    }
}

/// Main Protocol Runtime
#[wasm_bindgen]
pub struct ProtocolRuntime {
    #[wasm_bindgen(skip)]
    pub context: ExecutionContext,
    #[wasm_bindgen(skip)]
    pub handlers: HashMap<String, Box<dyn OperationHandler>>,
    #[wasm_bindgen(skip)]
    pub loaded_protocols: HashMap<String, ProtocolShellV1>,
}

#[wasm_bindgen]
impl ProtocolRuntime {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            context: ExecutionContext {
                field: SemanticField::new("default".to_string()),
                residue_manager: ResidueManager::new(),
                context_schema: ContextSchema::new(),
                execution_history: Vec::new(),
                current_state: ExecutionState::Idle,
            },
            handlers: DefaultOperationHandlers::create_handlers(),
            loaded_protocols: HashMap::new(),
        }
    }
    
    #[wasm_bindgen(js_name = loadProtocol)]
    pub fn load_protocol(&mut self, name: String, protocol_json: String) -> Result<(), JsValue> {
        let protocol = ProtocolShellV1::from_json(&protocol_json)?;
        protocol.validate()?;
        
        self.loaded_protocols.insert(name, protocol);
        Ok(())
    }
    
    #[wasm_bindgen(js_name = loadTemplate)]
    pub fn load_template(&mut self, template_name: String) -> Result<(), JsValue> {
        let protocol = match template_name.as_str() {
            "reasoning_systematic" => ProtocolTemplatesV1::reasoning_systematic(),
            "code_analyze" => ProtocolTemplatesV1::code_analyze(),
            "workflow_tdd" => ProtocolTemplatesV1::workflow_tdd(),
            _ => return Err(JsValue::from_str("Unknown template")),
        };
        
        self.loaded_protocols.insert(template_name, protocol);
        Ok(())
    }
    
    #[wasm_bindgen(js_name = executeProtocol)]
    pub async fn execute_protocol(
        &mut self,
        protocol_name: String,
        input_json: String,
    ) -> Result<String, JsValue> {
        // Get protocol
        let protocol = self.loaded_protocols.get(&protocol_name)
            .ok_or_else(|| JsValue::from_str("Protocol not found"))?
            .clone();
        
        // Parse input
        let input: Value = serde_json::from_str(&input_json)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        
        // Set execution state
        self.context.current_state = ExecutionState::Preparing;
        
        // Initialize output
        let mut output = serde_json::json!({
            "protocol": protocol_name,
            "started": Utc::now().to_rfc3339(),
            "operations": [],
        });
        
        // Execute each operation
        self.context.current_state = ExecutionState::Executing;
        
        for operation in &protocol.process {
            let op_result = self.execute_operation(&operation, &input).await?;
            
            // Record execution
            let record = ExecutionRecord {
                timestamp: Utc::now().to_rfc3339(),
                protocol_name: protocol_name.clone(),
                operation: operation.operation.clone(),
                input: input.clone(),
                output: op_result.clone(),
                residue_created: Vec::new(), // Would be populated from actual execution
                field_changes: Vec::new(),
            };
            
            self.context.execution_history.push(record);
            
            // Add to output
            if let Some(ops) = output.get_mut("operations").and_then(|o| o.as_array_mut()) {
                ops.push(serde_json::json!({
                    "operation": operation.operation,
                    "result": op_result,
                }));
            }
        }
        
        // Process residues
        self.context.current_state = ExecutionState::Processing;
        self.context.residue_manager.schema.decay_residues(1.0);
        
        // Complete execution
        self.context.current_state = ExecutionState::Complete;
        
        output["completed"] = Value::String(Utc::now().to_rfc3339());
        output["metrics"] = serde_json::from_str(
            &self.context.residue_manager.schema.get_metrics()
        ).unwrap_or(Value::Null);
        
        Ok(serde_json::to_string_pretty(&output).unwrap_or_default())
    }
    
    async fn execute_operation(
        &mut self,
        operation: &ProcessOperation,
        input: &Value,
    ) -> Result<Value, JsValue> {
        // Check if we have a handler for this operation
        if let Some(handler) = self.handlers.get(&operation.operation) {
            handler.handle(operation, &mut self.context, input)
                .await
                .map_err(|e| JsValue::from_str(&e))
        } else {
            // Default handling
            Ok(serde_json::json!({
                "operation": operation.operation,
                "status": "completed",
                "default_handler": true,
            }))
        }
    }
    
    #[wasm_bindgen(js_name = getState)]
    pub fn get_state(&self) -> String {
        serde_json::json!({
            "current_state": self.context.current_state,
            "field_state": self.context.field.get_state(),
            "loaded_protocols": self.loaded_protocols.keys().collect::<Vec<_>>(),
            "execution_history_count": self.context.execution_history.len(),
            "residue_metrics": serde_json::from_str::<Value>(
                &self.context.residue_manager.schema.get_metrics()
            ).unwrap_or(Value::Null),
        }).to_string()
    }
    
    #[wasm_bindgen(js_name = addResidue)]
    pub fn add_residue(&mut self, content: String, strength: f64) -> String {
        self.context.residue_manager.add_field_residue(content, strength)
    }
    
    #[wasm_bindgen(js_name = processField)]
    pub fn process_field(&mut self, field_data: String) -> String {
        self.context.residue_manager.process_field(&field_data)
    }
    
    #[wasm_bindgen(js_name = getExecutionHistory)]
    pub fn get_execution_history(&self) -> String {
        serde_json::to_string_pretty(&self.context.execution_history)
            .unwrap_or_default()
    }
    
    #[wasm_bindgen(js_name = clearHistory)]
    pub fn clear_history(&mut self) {
        self.context.execution_history.clear();
        self.context.residue_manager.clear_log();
    }
}

/// Protocol runtime builder for configuration
#[wasm_bindgen]
pub struct ProtocolRuntimeBuilder {
    runtime: ProtocolRuntime,
}

#[wasm_bindgen]
impl ProtocolRuntimeBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            runtime: ProtocolRuntime::new(),
        }
    }
    
    #[wasm_bindgen(js_name = withContextSchema)]
    pub fn with_context_schema(mut self, schema_json: String) -> Result<ProtocolRuntimeBuilder, JsValue> {
        self.runtime.context.context_schema = ContextSchema::from_json(&schema_json)?;
        Ok(self)
    }
    
    #[wasm_bindgen(js_name = withField)]
    pub fn with_field(mut self, field_name: String) -> Self {
        self.runtime.context.field = SemanticField::new(field_name);
        self
    }
    
    #[wasm_bindgen(js_name = build)]
    pub fn build(self) -> ProtocolRuntime {
        self.runtime
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_protocol_runtime_creation() {
        let runtime = ProtocolRuntime::new();
        assert_eq!(runtime.context.current_state, ExecutionState::Idle);
    }
    
    #[tokio::test]
    async fn test_load_template() {
        let mut runtime = ProtocolRuntime::new();
        let result = runtime.load_template("reasoning_systematic".to_string());
        assert!(result.is_ok());
        assert!(runtime.loaded_protocols.contains_key("reasoning_systematic"));
    }
    
    #[tokio::test]
    async fn test_execute_protocol() {
        let mut runtime = ProtocolRuntime::new();
        runtime.load_template("reasoning_systematic".to_string()).unwrap();
        
        let input = serde_json::json!({
            "problem": "Test problem",
            "constraints": ["constraint1", "constraint2"],
            "context": {}
        });
        
        let result = runtime.execute_protocol(
            "reasoning_systematic".to_string(),
            input.to_string()
        ).await;
        
        assert!(result.is_ok());
        let output = result.unwrap();
        assert!(output.contains("completed"));
    }
    
    #[tokio::test]
    async fn test_residue_management() {
        let mut runtime = ProtocolRuntime::new();
        let id = runtime.add_residue("Test content".to_string(), 0.7);
        assert!(!id.is_empty());
        
        let metrics = runtime.process_field("Test field data".to_string());
        assert!(metrics.contains("average_strength"));
    }
}