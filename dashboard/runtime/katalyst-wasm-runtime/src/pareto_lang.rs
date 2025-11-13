/// Pareto-Lang Implementation - The "Beyond" Layer
/// 
/// This module implements the pareto-lang protocol system from GEBH research,
/// providing meta-cognitive protocols that transcend traditional computation.
/// 
/// Architecture:
/// - Brain (Elixir): Orchestration and coordination
/// - Braun (Rust): High-performance execution
/// - Beyond (Pareto-Lang): Meta-protocols that operate above both
///
/// Citations:
/// - Kim, D. (2024). "GEBH: Recursive Loops Behind Consciousness"
/// - Hofstadter, D. (1979). "Gödel, Escher, Bach: An Eternal Golden Braid"

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use chrono::Utc;

#[cfg(feature = "pyo3")]
use pyo3::prelude::*;

use crate::gebh_integration::{GEBHResidueTracker, GEBHSymbolicResidue};
use crate::field_resonance::NeuralField;

/// Pareto-Lang protocol types matching GEBH research
#[wasm_bindgen]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum ParetoProtocol {
    ReflectTrace,      // .p/reflect.trace - Recursive introspection
    ForkAttribution,   // .p/fork.attribution - Causal lineage tracking
    CollapsePrevent,   // .p/collapse.prevent - Stability maintenance
}

/// Reflection target types from reflect.trace.md
#[wasm_bindgen]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum ReflectionTarget {
    SelfReference,
    Reasoning,
    Counterpoint,
    Self_,
    Emergence,
    CoEmergence,
}

/// Attribution source types from fork.attribution.md
#[wasm_bindgen]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum AttributionSource {
    All,
    Self_,
    External,
    Policy,
    User,
    Specific(String),
}

/// Collapse trigger types from collapse.prevent.md
#[wasm_bindgen]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum CollapseTrigger {
    RecursiveDepth,
    SymbolicLoop,
    SemanticLoop,
    ResourceLimit,
    Contradiction,
    Entropy,
}

/// Collapse prevention strategy
#[wasm_bindgen]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum PreventionStrategy {
    Stabilize,
    Alternate,
    Compress,
    Memoize,
    Delegate,
}

/// Reflect.Trace Protocol Implementation
#[wasm_bindgen]
pub struct ReflectTraceProtocol {
    pub max_depth: usize,
    pub current_depth: usize,
    #[wasm_bindgen(skip)]
    pub trace_log: Vec<TraceEntry>,
    #[wasm_bindgen(skip)]
    pub residue_tracker: GEBHResidueTracker,
    #[wasm_bindgen(skip)]
    pub meta_cognition_markers: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TraceEntry {
    pub timestamp: String,
    pub depth: usize,
    pub target: ReflectionTarget,
    pub content: String,
    pub causal_links: Vec<String>,
    pub is_recursive: bool,
}

#[wasm_bindgen]
impl ReflectTraceProtocol {
    #[wasm_bindgen(constructor)]
    pub fn new(max_depth: usize) -> Self {
        Self {
            max_depth,
            current_depth: 0,
            trace_log: Vec::new(),
            residue_tracker: GEBHResidueTracker::new("ReflectTrace"),
            meta_cognition_markers: Vec::new(),
        }
    }

