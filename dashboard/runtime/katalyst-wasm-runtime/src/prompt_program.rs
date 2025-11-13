/// Prompt Program Template for Structured AI Reasoning
/// 
/// This module provides a Rust implementation of prompt programs - structured
/// frameworks for guiding LLM reasoning through explicit, step-by-step instructions.
/// Optimized for WebAssembly deployment in the Katalyst framework.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use chrono::{DateTime, Utc};

#[cfg(feature = "pyo3")]
use pyo3::prelude::*;

/// Types of steps in a prompt program
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum StepType {
    Instruction,
    Condition,
    Loop,
    Variable,
    Function,
    Error,
    Branch,
    Parallel,
}

/// Execution status of a program or step
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum ExecutionStatus {
    Pending,
    Running,
    Completed,
    Failed,
    Skipped,
}

/// A single step in a prompt program
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProgramStep {
    pub id: String,
    pub content: String,
    pub step_type: StepType,
    pub status: ExecutionStatus,
    #[wasm_bindgen(skip)]
    pub metadata: HashMap<String, serde_json::Value>,
    #[wasm_bindgen(skip)]
    pub substeps: Vec<ProgramStep>,
    #[wasm_bindgen(skip)]
    pub result: Option<String>,
}

#[wasm_bindgen]
impl ProgramStep {
    #[wasm_bindgen(constructor)]
    pub fn new(content: String, step_type: StepType) -> Self {
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            content,
            step_type,
            status: ExecutionStatus::Pending,
            metadata: HashMap::new(),
            substeps: Vec::new(),
            result: None,
        }
    }

    #[wasm_bindgen(js_name = addSubstep)]
    pub fn add_substep(&mut self, content: String, step_type: StepType) -> String {
        let substep = ProgramStep::new(content, step_type);
        let id = substep.id.clone();
        self.substeps.push(substep);
        id
    }

    #[wasm_bindgen(js_name = setMetadata)]
    pub fn set_metadata(&mut self, key: String, value: String) {
        self.metadata.insert(key, serde_json::Value::String(value));
    }

    #[wasm_bindgen(js_name = setResult)]
    pub fn set_result(&mut self, result: String) {
        self.result = Some(result);
        self.status = ExecutionStatus::Completed;
    }

    #[wasm_bindgen(js_name = format)]
    pub fn format(&self, indent: usize) -> String {
        self.format_internal(indent)
    }

    fn format_internal(&self, indent: usize) -> String {
        let indent_str = "  ".repeat(indent);
        
        let header = match self.step_type {
            StepType::Instruction => format!("{}📝 {}", indent_str, self.content),
            StepType::Condition => {
                let condition = self.metadata.get("condition")
                    .and_then(|v| v.as_str())
                    .unwrap_or("condition");
                format!("{}❓ IF {}: {}", indent_str, condition, self.content)
            },
            StepType::Loop => {
                let variable = self.metadata.get("variable")
                    .and_then(|v| v.as_str())
                    .unwrap_or("item");
                let iterable = self.metadata.get("iterable")
                    .and_then(|v| v.as_str())
                    .unwrap_or("items");
                format!("{}🔄 FOR {} IN {}: {}", indent_str, variable, iterable, self.content)
            },
            StepType::Variable => {
                let name = self.metadata.get("name")
                    .and_then(|v| v.as_str())
                    .unwrap_or("var");
                format!("{}📦 SET {} = {}", indent_str, name, self.content)
            },
            StepType::Function => {
                let name = self.metadata.get("name")
                    .and_then(|v| v.as_str())
                    .unwrap_or("function");
                format!("{}🔧 CALL {}({})", indent_str, name, self.content)
            },
            StepType::Error => format!("{}⚠️ ERROR: {}", indent_str, self.content),
            StepType::Branch => format!("{}🌿 BRANCH: {}", indent_str, self.content),
            StepType::Parallel => format!("{}⚡ PARALLEL: {}", indent_str, self.content),
        };

        let status_icon = match self.status {
            ExecutionStatus::Pending => "⏳",
            ExecutionStatus::Running => "🔄",
            ExecutionStatus::Completed => "✅",
            ExecutionStatus::Failed => "❌",
            ExecutionStatus::Skipped => "⏭️",
        };

        let mut output = format!("{} {}", header, status_icon);

        if let Some(result) = &self.result {
            output.push_str(&format!("\n{}  → {}", indent_str, result));
        }

        for substep in &self.substeps {
            output.push_str(&format!("\n{}", substep.format_internal(indent + 1)));
        }

        output
    }
}

