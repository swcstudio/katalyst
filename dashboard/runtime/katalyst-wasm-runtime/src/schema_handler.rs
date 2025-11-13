/// Schema Handler for Context Engineering
/// 
/// This module provides comprehensive schema validation, parsing, and management
/// for Context Engineering templates and configurations.

use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[cfg(feature = "pyo3")]
use pyo3::prelude::*;

/// Schema validation result
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationResult {
    pub is_valid: bool,
    pub errors: Vec<String>,
    pub warnings: Vec<String>,
}

#[wasm_bindgen]
impl ValidationResult {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            is_valid: true,
            errors: Vec::new(),
            warnings: Vec::new(),
        }
    }

    #[wasm_bindgen(js_name = addError)]
    pub fn add_error(&mut self, error: String) {
        self.errors.push(error);
        self.is_valid = false;
    }

    #[wasm_bindgen(js_name = addWarning)]
    pub fn add_warning(&mut self, warning: String) {
        self.warnings.push(warning);
    }

    #[wasm_bindgen(js_name = toJson)]
    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(&self).unwrap_or_default()
    }
}

/// Context Engineering Schema Structure
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContextSchema {
    pub schema_version: String,
    #[wasm_bindgen(skip)]
    pub metadata: SchemaMetadata,
    #[wasm_bindgen(skip)]
    pub system_context: SystemContext,
    #[wasm_bindgen(skip)]
    pub domain_knowledge: Option<DomainKnowledge>,
    #[wasm_bindgen(skip)]
    pub user_context: Option<UserContext>,
    #[wasm_bindgen(skip)]
    pub task_context: TaskContext,
    #[wasm_bindgen(skip)]
    pub neural_field_context: Option<NeuralFieldContext>,
    #[wasm_bindgen(skip)]
    pub protocol_shell: Option<ProtocolShellConfig>,
    #[wasm_bindgen(skip)]
    pub response_guidelines: ResponseGuidelines,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SchemaMetadata {
    pub name: String,
    pub description: String,
    pub author: String,
    pub created: String,
    pub updated: String,
    pub license: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemContext {
    pub role: String,
    pub objective: String,
    pub constraints: Vec<String>,
    pub style: StyleConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StyleConfig {
    pub tone: String,
    pub formality: String,
    pub verbosity: String,
    pub structure: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DomainKnowledge {
    pub name: String,
    pub concepts: Vec<Concept>,
    pub facts: Vec<String>,
    pub resources: Vec<Resource>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Concept {
    pub name: String,
    pub description: String,
    pub examples: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Resource {
    pub name: String,
    pub description: String,
    pub url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserContext {
    pub profile: UserProfile,
    pub context: UserContextDetails,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfile {
    pub expertise: String,
    pub background: String,
    pub preferences: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserContextDetails {
    pub goals: Vec<String>,
    pub constraints: Vec<String>,
    pub prior_knowledge: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskContext {
    #[serde(rename = "type")]
    pub task_type: String,
    pub topic: String,
    pub requirements: TaskRequirements,
    pub success_criteria: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskRequirements {
    pub format: String,
    pub length: String,
    pub detail_level: String,
    pub included_elements: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NeuralFieldContext {
    pub attractors: Vec<AttractorConfig>,
    pub metrics: FieldMetrics,
    pub residue: Vec<ResidueConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AttractorConfig {
    pub pattern: String,
    pub strength: f32,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldMetrics {
    pub stability: f32,
    pub coherence: f32,
    pub resonance: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResidueConfig {
    pub content: String,
    pub state: String,
    pub strength: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProtocolShellConfig {
    pub intent: String,
    pub process: Vec<ProcessStep>,
    pub output: OutputConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessStep {
    pub name: String,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutputConfig {
    pub summary: String,
    pub main_content: String,
    pub next_steps: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResponseGuidelines {
    pub goals: Vec<String>,
    pub structure: StructureConfig,
    pub format: FormatConfig,
    pub tone: ToneConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StructureConfig {
    pub introduction: bool,
    pub main_content: bool,
    pub examples: bool,
    pub conclusion: bool,
    pub next_steps: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FormatConfig {
    pub sections: bool,
    pub bullet_points: String,
    pub tables: String,
    pub code_blocks: String,
    pub markdown: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToneConfig {
    pub formality: String,
    pub technicality: String,
    pub warmth: String,
}

#[wasm_bindgen]
impl ContextSchema {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            schema_version: "1.0.0".to_string(),
            metadata: SchemaMetadata {
                name: "default".to_string(),
                description: "Default context schema".to_string(),
                author: "System".to_string(),
                created: chrono::Utc::now().to_rfc3339(),
                updated: chrono::Utc::now().to_rfc3339(),
                license: "MIT".to_string(),
            },
            system_context: SystemContext {
                role: "Assistant".to_string(),
                objective: "Provide helpful information".to_string(),
                constraints: Vec::new(),
                style: StyleConfig {
                    tone: "friendly".to_string(),
                    formality: "professional".to_string(),
                    verbosity: "concise".to_string(),
                    structure: "organized".to_string(),
                },
            },
            domain_knowledge: None,
            user_context: None,
            task_context: TaskContext {
                task_type: "general".to_string(),
                topic: "unspecified".to_string(),
                requirements: TaskRequirements {
                    format: "text".to_string(),
                    length: "medium".to_string(),
                    detail_level: "moderate".to_string(),
                    included_elements: Vec::new(),
                },
                success_criteria: Vec::new(),
            },
            neural_field_context: None,
            protocol_shell: None,
            response_guidelines: ResponseGuidelines {
                goals: Vec::new(),
                structure: StructureConfig {
                    introduction: true,
                    main_content: true,
                    examples: false,
                    conclusion: true,
                    next_steps: false,
                },
                format: FormatConfig {
                    sections: true,
                    bullet_points: "where appropriate".to_string(),
                    tables: "for data".to_string(),
                    code_blocks: "for code".to_string(),
                    markdown: true,
                },
                tone: ToneConfig {
                    formality: "professional".to_string(),
                    technicality: "moderate".to_string(),
                    warmth: "friendly".to_string(),
                },
            },
        }
    }

    #[wasm_bindgen(js_name = fromJson)]
    pub fn from_json(json: &str) -> Result<ContextSchema, JsValue> {
        serde_json::from_str(json)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }

    #[wasm_bindgen(js_name = toJson)]
    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(&self).unwrap_or_default()
    }

    #[wasm_bindgen(js_name = validate)]
    pub fn validate(&self) -> ValidationResult {
        let mut result = ValidationResult::new();
        
        // Validate schema version
        if self.schema_version.is_empty() {
            result.add_error("Schema version is required".to_string());
        }
        
        // Validate system context
        if self.system_context.role.is_empty() {
            result.add_error("System role is required".to_string());
        }
        
        if self.system_context.objective.is_empty() {
            result.add_error("System objective is required".to_string());
        }
        
        // Validate task context
        if self.task_context.task_type.is_empty() {
            result.add_error("Task type is required".to_string());
        }
        
        // Validate neural field context if present
        if let Some(ref nf_context) = self.neural_field_context {
            for attractor in &nf_context.attractors {
                if attractor.strength < 0.0 || attractor.strength > 1.0 {
                    result.add_warning(format!(
                        "Attractor strength {} is out of range [0, 1]",
                        attractor.strength
                    ));
                }
            }
        }
        
        result
    }

    #[wasm_bindgen(js_name = merge)]
    pub fn merge(&mut self, other_json: &str) -> Result<(), JsValue> {
        let other: Value = serde_json::from_str(other_json)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        
        // Merge logic - update fields that are present in other
        if let Some(obj) = other.as_object() {
            // This is simplified - in production, you'd do deep merging
            let mut current = serde_json::to_value(&self)
                .map_err(|e| JsValue::from_str(&e.to_string()))?;
            
            if let Some(current_obj) = current.as_object_mut() {
                for (key, value) in obj {
                    current_obj.insert(key.clone(), value.clone());
                }
            }
            
            *self = serde_json::from_value(current)
                .map_err(|e| JsValue::from_str(&e.to_string()))?;
        }
        
        Ok(())
    }
}

/// Schema validator for validating JSON against schemas
#[wasm_bindgen]
pub struct SchemaValidator {
    #[wasm_bindgen(skip)]
    schemas: HashMap<String, Value>,
}

#[wasm_bindgen]
impl SchemaValidator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            schemas: HashMap::new(),
        }
    }

    #[wasm_bindgen(js_name = addSchema)]
    pub fn add_schema(&mut self, name: String, schema_json: String) -> Result<(), JsValue> {
        let schema: Value = serde_json::from_str(&schema_json)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        
        self.schemas.insert(name, schema);
        Ok(())
    }

    #[wasm_bindgen(js_name = validateAgainstSchema)]
    pub fn validate_against_schema(
        &self,
        schema_name: &str,
        data_json: &str
    ) -> ValidationResult {
        let mut result = ValidationResult::new();
        
        // Get schema
        let schema = match self.schemas.get(schema_name) {
            Some(s) => s,
            None => {
                result.add_error(format!("Schema '{}' not found", schema_name));
                return result;
            }
        };
        
        // Parse data
        let data: Value = match serde_json::from_str(data_json) {
            Ok(d) => d,
            Err(e) => {
                result.add_error(format!("Invalid JSON data: {}", e));
                return result;
            }
        };
        
        // Simple validation - check required fields
        if let Some(required) = schema.get("required").and_then(|r| r.as_array()) {
            if let Some(data_obj) = data.as_object() {
                for req_field in required {
                    if let Some(field_name) = req_field.as_str() {
                        if !data_obj.contains_key(field_name) {
                            result.add_error(format!("Required field '{}' is missing", field_name));
                        }
                    }
                }
            }
        }
        
        result
    }

    #[wasm_bindgen(js_name = listSchemas)]
    pub fn list_schemas(&self) -> Vec<String> {
        self.schemas.keys().cloned().collect()
    }
}

/// Schema builder for creating schemas programmatically
#[wasm_bindgen]
pub struct SchemaBuilder {
    schema: ContextSchema,
}

#[wasm_bindgen]
impl SchemaBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            schema: ContextSchema::new(),
        }
    }

    #[wasm_bindgen(js_name = withMetadata)]
    pub fn with_metadata(mut self, name: String, description: String, author: String) -> Self {
        self.schema.metadata.name = name;
        self.schema.metadata.description = description;
        self.schema.metadata.author = author;
        self
    }

    #[wasm_bindgen(js_name = withSystemContext)]
    pub fn with_system_context(mut self, role: String, objective: String) -> Self {
        self.schema.system_context.role = role;
        self.schema.system_context.objective = objective;
        self
    }

    #[wasm_bindgen(js_name = withTaskContext)]
    pub fn with_task_context(mut self, task_type: String, topic: String) -> Self {
        self.schema.task_context.task_type = task_type;
        self.schema.task_context.topic = topic;
        self
    }

    #[wasm_bindgen(js_name = addConstraint)]
    pub fn add_constraint(mut self, constraint: String) -> Self {
        self.schema.system_context.constraints.push(constraint);
        self
    }

    #[wasm_bindgen(js_name = addSuccessCriterion)]
    pub fn add_success_criterion(mut self, criterion: String) -> Self {
        self.schema.task_context.success_criteria.push(criterion);
        self
    }

    #[wasm_bindgen(js_name = build)]
    pub fn build(self) -> ContextSchema {
        self.schema
    }
}

/// Pre-built schema templates
#[wasm_bindgen]
pub struct SchemaTemplates;

#[wasm_bindgen]
impl SchemaTemplates {
    #[wasm_bindgen(js_name = codeReview)]
    pub fn code_review() -> ContextSchema {
        SchemaBuilder::new()
            .with_metadata(
                "code_review_schema".to_string(),
                "Schema for code review context".to_string(),
                "System".to_string()
            )
            .with_system_context(
                "Code Reviewer".to_string(),
                "Review code for quality, bugs, and improvements".to_string()
            )
            .with_task_context(
                "code_review".to_string(),
                "Source code analysis".to_string()
            )
            .add_constraint("Focus on security vulnerabilities".to_string())
            .add_constraint("Check for performance issues".to_string())
            .add_success_criterion("All critical issues identified".to_string())
            .add_success_criterion("Improvement suggestions provided".to_string())
            .build()
    }

    #[wasm_bindgen(js_name = research)]
    pub fn research() -> ContextSchema {
        SchemaBuilder::new()
            .with_metadata(
                "research_schema".to_string(),
                "Schema for research context".to_string(),
                "System".to_string()
            )
            .with_system_context(
                "Research Assistant".to_string(),
                "Conduct thorough research and analysis".to_string()
            )
            .with_task_context(
                "research".to_string(),
                "Information gathering and synthesis".to_string()
            )
            .add_constraint("Use credible sources".to_string())
            .add_constraint("Provide citations".to_string())
            .add_success_criterion("Comprehensive coverage of topic".to_string())
            .add_success_criterion("Clear synthesis of findings".to_string())
            .build()
    }

    #[wasm_bindgen(js_name = creative)]
    pub fn creative() -> ContextSchema {
        SchemaBuilder::new()
            .with_metadata(
                "creative_schema".to_string(),
                "Schema for creative writing context".to_string(),
                "System".to_string()
            )
            .with_system_context(
                "Creative Writer".to_string(),
                "Generate creative and engaging content".to_string()
            )
            .with_task_context(
                "creative_writing".to_string(),
                "Creative content generation".to_string()
            )
            .add_constraint("Maintain consistent tone".to_string())
            .add_constraint("Ensure originality".to_string())
            .add_success_criterion("Engaging narrative".to_string())
            .add_success_criterion("Creative use of language".to_string())
            .build()
    }
}

// PyO3 bindings
#[cfg(feature = "pyo3")]
#[pymodule]
fn schema_handler(_py: Python, m: &PyModule) -> PyResult<()> {
    #[pyfn(m)]
    fn validate_schema(schema_json: String) -> PyResult<bool> {
        match ContextSchema::from_json(&schema_json) {
            Ok(schema) => {
                let result = schema.validate();
                Ok(result.is_valid)
            },
            Err(_) => Ok(false)
        }
    }

    #[pyfn(m)]
    fn create_schema_template(template_type: String) -> PyResult<String> {
        let schema = match template_type.as_str() {
            "code_review" => SchemaTemplates::code_review(),
            "research" => SchemaTemplates::research(),
            "creative" => SchemaTemplates::creative(),
            _ => ContextSchema::new()
        };
        Ok(schema.to_json())
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_schema_creation() {
        let schema = ContextSchema::new();
        assert_eq!(schema.schema_version, "1.0.0");
        assert_eq!(schema.system_context.role, "Assistant");
    }

    #[test]
    fn test_schema_validation() {
        let schema = ContextSchema::new();
        let result = schema.validate();
        assert!(result.is_valid);
    }

    #[test]
    fn test_schema_builder() {
        let schema = SchemaBuilder::new()
            .with_metadata("test".to_string(), "desc".to_string(), "author".to_string())
            .with_system_context("role".to_string(), "objective".to_string())
            .build();
        
        assert_eq!(schema.metadata.name, "test");
        assert_eq!(schema.system_context.role, "role");
    }

    #[test]
    fn test_validation_result() {
        let mut result = ValidationResult::new();
        assert!(result.is_valid);
        
        result.add_error("Test error".to_string());
        assert!(!result.is_valid);
        assert_eq!(result.errors.len(), 1);
    }
}