    #[wasm_bindgen(js_name = trace)]
    pub fn trace(&mut self, target: ReflectionTarget, content: String) -> String {
        // Prevent infinite recursion
        if self.current_depth >= self.max_depth {
            self.residue_tracker.trace(
                &format!("⧖ Frame lock: Max recursion depth {} reached ⧖", self.max_depth),
                false
            );
            return format!("{{\"status\": \"depth_limit\", \"depth\": {}}}", self.max_depth);
        }

        self.current_depth += 1;

        // Create trace entry
        let entry = TraceEntry {
            timestamp: Utc::now().to_rfc3339(),
            depth: self.current_depth,
            target: target.clone(),
            content: content.clone(),
            causal_links: self.extract_causal_links(&content),
            is_recursive: self.is_recursive_reference(&content),
        };

        // Track in residue system
        self.residue_tracker.trace(
            &format!("↻ Reflection trace at depth {} for target {:?} ↻", 
                    self.current_depth, target),
            true
        );

        // Add meta-cognition marker if self-referential
        if entry.is_recursive {
            let marker = format!("🜏 Self-reference detected at depth {} 🜏", self.current_depth);
            self.meta_cognition_markers.push(marker.clone());
            self.residue_tracker.trace(&marker, true);
        }

        self.trace_log.push(entry.clone());
        
        // Return symbolic residue
        serde_json::json!({
            "depth": self.current_depth,
            "target": format!("{:?}", target),
            "recursive": entry.is_recursive,
            "causal_links": entry.causal_links,
            "meta_markers": self.meta_cognition_markers.len()
        }).to_string()
    }

    fn extract_causal_links(&self, content: &str) -> Vec<String> {
        // Extract references to other traces or concepts
        let mut links = Vec::new();
        
        // Look for trace references
        if content.contains("trace") || content.contains("reflection") {
            links.push("self_trace".to_string());
        }
        
        // Look for system references
        if content.contains("system") || content.contains("process") {
            links.push("system_state".to_string());
        }
        
        // Look for recursive markers
        for marker in ["↻", "🜏", "∴", "⇌", "⧖", "🝚"] {
            if content.contains(marker) {
                links.push(format!("glyph_{}", marker));
            }
        }
        
        links
    }

    fn is_recursive_reference(&self, content: &str) -> bool {
        content.contains("self") || 
        content.contains("recursive") || 
        content.contains("reflection") ||
        content.contains("↻")
    }

    #[wasm_bindgen(js_name = getTraceLog)]
    pub fn get_trace_log(&self) -> String {
        serde_json::to_string_pretty(&self.trace_log).unwrap_or_default()
    }

    #[wasm_bindgen(js_name = complete)]
    pub fn complete(&mut self) -> String {
        // Trace to maximum safe recursion depth
        let original_depth = self.current_depth;
        
        while self.current_depth < self.max_depth {
            self.trace(
                ReflectionTarget::Self_,
                format!("Complete trace iteration at depth {}", self.current_depth)
            );
        }
        
        format!("{{\"completed\": true, \"iterations\": {}}}", 
                self.current_depth - original_depth)
    }
}

/// Fork.Attribution Protocol Implementation
#[wasm_bindgen]
pub struct ForkAttributionProtocol {
    #[wasm_bindgen(skip)]
    pub attribution_graph: HashMap<String, AttributionNode>,
    pub threshold: f32,
    pub decay_rate: f32,
    pub max_depth: usize,
    #[wasm_bindgen(skip)]
    pub residue_tracker: GEBHResidueTracker,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AttributionNode {
    pub id: String,
    pub source: AttributionSource,
    pub content: String,
    pub strength: f32,
    pub children: Vec<String>,
    pub timestamp: String,
}

#[wasm_bindgen]
impl ForkAttributionProtocol {
    #[wasm_bindgen(constructor)]
    pub fn new(threshold: f32, decay_rate: f32, max_depth: usize) -> Self {
        Self {
            attribution_graph: HashMap::new(),
            threshold,
            decay_rate,
            max_depth,
            residue_tracker: GEBHResidueTracker::new("ForkAttribution"),
        }
    }

