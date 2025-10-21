/// Field Protocol Shells - Reusable templates for implementing field protocols
/// 
/// This module provides a framework for parsing, validating, and executing field protocols
/// in a structured format, optimized for WebAssembly deployment.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use regex::Regex;

#[cfg(feature = "pyo3")]
use pyo3::prelude::*;

/// Protocol section types
#[wasm_bindgen]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SectionType {
    Intent,
    Input,
    Process,
    Output,
    Meta,
}

/// Operation types in protocol processes
#[wasm_bindgen]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum OperationType {
    AttractorScan,
    ResidueSurface,
    CoEmergenceFilter,
    ResonanceAmplify,
    FieldInjection,
    SymbolicIntegration,
    PatternExtraction,
    StateTransition,
}

/// Protocol operation
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProtocolOperation {
    pub operation_type: OperationType,
    pub name: String,
    #[wasm_bindgen(skip)]
    pub parameters: HashMap<String, serde_json::Value>,
    #[wasm_bindgen(skip)]
    pub conditions: Vec<String>,
}

#[wasm_bindgen]
impl ProtocolOperation {
    #[wasm_bindgen(constructor)]
    pub fn new(operation_type: OperationType, name: String) -> Self {
        Self {
            operation_type,
            name,
            parameters: HashMap::new(),
            conditions: Vec::new(),
        }
    }

    #[wasm_bindgen(js_name = addParameter)]
    pub fn add_parameter(&mut self, key: String, value: String) {
        self.parameters.insert(key, serde_json::Value::String(value));
    }

    #[wasm_bindgen(js_name = addCondition)]
    pub fn add_condition(&mut self, condition: String) {
        self.conditions.push(condition);
    }
}

/// Protocol shell structure
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProtocolShell {
    pub name: String,
    pub intent: String,
    #[wasm_bindgen(skip)]
    pub input_schema: HashMap<String, String>,
    #[wasm_bindgen(skip)]
    pub process: Vec<ProtocolOperation>,
    #[wasm_bindgen(skip)]
    pub output_schema: HashMap<String, String>,
    #[wasm_bindgen(skip)]
    pub metadata: HashMap<String, serde_json::Value>,
}

