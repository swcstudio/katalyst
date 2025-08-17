/// Protocol Shell V1 - Implementation of the Protocol Shell Schema
/// 
/// This module implements the protocolShell.v1.json schema with full
/// validation, parsing, and execution capabilities.

use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use regex::Regex;
use chrono::Utc;

#[cfg(feature = "pyo3")]
use pyo3::prelude::*;

/// Protocol Shell V1 matching the JSON schema exactly
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProtocolShellV1 {
    pub intent: String,
    #[wasm_bindgen(skip)]
    pub input: HashMap<String, InputParameter>,
    #[wasm_bindgen(skip)]
    pub process: Vec<ProcessOperation>,
    #[wasm_bindgen(skip)]
    pub output: HashMap<String, OutputParameter>,
    #[wasm_bindgen(skip)]
    pub meta: ProtocolMeta,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum InputParameter {
    Simple(String),
    Complex(ParameterSpec),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParameterSpec {
    #[serde(rename = "type")]
    pub param_type: String,
    pub description: Option<String>,
    pub required: Option<bool>,
    pub default: Option<Value>,
    pub constraints: Option<ParameterConstraints>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParameterConstraints {
    pub min: Option<f64>,
    pub max: Option<f64>,
    pub pattern: Option<String>,
    pub enum_values: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum OutputParameter {
    Simple(String),
    Complex(OutputSpec),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutputSpec {
    #[serde(rename = "type")]
    pub output_type: String,
    pub description: Option<String>,
    pub format: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessOperation {
    pub operation: String,
    pub action: Option<String>,
    pub parameters: Option<HashMap<String, Value>>,
}

impl ProcessOperation {
    pub fn from_pareto_lang(operation_str: &str) -> Result<Self, String> {
        // Parse Pareto-lang format: /namespace.operation{params}
        let regex = Regex::new(r"^/([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\{(.*)\}$")
            .map_err(|e| e.to_string())?;
        
        if let Some(captures) = regex.captures(operation_str) {
            let namespace = captures.get(1).map(|m| m.as_str()).unwrap_or("");
            let operation = captures.get(2).map(|m| m.as_str()).unwrap_or("");
            let params_str = captures.get(3).map(|m| m.as_str()).unwrap_or("");
            
            let full_operation = format!("{}.{}", namespace, operation);
            let parameters = Self::parse_parameters(params_str)?;
            
            Ok(ProcessOperation {
                operation: full_operation,
                action: Some(operation.to_string()),
                parameters: Some(parameters),
            })
        } else {
            Err("Invalid Pareto-lang operation format".to_string())
        }
    }
    
    fn parse_parameters(params_str: &str) -> Result<HashMap<String, Value>, String> {
        let mut params = HashMap::new();
        
        if params_str.is_empty() {
            return Ok(params);
        }
        
        // Parse key=value pairs
        let param_regex = Regex::new(r#"(\w+)=("[^"]*"|'[^']*'|[^,\s]+)"#)
            .map_err(|e| e.to_string())?;
        
        for cap in param_regex.captures_iter(params_str) {
            if let (Some(key), Some(value_match)) = (cap.get(1), cap.get(2)) {
                let key_str = key.as_str();
                let value_str = value_match.as_str();
                
                // Remove quotes if present
                let cleaned_value = if (value_str.starts_with('"') && value_str.ends_with('"')) 
                    || (value_str.starts_with('\'') && value_str.ends_with('\'')) {
                    &value_str[1..value_str.len()-1]
                } else {
                    value_str
                };
                
                // Try to parse as number, boolean, or keep as string
                let value = if let Ok(num) = cleaned_value.parse::<f64>() {
                    Value::Number(serde_json::Number::from_f64(num).unwrap())
                } else if let Ok(bool_val) = cleaned_value.parse::<bool>() {
                    Value::Bool(bool_val)
                } else {
                    Value::String(cleaned_value.to_string())
                };
                
                params.insert(key_str.to_string(), value);
            }
        }
        
        Ok(params)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProtocolMeta {
    pub version: String,
    pub timestamp: Option<String>,
    pub author: Option<String>,
    pub description: Option<String>,
    pub tags: Option<Vec<String>>,
    #[serde(flatten)]
    pub additional: HashMap<String, Value>,
}

impl Default for ProtocolMeta {
    fn default() -> Self {
        Self {
            version: "1.0.0".to_string(),
            timestamp: Some(Utc::now().to_rfc3339()),
            author: None,
            description: None,
            tags: None,
            additional: HashMap::new(),
        }
    }
}

#[wasm_bindgen]
impl ProtocolShellV1 {
    #[wasm_bindgen(constructor)]
    pub fn new(intent: String) -> Self {
        Self {
            intent,
            input: HashMap::new(),
            process: Vec::new(),
            output: HashMap::new(),
            meta: ProtocolMeta::default(),
        }
    }
    
    #[wasm_bindgen(js_name = fromJson)]
    pub fn from_json(json_str: &str) -> Result<ProtocolShellV1, JsValue> {
        serde_json::from_str(json_str)
            .map_err(|e| JsValue::from_str(&format!("Failed to parse protocol: {}", e)))
    }
    
    #[wasm_bindgen(js_name = toJson)]
    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(self).unwrap_or_default()
    }
    
    #[wasm_bindgen(js_name = validate)]
    pub fn validate(&self) -> Result<bool, JsValue> {
        // Validate required fields
        if self.intent.is_empty() {
            return Err(JsValue::from_str("Intent is required"));
        }
        
        if self.process.is_empty() {
            return Err(JsValue::from_str("Process must contain at least one operation"));
        }
        
        // Validate meta version format
        let version_regex = Regex::new(r"^\d+\.\d+\.\d+$")
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        
        if !version_regex.is_match(&self.meta.version) {
            return Err(JsValue::from_str("Meta version must follow semantic versioning (x.y.z)"));
        }
        
        // Validate process operations
        let operation_regex = Regex::new(r"^/[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+\{.*\}$")
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        
        for (i, op) in self.process.iter().enumerate() {
            // Check if operation follows the pattern
            let op_str = format!("/{}{}", 
                op.operation.replace('.', "."),
                op.parameters.as_ref()
                    .map(|p| format!("{{{}}}", 
                        p.iter()
                            .map(|(k, v)| format!("{}={}", k, v))
                            .collect::<Vec<_>>()
                            .join(",")
                    ))
                    .unwrap_or_else(|| "{}".to_string())
            );
            
            if !operation_regex.is_match(&op_str) {
                return Err(JsValue::from_str(&format!(
                    "Process operation {} at index {} has invalid format", 
                    op.operation, i
                )));
            }
        }
        
        Ok(true)
    }
    
    #[wasm_bindgen(js_name = addInput)]
    pub fn add_input(&mut self, name: String, param_type: String, description: Option<String>) {
        let param = if let Some(desc) = description {
            InputParameter::Complex(ParameterSpec {
                param_type,
                description: Some(desc),
                required: Some(true),
                default: None,
                constraints: None,
            })
        } else {
            InputParameter::Simple(param_type)
        };
        
        self.input.insert(name, param);
    }
    
    #[wasm_bindgen(js_name = addProcess)]
    pub fn add_process(&mut self, operation: String, action: Option<String>) {
        self.process.push(ProcessOperation {
            operation,
            action,
            parameters: None,
        });
    }
    
    #[wasm_bindgen(js_name = addProcessFromPareto)]
    pub fn add_process_from_pareto(&mut self, pareto_operation: &str) -> Result<(), JsValue> {
        let op = ProcessOperation::from_pareto_lang(pareto_operation)
            .map_err(|e| JsValue::from_str(&e))?;
        self.process.push(op);
        Ok(())
    }
    
    #[wasm_bindgen(js_name = addOutput)]
    pub fn add_output(&mut self, name: String, output_type: String, description: Option<String>) {
        let param = if let Some(desc) = description {
            OutputParameter::Complex(OutputSpec {
                output_type,
                description: Some(desc),
                format: None,
            })
        } else {
            OutputParameter::Simple(output_type)
        };
        
        self.output.insert(name, param);
    }
    
    #[wasm_bindgen(js_name = setMeta)]
    pub fn set_meta(&mut self, version: String, author: Option<String>, description: Option<String>) {
        self.meta.version = version;
        self.meta.author = author;
        self.meta.description = description;
        self.meta.timestamp = Some(Utc::now().to_rfc3339());
    }
    
    #[wasm_bindgen(js_name = addTag)]
    pub fn add_tag(&mut self, tag: String) {
        if self.meta.tags.is_none() {
            self.meta.tags = Some(Vec::new());
        }
        if let Some(ref mut tags) = self.meta.tags {
            tags.push(tag);
        }
    }
}

/// Protocol Shell Builder for fluent construction
#[wasm_bindgen]
pub struct ProtocolShellBuilder {
    shell: ProtocolShellV1,
}

#[wasm_bindgen]
impl ProtocolShellBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(intent: String) -> Self {
        Self {
            shell: ProtocolShellV1::new(intent),
        }
    }
    
    #[wasm_bindgen(js_name = withInput)]
    pub fn with_input(mut self, name: String, param_type: String) -> Self {
        self.shell.add_input(name, param_type, None);
        self
    }
    
    #[wasm_bindgen(js_name = withProcess)]
    pub fn with_process(mut self, operation: String) -> Self {
        self.shell.add_process(operation, None);
        self
    }
    
    #[wasm_bindgen(js_name = withOutput)]
    pub fn with_output(mut self, name: String, output_type: String) -> Self {
        self.shell.add_output(name, output_type, None);
        self
    }
    
    #[wasm_bindgen(js_name = withMeta)]
    pub fn with_meta(mut self, version: String, author: String) -> Self {
        self.shell.set_meta(version, Some(author), None);
        self
    }
    
    #[wasm_bindgen(js_name = build)]
    pub fn build(self) -> ProtocolShellV1 {
        self.shell
    }
}

/// Protocol Templates following the V1 schema
#[wasm_bindgen]
pub struct ProtocolTemplatesV1;

#[wasm_bindgen]
impl ProtocolTemplatesV1 {
    #[wasm_bindgen(js_name = reasoningSystematic)]
    pub fn reasoning_systematic() -> ProtocolShellV1 {
        let mut shell = ProtocolShellV1::new(
            "Break down complex problems into logical steps with traceable reasoning".to_string()
        );
        
        shell.add_input("problem".to_string(), "string".to_string(), 
            Some("Problem statement to analyze".to_string()));
        shell.add_input("constraints".to_string(), "array".to_string(), 
            Some("List of constraints to consider".to_string()));
        shell.add_input("context".to_string(), "object".to_string(), 
            Some("Additional context information".to_string()));
        
        shell.add_process("understand.restate".to_string(), 
            Some("Restate problem and clarify goals".to_string()));
        shell.add_process("analyze.decompose".to_string(), 
            Some("Break down into components".to_string()));
        shell.add_process("plan.design".to_string(), 
            Some("Design step-by-step approach".to_string()));
        shell.add_process("execute.implement".to_string(), 
            Some("Implement solution methodically".to_string()));
        shell.add_process("verify.validate".to_string(), 
            Some("Validate against requirements".to_string()));
        shell.add_process("refine.improve".to_string(), 
            Some("Improve based on verification".to_string()));
        
        shell.add_output("solution".to_string(), "object".to_string(), 
            Some("Implemented solution".to_string()));
        shell.add_output("reasoning".to_string(), "string".to_string(), 
            Some("Complete reasoning trace".to_string()));
        shell.add_output("verification".to_string(), "object".to_string(), 
            Some("Validation evidence".to_string()));
        
        shell.set_meta("1.0.0".to_string(), Some("System".to_string()), 
            Some("Systematic reasoning protocol for complex problem solving".to_string()));
        shell.add_tag("reasoning".to_string());
        shell.add_tag("problem-solving".to_string());
        shell.add_tag("systematic".to_string());
        
        shell
    }
    
    #[wasm_bindgen(js_name = codeAnalyze)]
    pub fn code_analyze() -> ProtocolShellV1 {
        let mut shell = ProtocolShellV1::new(
            "Deeply understand code structure, patterns and quality".to_string()
        );
        
        shell.add_input("code".to_string(), "string".to_string(), 
            Some("Code to analyze".to_string()));
        shell.add_input("focus".to_string(), "array".to_string(), 
            Some("Specific aspects to examine".to_string()));
        
        shell.add_process("parse.structure".to_string(), 
            Some("Identify main components and organization".to_string()));
        shell.add_process("parse.patterns".to_string(), 
            Some("Recognize design patterns and conventions".to_string()));
        shell.add_process("parse.flow".to_string(), 
            Some("Trace execution and data flow paths".to_string()));
        shell.add_process("evaluate.quality".to_string(), 
            Some("Assess code quality and best practices".to_string()));
        shell.add_process("evaluate.performance".to_string(), 
            Some("Identify potential performance issues".to_string()));
        shell.add_process("evaluate.security".to_string(), 
            Some("Spot potential security concerns".to_string()));
        shell.add_process("summarize.overview".to_string(), 
            Some("Create high-level summary".to_string()));
        
        shell.add_output("overview".to_string(), "string".to_string(), 
            Some("High-level summary of the code".to_string()));
        shell.add_output("details".to_string(), "object".to_string(), 
            Some("Component-by-component breakdown".to_string()));
        shell.add_output("recommendations".to_string(), "array".to_string(), 
            Some("Suggested improvements".to_string()));
        
        shell.set_meta("1.0.0".to_string(), Some("System".to_string()), 
            Some("Code analysis protocol for understanding and evaluating code".to_string()));
        shell.add_tag("code-analysis".to_string());
        shell.add_tag("quality".to_string());
        shell.add_tag("review".to_string());
        
        shell
    }
    
    #[wasm_bindgen(js_name = workflowTdd)]
    pub fn workflow_tdd() -> ProtocolShellV1 {
        let mut shell = ProtocolShellV1::new(
            "Implement changes using test-first methodology".to_string()
        );
        
        shell.add_input("feature".to_string(), "string".to_string(), 
            Some("Feature to implement".to_string()));
        shell.add_input("requirements".to_string(), "object".to_string(), 
            Some("Detailed requirements specification".to_string()));
        
        shell.add_process("write_tests.create".to_string(), 
            Some("Create comprehensive tests based on requirements".to_string()));
        shell.add_process("verify_tests.fail".to_string(), 
            Some("Run tests to confirm they fail appropriately".to_string()));
        shell.add_process("implement.code".to_string(), 
            Some("Write code to make tests pass".to_string()));
        shell.add_process("refactor.clean".to_string(), 
            Some("Clean up implementation while maintaining passing tests".to_string()));
        shell.add_process("finalize.commit".to_string(), 
            Some("Commit both tests and implementation".to_string()));
        
        shell.add_output("tests".to_string(), "array".to_string(), 
            Some("Comprehensive test suite".to_string()));
        shell.add_output("implementation".to_string(), "object".to_string(), 
            Some("Working code that passes tests".to_string()));
        shell.add_output("commit".to_string(), "object".to_string(), 
            Some("Commit message and PR details".to_string()));
        
        shell.set_meta("1.0.0".to_string(), Some("System".to_string()), 
            Some("Test-driven development workflow protocol".to_string()));
        shell.add_tag("tdd".to_string());
        shell.add_tag("testing".to_string());
        shell.add_tag("workflow".to_string());
        
        shell
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_protocol_shell_creation() {
        let shell = ProtocolShellV1::new("Test intent".to_string());
        assert_eq!(shell.intent, "Test intent");
        assert_eq!(shell.meta.version, "1.0.0");
    }
    
    #[test]
    fn test_protocol_validation() {
        let mut shell = ProtocolShellV1::new("Valid intent".to_string());
        
        // Should fail without process operations
        assert!(shell.validate().is_err());
        
        // Add valid process operation
        shell.add_process("test.operation".to_string(), Some("Test action".to_string()));
        
        // Should now pass validation
        assert!(shell.validate().is_ok());
    }
    
    #[test]
    fn test_pareto_lang_parsing() {
        let op_result = ProcessOperation::from_pareto_lang(
            "/test.operation{param1=\"value1\",param2=42}"
        );
        
        assert!(op_result.is_ok());
        let op = op_result.unwrap();
        assert_eq!(op.operation, "test.operation");
        assert!(op.parameters.is_some());
        
        let params = op.parameters.unwrap();
        assert_eq!(params.get("param1"), Some(&Value::String("value1".to_string())));
        assert_eq!(params.get("param2"), Some(&Value::Number(serde_json::Number::from(42))));
    }
    
    #[test]
    fn test_builder_pattern() {
        let shell = ProtocolShellBuilder::new("Test intent".to_string())
            .with_input("input1".to_string(), "string".to_string())
            .with_process("test.operation".to_string())
            .with_output("output1".to_string(), "object".to_string())
            .with_meta("1.0.0".to_string(), "Test Author".to_string())
            .build();
        
        assert_eq!(shell.intent, "Test intent");
        assert!(shell.input.contains_key("input1"));
        assert_eq!(shell.process.len(), 1);
        assert!(shell.output.contains_key("output1"));
        assert_eq!(shell.meta.author, Some("Test Author".to_string()));
    }
    
    #[test]
    fn test_json_serialization() {
        let shell = ProtocolTemplatesV1::reasoning_systematic();
        let json = shell.to_json();
        
        assert!(json.contains("\"intent\""));
        assert!(json.contains("\"input\""));
        assert!(json.contains("\"process\""));
        assert!(json.contains("\"output\""));
        assert!(json.contains("\"meta\""));
        
        // Test deserialization
        let deserialized = ProtocolShellV1::from_json(&json);
        assert!(deserialized.is_ok());
    }
}