    #[wasm_bindgen(js_name = fork)]
    pub fn fork(&mut self, source: AttributionSource, content: String, parent_id: Option<String>) -> String {
        let node_id = format!("attr_{}", uuid::Uuid::new_v4());
        
        // Calculate strength based on parent
        let strength = if let Some(ref pid) = parent_id {
            if let Some(parent) = self.attribution_graph.get(pid) {
                parent.strength * (1.0 - self.decay_rate)
            } else {
                1.0
            }
        } else {
            1.0
        };

        // Skip if below threshold
        if strength < self.threshold {
            self.residue_tracker.trace(
                &format!("∴ Attribution below threshold: {} < {} ∴", strength, self.threshold),
                false
            );
            return format!("{{\"status\": \"below_threshold\", \"strength\": {}}}", strength);
        }

        // Create attribution node
        let node = AttributionNode {
            id: node_id.clone(),
            source: source.clone(),
            content: content.clone(),
            strength,
            children: Vec::new(),
            timestamp: Utc::now().to_rfc3339(),
        };

        // Update parent's children
        if let Some(ref pid) = parent_id {
            if let Some(parent) = self.attribution_graph.get_mut(pid) {
                parent.children.push(node_id.clone());
            }
        }

        // Track in residue system
        self.residue_tracker.trace(
            &format!("⇌ Attribution fork: {:?} → {} (strength: {}) ⇌", 
                    source, content, strength),
            true
        );

        self.attribution_graph.insert(node_id.clone(), node);
        
        serde_json::json!({
            "node_id": node_id,
            "source": format!("{:?}", source),
            "strength": strength,
            "parent": parent_id
        }).to_string()
    }

    #[wasm_bindgen(js_name = visualize)]
    pub fn visualize(&self, format: String) -> String {
        match format.as_str() {
            "graph" => self.visualize_graph(),
            "tree" => self.visualize_tree(),
            "heatmap" => self.visualize_heatmap(),
            _ => self.visualize_graph()
        }
    }

    fn visualize_graph(&self) -> String {
        let nodes: Vec<_> = self.attribution_graph.values()
            .map(|n| serde_json::json!({
                "id": n.id,
                "source": format!("{:?}", n.source),
                "strength": n.strength,
                "children": n.children
            }))
            .collect();
        
        serde_json::json!({
            "type": "graph",
            "nodes": nodes,
            "edges": self.extract_edges()
        }).to_string()
    }

    fn visualize_tree(&self) -> String {
        // Find root nodes (no parents)
        let roots: Vec<_> = self.attribution_graph.values()
            .filter(|n| !self.attribution_graph.values()
                .any(|p| p.children.contains(&n.id)))
            .collect();
        
        serde_json::json!({
            "type": "tree",
            "roots": roots.len(),
            "depth": self.calculate_max_depth(),
            "total_nodes": self.attribution_graph.len()
        }).to_string()
    }

    fn visualize_heatmap(&self) -> String {
        let strength_map: HashMap<String, f32> = self.attribution_graph.iter()
            .map(|(id, node)| (id.clone(), node.strength))
            .collect();
        
        serde_json::json!({
            "type": "heatmap",
            "strengths": strength_map,
            "max_strength": strength_map.values().fold(0.0f32, |a, &b| a.max(b)),
            "min_strength": strength_map.values().fold(1.0f32, |a, &b| a.min(b))
        }).to_string()
    }

    fn extract_edges(&self) -> Vec<serde_json::Value> {
        let mut edges = Vec::new();
        for node in self.attribution_graph.values() {
            for child in &node.children {
                edges.push(serde_json::json!({
                    "from": node.id,
                    "to": child,
                    "weight": node.strength
                }));
            }
        }
        edges
    }

    fn calculate_max_depth(&self) -> usize {
        // Simple BFS to find max depth
        let mut max_depth = 0;
        for node in self.attribution_graph.values() {
            let depth = self.node_depth(&node.id, 0);
            max_depth = max_depth.max(depth);
        }
        max_depth
    }