#[wasm_bindgen]
impl ProtocolShell {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String, intent: String) -> Self {
        Self {
            name,
            intent,
            input_schema: HashMap::new(),
            process: Vec::new(),
            output_schema: HashMap::new(),
            metadata: HashMap::new(),
        }
    }

    #[wasm_bindgen(js_name = addInputField)]
    pub fn add_input_field(&mut self, name: String, field_type: String) {
        self.input_schema.insert(name, field_type);
    }

    #[wasm_bindgen(js_name = addOutputField)]
    pub fn add_output_field(&mut self, name: String, field_type: String) {
        self.output_schema.insert(name, field_type);
    }

    #[wasm_bindgen(js_name = addOperation)]
    pub fn add_operation(&mut self, operation: ProtocolOperation) {
        self.process.push(operation);
    }

    #[wasm_bindgen(js_name = validate)]
    pub fn validate(&self) -> Result<bool, JsValue> {
        // Validate that all required fields are present
        if self.name.is_empty() {
            return Err(JsValue::from_str("Protocol name is required"));
        }
        
        if self.intent.is_empty() {
            return Err(JsValue::from_str("Protocol intent is required"));
        }
        
        if self.process.is_empty() {
            return Err(JsValue::from_str("Protocol must have at least one operation"));
        }
        
        Ok(true)
    }

    #[wasm_bindgen(js_name = toJson)]
    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(&self).unwrap_or_default()
    }

    #[wasm_bindgen(js_name = fromJson)]
    pub fn from_json(json: &str) -> Result<ProtocolShell, JsValue> {
        serde_json::from_str(json)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

/// Protocol parser for Pareto-lang format
#[wasm_bindgen]
pub struct ProtocolParser;

#[wasm_bindgen]
impl ProtocolParser {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self
    }

    #[wasm_bindgen(js_name = parseShell)]
    pub fn parse_shell(&self, shell_content: &str) -> Result<ProtocolShell, JsValue> {
        // Extract protocol name
        let name_regex = Regex::new(r"^([\w\.]+)\s*\{")
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        
        let name = name_regex.captures(shell_content)
            .and_then(|cap| cap.get(1))
            .map(|m| m.as_str().to_string())
            .ok_or_else(|| JsValue::from_str("Failed to parse protocol name"))?;
        
        // Extract intent
        let intent_regex = Regex::new(r#"intent:\s*"([^"]*)"#)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        
        let intent = intent_regex.captures(shell_content)
            .and_then(|cap| cap.get(1))
            .map(|m| m.as_str().to_string())
            .unwrap_or_default();
        
        let mut shell = ProtocolShell::new(name, intent);
        
        // Parse input schema
        if let Some(input_match) = Regex::new(r"input:\s*\{([^}]*)\}")
            .ok()
            .and_then(|r| r.captures(shell_content)) {
            if let Some(content) = input_match.get(1) {
                self.parse_schema_fields(&mut shell.input_schema, content.as_str());
            }
        }
        
        // Parse process operations
        if let Some(process_match) = Regex::new(r"process:\s*\[(.*?)\]")
            .ok()
            .and_then(|r| r.captures(shell_content)) {
            if let Some(content) = process_match.get(1) {
                self.parse_operations(&mut shell.process, content.as_str());
            }
        }
        
        // Parse output schema
        if let Some(output_match) = Regex::new(r"output:\s*\{([^}]*)\}")
            .ok()
            .and_then(|r| r.captures(shell_content)) {
            if let Some(content) = output_match.get(1) {
                self.parse_schema_fields(&mut shell.output_schema, content.as_str());
            }
        }
        
        Ok(shell)
    }

    fn parse_schema_fields(&self, schema: &mut HashMap<String, String>, content: &str) {
        // Parse field definitions like: field_name: "type"
        let field_regex = Regex::new(r#"(\w+):\s*"([^"]*)"#).unwrap();
        
        for cap in field_regex.captures_iter(content) {
            if let (Some(name), Some(field_type)) = (cap.get(1), cap.get(2)) {
                schema.insert(
                    name.as_str().to_string(),
                    field_type.as_str().to_string()
                );
            }
        }
    }

    fn parse_operations(&self, operations: &mut Vec<ProtocolOperation>, content: &str) {
        // Parse operations like: /operation_name{params}
        let op_regex = Regex::new(r"/(\w+)\{([^}]*)\}").unwrap();
        
        for cap in op_regex.captures_iter(content) {
            if let Some(name) = cap.get(1) {
                let op_type = match name.as_str() {
                    "attractor_scan" => OperationType::AttractorScan,
                    "residue_surface" => OperationType::ResidueSurface,
                    "co_emergence_filter" => OperationType::CoEmergenceFilter,
                    "resonance_amplify" => OperationType::ResonanceAmplify,
                    "field_injection" => OperationType::FieldInjection,
                    "symbolic_integration" => OperationType::SymbolicIntegration,
                    "pattern_extraction" => OperationType::PatternExtraction,
                    _ => OperationType::StateTransition,
                };
                
                let mut operation = ProtocolOperation::new(op_type, name.as_str().to_string());
                
                // Parse parameters if present
                if let Some(params) = cap.get(2) {
                    self.parse_operation_params(&mut operation, params.as_str());
                }
                
                operations.push(operation);
            }
        }
    }

    fn parse_operation_params(&self, operation: &mut ProtocolOperation, params: &str) {
        // Parse key=value pairs
        let param_regex = Regex::new(r#"(\w+)=([^,]+)"#).unwrap();
        
        for cap in param_regex.captures_iter(params) {
            if let (Some(key), Some(value)) = (cap.get(1), cap.get(2)) {
                operation.add_parameter(
                    key.as_str().to_string(),
                    value.as_str().trim().to_string()
                );
            }
        }
    }
}

/// Protocol executor for running protocol shells
#[wasm_bindgen]
pub struct ProtocolExecutor {
    #[wasm_bindgen(skip)]
    pub execution_log: Vec<String>,
}

#[wasm_bindgen]
impl ProtocolExecutor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            execution_log: Vec::new(),
        }
    }

    #[wasm_bindgen(js_name = execute)]
    pub async fn execute(&mut self, shell: &ProtocolShell, input_json: &str) -> Result<String, JsValue> {
        // Validate protocol first
        shell.validate()?;
        
        // Parse input
        let input: serde_json::Value = serde_json::from_str(input_json)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        
        // Initialize output
        let mut output = serde_json::json!({});
        
        // Execute each operation in sequence
        for operation in &shell.process {
            self.log(&format!("Executing operation: {}", operation.name));
            
            let result = self.execute_operation(operation, &input, &output).await?;
            
            // Merge result into output
            if let serde_json::Value::Object(map) = result {
                for (key, value) in map {
                    output[key] = value;
                }
            }
        }
        
        Ok(serde_json::to_string_pretty(&output).unwrap_or_default())
    }

    async fn execute_operation(
        &mut self,
        operation: &ProtocolOperation,
        input: &serde_json::Value,
        _current_output: &serde_json::Value
    ) -> Result<serde_json::Value, JsValue> {
        match operation.operation_type {
            OperationType::AttractorScan => {
                self.log("Scanning for attractors in field");
                Ok(serde_json::json!({
                    "attractors_found": 3,
                    "strongest_attractor": "convergence_pattern"
                }))
            },
            OperationType::ResidueSurface => {
                self.log("Surfacing symbolic residue");
                Ok(serde_json::json!({
                    "residue_surfaced": true,
                    "residue_count": 5
                }))
            },
            OperationType::CoEmergenceFilter => {
                self.log("Filtering for co-emergent patterns");
                Ok(serde_json::json!({
                    "co_emergent_patterns": ["pattern_a", "pattern_b"]
                }))
            },
            OperationType::ResonanceAmplify => {
                self.log("Amplifying resonant patterns");
                Ok(serde_json::json!({
                    "amplification_factor": 1.5,
                    "resonance_increased": true
                }))
            },
            OperationType::FieldInjection => {
                self.log("Injecting patterns into field");
                Ok(serde_json::json!({
                    "injection_successful": true,
                    "field_updated": true
                }))
            },
            _ => {
                self.log(&format!("Executing generic operation: {:?}", operation.operation_type));
                Ok(serde_json::json!({
                    "operation": operation.name.clone(),
                    "completed": true
                }))
            }
        }
    }

    fn log(&mut self, message: &str) {
        self.execution_log.push(format!("[{}] {}", 
            chrono::Utc::now().format("%Y-%m-%d %H:%M:%S"),
            message
        ));
    }

    #[wasm_bindgen(js_name = getLog)]
    pub fn get_log(&self) -> String {
        self.execution_log.join("\n")
    }

    #[wasm_bindgen(js_name = clearLog)]
    pub fn clear_log(&mut self) {
        self.execution_log.clear();
    }
}