/// Variable storage for prompt programs
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VariableStore {
    #[wasm_bindgen(skip)]
    pub variables: HashMap<String, serde_json::Value>,
}

#[wasm_bindgen]
impl VariableStore {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            variables: HashMap::new(),
        }
    }

    #[wasm_bindgen(js_name = set)]
    pub fn set(&mut self, name: String, value: String) {
        self.variables.insert(name, serde_json::Value::String(value));
    }

    #[wasm_bindgen(js_name = get)]
    pub fn get(&self, name: &str) -> Option<String> {
        self.variables.get(name)
            .and_then(|v| v.as_str())
            .map(|s| s.to_string())
    }

    #[wasm_bindgen(js_name = toJson)]
    pub fn to_json(&self) -> String {
        serde_json::to_string(&self.variables).unwrap_or_default()
    }
}

/// Execution trace for debugging and analysis
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExecutionTrace {
    pub step_id: String,
    pub timestamp: String,
    pub status: ExecutionStatus,
    #[wasm_bindgen(skip)]
    pub input: Option<String>,
    #[wasm_bindgen(skip)]
    pub output: Option<String>,
    #[wasm_bindgen(skip)]
    pub error: Option<String>,
}

#[wasm_bindgen]
impl ExecutionTrace {
    #[wasm_bindgen(constructor)]
    pub fn new(step_id: String, status: ExecutionStatus) -> Self {
        Self {
            step_id,
            timestamp: Utc::now().to_rfc3339(),
            status,
            input: None,
            output: None,
            error: None,
        }
    }
}

/// Main prompt program structure
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PromptProgram {
    pub id: String,
    pub name: String,
    pub description: String,
    #[wasm_bindgen(skip)]
    pub steps: Vec<ProgramStep>,
    #[wasm_bindgen(skip)]
    pub variables: VariableStore,
    #[wasm_bindgen(skip)]
    pub execution_traces: Vec<ExecutionTrace>,
    pub current_step: usize,
    pub status: ExecutionStatus,
}