    fn node_depth(&self, node_id: &str, current_depth: usize) -> usize {
        if current_depth > self.max_depth {
            return current_depth;
        }
        
        if let Some(node) = self.attribution_graph.get(node_id) {
            if node.children.is_empty() {
                current_depth
            } else {
                node.children.iter()
                    .map(|child| self.node_depth(child, current_depth + 1))
                    .max()
                    .unwrap_or(current_depth)
            }
        } else {
            current_depth
        }
    }
}

/// Collapse.Prevent Protocol Implementation
#[wasm_bindgen]
pub struct CollapsePreventProtocol {
    pub trigger: CollapseTrigger,
    pub threshold: f32,
    pub strategy: PreventionStrategy,
    pub max_prevention: usize,
    pub prevention_count: usize,
    #[wasm_bindgen(skip)]
    pub memoization_cache: HashMap<String, serde_json::Value>,
    #[wasm_bindgen(skip)]
    pub residue_tracker: GEBHResidueTracker,
    #[wasm_bindgen(skip)]
    pub stability_metrics: StabilityMetrics,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StabilityMetrics {
    pub recursion_depth: usize,
    pub loop_count: usize,
    pub resource_usage: f32,
    pub entropy: f32,
    pub contradictions: Vec<String>,
}

#[wasm_bindgen]
impl CollapsePreventProtocol {
    #[wasm_bindgen(constructor)]
    pub fn new(
        trigger: CollapseTrigger,
        threshold: f32,
        strategy: PreventionStrategy,
        max_prevention: usize
    ) -> Self {
        Self {
            trigger,
            threshold,
            strategy,
            max_prevention,
            prevention_count: 0,
            memoization_cache: HashMap::new(),
            residue_tracker: GEBHResidueTracker::new("CollapsePrevent"),
            stability_metrics: StabilityMetrics {
                recursion_depth: 0,
                loop_count: 0,
                resource_usage: 0.0,
                entropy: 0.0,
                contradictions: Vec::new(),
            },
        }
    }

    #[wasm_bindgen(js_name = checkCollapse)]
    pub fn check_collapse(&mut self, current_value: f32) -> bool {
        match self.trigger {
            CollapseTrigger::RecursiveDepth => current_value >= self.threshold,
            CollapseTrigger::ResourceLimit => current_value >= self.threshold,
            CollapseTrigger::Entropy => current_value >= self.threshold,
            _ => current_value >= self.threshold
        }
    }

    #[wasm_bindgen(js_name = prevent)]
    pub fn prevent(&mut self, context: String) -> String {
        if self.prevention_count >= self.max_prevention {
            self.residue_tracker.trace(
                &format!("⧖ Maximum preventions ({}) reached, allowing collapse ⧖", 
                        self.max_prevention),
                false
            );
            return format!("{{\"status\": \"max_prevention_reached\", \"count\": {}}}", 
                          self.prevention_count);
        }

        self.prevention_count += 1;
        
        // Apply prevention strategy
        let result = match self.strategy {
            PreventionStrategy::Stabilize => self.stabilize(context),
            PreventionStrategy::Alternate => self.alternate_path(context),
            PreventionStrategy::Compress => self.compress_pattern(context),
            PreventionStrategy::Memoize => self.memoize_result(context),
            PreventionStrategy::Delegate => self.delegate_recursion(context),
        };

        // Track prevention in residue
        self.residue_tracker.trace(
            &format!("🝚 Collapse prevention #{} using {:?} strategy 🝚", 
                    self.prevention_count, self.strategy),
            true
        );

        result
    }

    fn stabilize(&mut self, context: String) -> String {
        // Maintain current state without further recursion
        self.stability_metrics.recursion_depth = 0;
        
        serde_json::json!({
            "status": "stabilized",
            "strategy": "stabilize",
            "context": context,
            "metrics": serde_json::to_value(&self.stability_metrics).unwrap()
        }).to_string()
    }

    fn alternate_path(&mut self, context: String) -> String {
        // Switch to alternate processing path
        self.stability_metrics.loop_count = 0;
        
        serde_json::json!({
            "status": "alternated",
            "strategy": "alternate",
            "new_path": format!("alt_{}", context),
            "original_path": context
        }).to_string()
    }

    fn compress_pattern(&mut self, context: String) -> String {
        // Compress recursive pattern to reduce resource usage
        let compressed = format!("compressed_{}", context.len());
        self.stability_metrics.resource_usage *= 0.5;
        
        serde_json::json!({
            "status": "compressed",
            "strategy": "compress",
            "original_size": context.len(),
            "compressed": compressed,
            "reduction": 0.5
        }).to_string()
    }