/// Common protocol templates
#[wasm_bindgen]
pub struct ProtocolTemplates;

#[wasm_bindgen]
impl ProtocolTemplates {
    #[wasm_bindgen(js_name = attractorCoEmergence)]
    pub fn attractor_co_emergence() -> ProtocolShell {
        let mut shell = ProtocolShell::new(
            "attractor.co.emerge".to_string(),
            "Enable co-emergence of attractors in semantic field".to_string()
        );
        
        shell.add_input_field("current_field_state".to_string(), "Field".to_string());
        shell.add_input_field("candidate_attractors".to_string(), "List<Attractor>".to_string());
        
        let scan_op = ProtocolOperation::new(
            OperationType::AttractorScan,
            "attractor_scan".to_string()
        );
        shell.add_operation(scan_op);
        
        let surface_op = ProtocolOperation::new(
            OperationType::ResidueSurface,
            "residue_surface".to_string()
        );
        shell.add_operation(surface_op);
        
        let filter_op = ProtocolOperation::new(
            OperationType::CoEmergenceFilter,
            "co_emergence_filter".to_string()
        );
        shell.add_operation(filter_op);
        
        shell.add_output_field("updated_field_state".to_string(), "Field".to_string());
        shell.add_output_field("co_emergent_attractors".to_string(), "List<Attractor>".to_string());
        
        shell
    }