#[wasm_bindgen]
impl PromptProgram {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String, description: String) -> Self {
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            name,
            description,
            steps: Vec::new(),
            variables: VariableStore::new(),
            execution_traces: Vec::new(),
            current_step: 0,
            status: ExecutionStatus::Pending,
        }
    }

    /// Add an instruction step
    #[wasm_bindgen(js_name = addInstruction)]
    pub fn add_instruction(&mut self, content: String) -> String {
        let step = ProgramStep::new(content, StepType::Instruction);
        let id = step.id.clone();
        self.steps.push(step);
        id
    }

    /// Add a conditional step
    #[wasm_bindgen(js_name = addCondition)]
    pub fn add_condition(&mut self, condition: String, true_branch: String, false_branch: String) -> String {
        let mut step = ProgramStep::new(format!("Evaluate: {}", condition), StepType::Condition);
        step.set_metadata("condition".to_string(), condition);
        
        // Add true branch
        let mut true_step = ProgramStep::new(true_branch, StepType::Branch);
        true_step.set_metadata("branch".to_string(), "true".to_string());
        step.substeps.push(true_step);
        
        // Add false branch
        let mut false_step = ProgramStep::new(false_branch, StepType::Branch);
        false_step.set_metadata("branch".to_string(), "false".to_string());
        step.substeps.push(false_step);
        
        let id = step.id.clone();
        self.steps.push(step);
        id
    }

    /// Add a loop step
    #[wasm_bindgen(js_name = addLoop)]
    pub fn add_loop(&mut self, variable: String, iterable: String, body: String) -> String {
        let mut step = ProgramStep::new(format!("Iterate over {}", iterable), StepType::Loop);
        step.set_metadata("variable".to_string(), variable);
        step.set_metadata("iterable".to_string(), iterable);
        
        let body_step = ProgramStep::new(body, StepType::Instruction);
        step.substeps.push(body_step);
        
        let id = step.id.clone();
        self.steps.push(step);
        id
    }

    /// Add a variable assignment
    #[wasm_bindgen(js_name = addVariable)]
    pub fn add_variable(&mut self, name: String, value: String) -> String {
        let mut step = ProgramStep::new(value.clone(), StepType::Variable);
        step.set_metadata("name".to_string(), name.clone());
        
        let id = step.id.clone();
        self.steps.push(step);
        
        // Also set in variable store
        self.variables.set(name, value);
        
        id
    }

    /// Add a function call
    #[wasm_bindgen(js_name = addFunction)]
    pub fn add_function(&mut self, name: String, params: String) -> String {
        let mut step = ProgramStep::new(params.clone(), StepType::Function);
        step.set_metadata("name".to_string(), name);
        step.set_metadata("params".to_string(), params);
        
        let id = step.id.clone();
        self.steps.push(step);
        id
    }

    /// Add parallel execution steps
    #[wasm_bindgen(js_name = addParallel)]
    pub fn add_parallel(&mut self, description: String, tasks: Vec<String>) -> String {
        let mut step = ProgramStep::new(description, StepType::Parallel);
        
        for task in tasks {
            let task_step = ProgramStep::new(task, StepType::Instruction);
            step.substeps.push(task_step);
        }
        
        let id = step.id.clone();
        self.steps.push(step);
        id
    }

    /// Get the current step
    #[wasm_bindgen(js_name = getCurrentStep)]
    pub fn get_current_step(&self) -> Option<String> {
        self.steps.get(self.current_step)
            .map(|s| s.content.clone())
    }

    /// Advance to next step
    #[wasm_bindgen(js_name = nextStep)]
    pub fn next_step(&mut self) -> bool {
        if self.current_step < self.steps.len() - 1 {
            self.current_step += 1;
            true
        } else {
            false
        }
    }

    /// Mark current step as completed
    #[wasm_bindgen(js_name = completeCurrentStep)]
    pub fn complete_current_step(&mut self, result: String) {
        if let Some(step) = self.steps.get_mut(self.current_step) {
            step.set_result(result.clone());
            
            let trace = ExecutionTrace {
                step_id: step.id.clone(),
                timestamp: Utc::now().to_rfc3339(),
                status: ExecutionStatus::Completed,
                input: Some(step.content.clone()),
                output: Some(result),
                error: None,
            };
            self.execution_traces.push(trace);
        }
    }

    /// Format the entire program
    #[wasm_bindgen(js_name = format)]
    pub fn format(&self) -> String {
        let mut output = format!("🎯 Program: {}\n", self.name);
        output.push_str(&format!("📋 Description: {}\n", self.description));
        output.push_str(&format!("🔢 Status: {:?}\n", self.status));
        output.push_str(&format!("📍 Current Step: {}/{}\n\n", self.current_step + 1, self.steps.len()));
        
        output.push_str("📝 Steps:\n");
        for (i, step) in self.steps.iter().enumerate() {
            let current_marker = if i == self.current_step { "→ " } else { "  " };
            output.push_str(&format!("{}{:2}. {}\n", current_marker, i + 1, step.format(1)));
        }
        
        output
    }

    /// Export program as JSON
    #[wasm_bindgen(js_name = toJson)]
    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(&self).unwrap_or_default()
    }

    /// Import program from JSON
    #[wasm_bindgen(js_name = fromJson)]
    pub fn from_json(json: &str) -> Result<PromptProgram, JsValue> {
        serde_json::from_str(json)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }

    /// Get execution summary
    #[wasm_bindgen(js_name = getExecutionSummary)]
    pub fn get_execution_summary(&self) -> String {
        let completed = self.steps.iter()
            .filter(|s| s.status == ExecutionStatus::Completed)
            .count();
        let failed = self.steps.iter()
            .filter(|s| s.status == ExecutionStatus::Failed)
            .count();
        let pending = self.steps.iter()
            .filter(|s| s.status == ExecutionStatus::Pending)
            .count();
        
        format!(
            "Execution Summary: {} completed, {} failed, {} pending (Total: {})",
            completed, failed, pending, self.steps.len()
        )
    }
}

/// Program builder for fluent API
#[wasm_bindgen]
pub struct ProgramBuilder {
    program: PromptProgram,
}

#[wasm_bindgen]
impl ProgramBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String) -> Self {
        Self {
            program: PromptProgram::new(name, String::new()),
        }
    }

    #[wasm_bindgen(js_name = withDescription)]
    pub fn with_description(mut self, description: String) -> Self {
        self.program.description = description;
        self
    }

    #[wasm_bindgen(js_name = step)]
    pub fn step(mut self, content: String) -> Self {
        self.program.add_instruction(content);
        self
    }

    #[wasm_bindgen(js_name = condition)]
    pub fn condition(mut self, condition: String, true_branch: String, false_branch: String) -> Self {
        self.program.add_condition(condition, true_branch, false_branch);
        self
    }

    #[wasm_bindgen(js_name = loop_)]
    pub fn loop_(mut self, variable: String, iterable: String, body: String) -> Self {
        self.program.add_loop(variable, iterable, body);
        self
    }

    #[wasm_bindgen(js_name = parallel)]
    pub fn parallel(mut self, description: String, tasks: Vec<String>) -> Self {
        self.program.add_parallel(description, tasks);
        self
    }

    #[wasm_bindgen(js_name = build)]
    pub fn build(self) -> PromptProgram {
        self.program
    }
}