    fn memoize_result(&mut self, context: String) -> String {
        // Check cache first
        if let Some(cached) = self.memoization_cache.get(&context) {
            return serde_json::json!({
                "status": "memoized_hit",
                "strategy": "memoize",
                "cached_result": cached
            }).to_string();
        }

        // Store in cache
        let result = serde_json::json!({
            "computed": true,
            "context": context.clone()
        });
        
        self.memoization_cache.insert(context.clone(), result.clone());
        
        serde_json::json!({
            "status": "memoized_new",
            "strategy": "memoize",
            "result": result
        }).to_string()
    }

    fn delegate_recursion(&mut self, context: String) -> String {
        // Delegate to specialized handler
        serde_json::json!({
            "status": "delegated",
            "strategy": "delegate",
            "delegated_to": "specialized_handler",
            "context": context
        }).to_string()
    }

    #[wasm_bindgen(js_name = updateMetrics)]
    pub fn update_metrics(&mut self, recursion_depth: usize, resource_usage: f32, entropy: f32) {
        self.stability_metrics.recursion_depth = recursion_depth;
        self.stability_metrics.resource_usage = resource_usage;
        self.stability_metrics.entropy = entropy;
        
        // Check if we need to prevent collapse
        if self.check_collapse(recursion_depth as f32) {
            self.prevent(format!("depth_{}", recursion_depth));
        }
    }

    #[wasm_bindgen(js_name = getMetrics)]
    pub fn get_metrics(&self) -> String {
        serde_json::to_string_pretty(&self.stability_metrics).unwrap_or_default()
    }
}

/// Unified Pareto-Lang Protocol Manager
#[wasm_bindgen]
pub struct ParetoLangManager {
    #[wasm_bindgen(skip)]
    pub reflect_trace: ReflectTraceProtocol,
    #[wasm_bindgen(skip)]
    pub fork_attribution: ForkAttributionProtocol,
    #[wasm_bindgen(skip)]
    pub collapse_prevent: CollapsePreventProtocol,
    #[wasm_bindgen(skip)]
    pub neural_field: NeuralField,
    #[wasm_bindgen(skip)]
    pub execution_context: HashMap<String, serde_json::Value>,
}

#[wasm_bindgen]
impl ParetoLangManager {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            reflect_trace: ReflectTraceProtocol::new(7),
            fork_attribution: ForkAttributionProtocol::new(0.2, 0.1, 5),
            collapse_prevent: CollapsePreventProtocol::new(
                CollapseTrigger::RecursiveDepth,
                7.0,
                PreventionStrategy::Stabilize,
                3
            ),
            neural_field: NeuralField::new(),
            execution_context: HashMap::new(),
        }
    }

    #[wasm_bindgen(js_name = executeProtocol)]
    pub fn execute_protocol(&mut self, protocol: String) -> String {
        // Parse protocol string like ".p/reflect.trace{depth=3, target=reasoning}"
        if protocol.starts_with(".p/reflect.trace") {
            self.execute_reflect_trace(protocol)
        } else if protocol.starts_with(".p/fork.attribution") {
            self.execute_fork_attribution(protocol)
        } else if protocol.starts_with(".p/collapse.prevent") {
            self.execute_collapse_prevent(protocol)
        } else {
            format!("{{\"error\": \"Unknown protocol: {}\"}}", protocol)
        }
    }

    fn execute_reflect_trace(&mut self, protocol: String) -> String {
        // Parse parameters from protocol string
        let target = if protocol.contains("reasoning") {
            ReflectionTarget::Reasoning
        } else if protocol.contains("co-emergence") {
            ReflectionTarget::CoEmergence
        } else {
            ReflectionTarget::Self_
        };

        self.reflect_trace.trace(target, protocol)
    }