    #[wasm_bindgen(js_name = symbolicResidue)]
    pub fn symbolic_residue() -> ProtocolShell {
        let mut shell = ProtocolShell::new(
            "symbolic.residue.process".to_string(),
            "Process and integrate symbolic residue in field".to_string()
        );
        
        shell.add_input_field("field".to_string(), "Field".to_string());
        shell.add_input_field("residue_fragments".to_string(), "List<Residue>".to_string());
        
        let surface_op = ProtocolOperation::new(
            OperationType::ResidueSurface,
            "surface_residue".to_string()
        );
        shell.add_operation(surface_op);
        
        let integrate_op = ProtocolOperation::new(
            OperationType::SymbolicIntegration,
            "integrate_symbols".to_string()
        );
        shell.add_operation(integrate_op);
        
        shell.add_output_field("processed_field".to_string(), "Field".to_string());
        shell.add_output_field("integrated_residue".to_string(), "List<Residue>".to_string());
        
        shell
    }

    #[wasm_bindgen(js_name = fieldEvolution)]
    pub fn field_evolution() -> ProtocolShell {
        let mut shell = ProtocolShell::new(
            "field.evolution.process".to_string(),
            "Guide field evolution through resonance and emergence".to_string()
        );
        
        shell.add_input_field("initial_field".to_string(), "Field".to_string());
        shell.add_input_field("evolution_parameters".to_string(), "Parameters".to_string());
        
        // Multi-step evolution process
        let scan_op = ProtocolOperation::new(
            OperationType::AttractorScan,
            "scan_field".to_string()
        );
        shell.add_operation(scan_op);
        
        let amplify_op = ProtocolOperation::new(
            OperationType::ResonanceAmplify,
            "amplify_resonance".to_string()
        );
        shell.add_operation(amplify_op);
        
        let extract_op = ProtocolOperation::new(
            OperationType::PatternExtraction,
            "extract_patterns".to_string()
        );
        shell.add_operation(extract_op);
        
        let transition_op = ProtocolOperation::new(
            OperationType::StateTransition,
            "transition_state".to_string()
        );
        shell.add_operation(transition_op);
        
        shell.add_output_field("evolved_field".to_string(), "Field".to_string());
        shell.add_output_field("evolution_metrics".to_string(), "Metrics".to_string());
        
        shell
    }
}

// PyO3 bindings
#[cfg(feature = "pyo3")]
#[pymodule]
fn field_protocol_shells(_py: Python, m: &PyModule) -> PyResult<()> {
    #[pyfn(m)]
    fn parse_protocol_shell(shell_content: String) -> PyResult<String> {
        let parser = ProtocolParser::new();
        match parser.parse_shell(&shell_content) {
            Ok(shell) => Ok(shell.to_json()),
            Err(_) => Err(pyo3::exceptions::PyValueError::new_err("Failed to parse shell"))
        }
    }

    #[pyfn(m)]
    fn create_protocol_template(template_name: String) -> PyResult<String> {
        let shell = match template_name.as_str() {
            "attractor_co_emergence" => ProtocolTemplates::attractor_co_emergence(),
            "symbolic_residue" => ProtocolTemplates::symbolic_residue(),
            "field_evolution" => ProtocolTemplates::field_evolution(),
            _ => return Err(pyo3::exceptions::PyValueError::new_err("Unknown template"))
        };
        Ok(shell.to_json())
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_protocol_creation() {
        let shell = ProtocolShell::new(
            "test.protocol".to_string(),
            "Test protocol intent".to_string()
        );
        assert_eq!(shell.name, "test.protocol");
        assert_eq!(shell.intent, "Test protocol intent");
    }

    #[test]
    fn test_protocol_validation() {
        let mut shell = ProtocolShell::new(
            "test.protocol".to_string(),
            "Test intent".to_string()
        );
        
        // Should fail without operations
        assert!(shell.validate().is_err());
        
        // Add operation and should pass
        let op = ProtocolOperation::new(
            OperationType::AttractorScan,
            "scan".to_string()
        );
        shell.add_operation(op);
        assert!(shell.validate().is_ok());
    }

    #[test]
    fn test_parser() {
        let shell_content = r#"
        test.protocol {
            intent: "Test protocol"
            input: {
                field: "Field"
            }
            process: [
                /attractor_scan{threshold=0.5}
            ]
            output: {
                result: "Field"
            }
        }
        "#;
        
        let parser = ProtocolParser::new();
        let result = parser.parse_shell(shell_content);
        assert!(result.is_ok());
    }
}