/// Template library for common prompt programs
#[wasm_bindgen]
pub struct ProgramTemplates;

#[wasm_bindgen]
impl ProgramTemplates {
    /// Create a problem-solving template
    #[wasm_bindgen(js_name = problemSolving)]
    pub fn problem_solving() -> PromptProgram {
        let mut program = PromptProgram::new(
            "Problem Solving".to_string(),
            "Systematic approach to solving complex problems".to_string()
        );
        
        program.add_instruction("Understand and restate the problem clearly".to_string());
        program.add_instruction("Identify constraints and requirements".to_string());
        program.add_instruction("Break down the problem into smaller components".to_string());
        program.add_instruction("Generate multiple solution approaches".to_string());
        program.add_instruction("Evaluate trade-offs of each approach".to_string());
        program.add_instruction("Select and implement the best solution".to_string());
        program.add_instruction("Verify the solution meets all requirements".to_string());
        
        program
    }

    /// Create a code review template
    #[wasm_bindgen(js_name = codeReview)]
    pub fn code_review() -> PromptProgram {
        let mut program = PromptProgram::new(
            "Code Review".to_string(),
            "Comprehensive code review process".to_string()
        );
        
        program.add_instruction("Check code functionality and correctness".to_string());
        program.add_instruction("Review code style and conventions".to_string());
        program.add_instruction("Identify potential bugs and edge cases".to_string());
        program.add_instruction("Assess performance implications".to_string());
        program.add_instruction("Check security vulnerabilities".to_string());
        program.add_instruction("Evaluate test coverage".to_string());
        program.add_instruction("Suggest improvements and optimizations".to_string());
        
        program
    }

    /// Create a research template
    #[wasm_bindgen(js_name = research)]
    pub fn research() -> PromptProgram {
        let mut program = PromptProgram::new(
            "Research".to_string(),
            "Structured research and analysis".to_string()
        );
        
        program.add_instruction("Define research questions and objectives".to_string());
        program.add_instruction("Identify and gather relevant sources".to_string());
        program.add_instruction("Analyze and synthesize information".to_string());
        program.add_instruction("Identify patterns and insights".to_string());
        program.add_instruction("Draw conclusions based on evidence".to_string());
        program.add_instruction("Document findings and recommendations".to_string());
        
        program
    }
}

// PyO3 bindings for Python interop
#[cfg(feature = "pyo3")]
#[pymodule]
fn prompt_program(_py: Python, m: &PyModule) -> PyResult<()> {
    #[pyfn(m)]
    fn create_program(name: String, description: String) -> PyResult<String> {
        let program = PromptProgram::new(name, description);
        Ok(program.to_json())
    }

    #[pyfn(m)]
    fn add_step_to_program(program_json: String, content: String) -> PyResult<String> {
        let mut program: PromptProgram = serde_json::from_str(&program_json)
            .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        
        program.add_instruction(content);
        Ok(program.to_json())
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_program_creation() {
        let mut program = PromptProgram::new(
            "Test Program".to_string(),
            "A test program".to_string()
        );
        
        program.add_instruction("Step 1".to_string());
        program.add_instruction("Step 2".to_string());
        
        assert_eq!(program.steps.len(), 2);
        assert_eq!(program.current_step, 0);
    }

    #[test]
    fn test_program_execution() {
        let mut program = PromptProgram::new(
            "Test Execution".to_string(),
            "Test execution flow".to_string()
        );
        
        program.add_instruction("First step".to_string());
        program.add_instruction("Second step".to_string());
        
        assert_eq!(program.get_current_step(), Some("First step".to_string()));
        
        program.complete_current_step("Done".to_string());
        program.next_step();
        
        assert_eq!(program.get_current_step(), Some("Second step".to_string()));
    }

    #[test]
    fn test_builder_pattern() {
        let program = ProgramBuilder::new("Builder Test".to_string())
            .with_description("Testing builder pattern".to_string())
            .step("Step 1".to_string())
            .step("Step 2".to_string())
            .condition(
                "value > 10".to_string(),
                "Process large value".to_string(),
                "Process small value".to_string()
            )
            .build();
        
        assert_eq!(program.steps.len(), 3);
    }
}