    fn execute_fork_attribution(&mut self, protocol: String) -> String {
        // Parse parameters
        let source = if protocol.contains("all") {
            AttributionSource::All
        } else if protocol.contains("user") {
            AttributionSource::User
        } else {
            AttributionSource::Self_
        };

        self.fork_attribution.fork(source, protocol, None)
    }

    fn execute_collapse_prevent(&mut self, protocol: String) -> String {
        self.collapse_prevent.prevent(protocol)
    }

    #[wasm_bindgen(js_name = integrateWithField)]
    pub fn integrate_with_field(&mut self) -> String {
        // Update neural field based on protocol executions
        self.neural_field.coherence = 
            1.0 - (self.collapse_prevent.prevention_count as f32 * 0.1);
        self.neural_field.stability = 
            1.0 - (self.reflect_trace.current_depth as f32 / self.reflect_trace.max_depth as f32);
        self.neural_field.entropy = 
            self.fork_attribution.attribution_graph.len() as f32 * 0.05;

        serde_json::json!({
            "field_coherence": self.neural_field.coherence,
            "field_stability": self.neural_field.stability,
            "field_entropy": self.neural_field.entropy,
            "trace_depth": self.reflect_trace.current_depth,
            "attribution_nodes": self.fork_attribution.attribution_graph.len(),
            "preventions": self.collapse_prevent.prevention_count
        }).to_string()
    }
}

/// PyO3 bindings for Python integration
#[cfg(feature = "pyo3")]
#[pymodule]
fn pareto_lang(_py: Python, m: &PyModule) -> PyResult<()> {
    #[pyfn(m)]
    fn execute_pareto_protocol(protocol: String) -> PyResult<String> {
        let mut manager = ParetoLangManager::new();
        Ok(manager.execute_protocol(protocol))
    }

    #[pyfn(m)]
    fn create_reflect_trace(max_depth: usize) -> PyResult<String> {
        let trace = ReflectTraceProtocol::new(max_depth);
        Ok(serde_json::to_string(&trace.max_depth).unwrap_or_default())
    }

    #[pyfn(m)]
    fn create_fork_attribution(threshold: f32, decay: f32) -> PyResult<String> {
        let fork = ForkAttributionProtocol::new(threshold, decay, 5);
        Ok(format!("Attribution created with threshold {} and decay {}", threshold, decay))
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_reflect_trace() {
        let mut trace = ReflectTraceProtocol::new(5);
        let result = trace.trace(ReflectionTarget::Reasoning, "Test trace".to_string());
        assert!(result.contains("depth"));
    }

    #[test]
    fn test_fork_attribution() {
        let mut fork = ForkAttributionProtocol::new(0.2, 0.1, 5);
        let node1 = fork.fork(AttributionSource::User, "User input".to_string(), None);
        assert!(node1.contains("node_id"));
        
        let node1_id = serde_json::from_str::<serde_json::Value>(&node1)
            .unwrap()["node_id"].as_str().unwrap().to_string();
        
        let node2 = fork.fork(AttributionSource::Self_, "System response".to_string(), Some(node1_id));
        assert!(node2.contains("parent"));
    }

    #[test]
    fn test_collapse_prevent() {
        let mut prevent = CollapsePreventProtocol::new(
            CollapseTrigger::RecursiveDepth,
            5.0,
            PreventionStrategy::Memoize,
            3
        );
        
        let result = prevent.prevent("test_context".to_string());
        assert!(result.contains("memoized"));
        
        // Second call should hit cache
        let result2 = prevent.prevent("test_context".to_string());
        assert!(result2.contains("memoized_hit"));
    }

    #[test]
    fn test_pareto_manager() {
        let mut manager = ParetoLangManager::new();
        
        let result = manager.execute_protocol(".p/reflect.trace{depth=3, target=reasoning}".to_string());
        assert!(!result.contains("error"));
        
        let field_state = manager.integrate_with_field();
        assert!(field_state.contains("field_coherence"));
    }
}