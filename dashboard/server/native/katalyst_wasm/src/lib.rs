use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::{from_value, to_value};

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    
    #[wasm_bindgen(js_namespace = Deno)]
    fn readTextFile(path: &str) -> js_sys::Promise;
    
    #[wasm_bindgen(js_namespace = Deno)]
    fn writeTextFile(path: &str, data: &str) -> js_sys::Promise;
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[derive(Serialize, Deserialize)]
pub struct KatalystMessage {
    pub id: String,
    pub timestamp: u64,
    pub payload: serde_json::Value,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize)]
pub struct ProcessingResult {
    pub success: bool,
    pub message: String,
    pub data: Option<serde_json::Value>,
    pub processing_time_ms: u64,
}

/// Initialize the WASM module
#[wasm_bindgen(start)]
pub fn init() {
    console_log!("Katalyst WASM module initialized for Deno runtime");
}

/// Process a message with high performance
#[wasm_bindgen]
pub fn process_message(message: JsValue) -> Result<JsValue, JsValue> {
    let start = web_sys::window()
        .and_then(|w| w.performance())
        .map(|p| p.now())
        .unwrap_or(0.0);
    
    let msg: KatalystMessage = from_value(message)
        .map_err(|e| JsValue::from_str(&format!("Deserialization error: {}", e)))?;
    
    console_log!("Processing message: {}", msg.id);
    
    // Perform processing
    let processed_data = transform_payload(&msg.payload);
    
    let end = web_sys::window()
        .and_then(|w| w.performance())
        .map(|p| p.now())
        .unwrap_or(0.0);
    
    let result = ProcessingResult {
        success: true,
        message: format!("Message {} processed successfully", msg.id),
        data: Some(processed_data),
        processing_time_ms: (end - start) as u64,
    };
    
    to_value(&result).map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

/// High-performance JSON transformation
#[wasm_bindgen]
pub fn transform_json(input: &str) -> Result<String, JsValue> {
    let value: serde_json::Value = serde_json::from_str(input)
        .map_err(|e| JsValue::from_str(&format!("JSON parse error: {}", e)))?;
    
    let transformed = transform_payload(&value);
    
    serde_json::to_string(&transformed)
        .map_err(|e| JsValue::from_str(&format!("JSON stringify error: {}", e)))
}

/// Vector operations for ML/AI workloads
#[wasm_bindgen]
pub fn dot_product(vec1: Vec<f32>, vec2: Vec<f32>) -> Result<f32, JsValue> {
    if vec1.len() != vec2.len() {
        return Err(JsValue::from_str("Vectors must have the same length"));
    }
    
    let result = vec1.iter()
        .zip(vec2.iter())
        .map(|(a, b)| a * b)
        .sum();
    
    Ok(result)
}

/// Cosine similarity for vector search
#[wasm_bindgen]
pub fn cosine_similarity(vec1: Vec<f32>, vec2: Vec<f32>) -> Result<f32, JsValue> {
    if vec1.len() != vec2.len() {
        return Err(JsValue::from_str("Vectors must have the same length"));
    }
    
    let dot = dot_product(vec1.clone(), vec2.clone())?;
    let mag1: f32 = vec1.iter().map(|x| x * x).sum::<f32>().sqrt();
    let mag2: f32 = vec2.iter().map(|x| x * x).sum::<f32>().sqrt();
    
    if mag1 == 0.0 || mag2 == 0.0 {
        return Ok(0.0);
    }
    
    Ok(dot / (mag1 * mag2))
}

/// Batch processing for multiple items
#[wasm_bindgen]
pub fn batch_process(items: JsValue) -> Result<JsValue, JsValue> {
    let items: Vec<serde_json::Value> = from_value(items)
        .map_err(|e| JsValue::from_str(&format!("Invalid input: {}", e)))?;
    
    let results: Vec<serde_json::Value> = items
        .into_iter()
        .map(|item| transform_payload(&item))
        .collect();
    
    to_value(&results).map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

/// Streaming data processor
#[wasm_bindgen]
pub struct StreamProcessor {
    buffer: Vec<u8>,
    processed_count: usize,
}

#[wasm_bindgen]
impl StreamProcessor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            buffer: Vec::new(),
            processed_count: 0,
        }
    }
    
    pub fn add_chunk(&mut self, chunk: Vec<u8>) {
        self.buffer.extend(chunk);
    }
    
    pub fn process(&mut self) -> Result<JsValue, JsValue> {
        // Process buffered data
        let data = std::mem::take(&mut self.buffer);
        self.processed_count += 1;
        
        let result = serde_json::json!({
            "processed": self.processed_count,
            "bytes": data.len(),
            "checksum": calculate_checksum(&data)
        });
        
        to_value(&result).map_err(|e| JsValue::from_str(&format!("Error: {}", e)))
    }
    
    pub fn get_stats(&self) -> Result<JsValue, JsValue> {
        let stats = serde_json::json!({
            "buffer_size": self.buffer.len(),
            "processed_count": self.processed_count
        });
        
        to_value(&stats).map_err(|e| JsValue::from_str(&format!("Error: {}", e)))
    }
}

/// Cryptographic operations
#[wasm_bindgen]
pub fn hash_data(data: &str) -> String {
    // Simple hash for demo - use proper crypto in production
    let mut hash = 5381u64;
    for byte in data.bytes() {
        hash = ((hash << 5).wrapping_add(hash)).wrapping_add(byte as u64);
    }
    format!("{:x}", hash)
}

/// Time-series data aggregation
#[wasm_bindgen]
pub fn aggregate_timeseries(data: JsValue, window_size: usize) -> Result<JsValue, JsValue> {
    let points: Vec<f64> = from_value(data)
        .map_err(|e| JsValue::from_str(&format!("Invalid data: {}", e)))?;
    
    let mut aggregated = Vec::new();
    
    for chunk in points.chunks(window_size) {
        let avg = chunk.iter().sum::<f64>() / chunk.len() as f64;
        let max = chunk.iter().fold(f64::NEG_INFINITY, |a, &b| a.max(b));
        let min = chunk.iter().fold(f64::INFINITY, |a, &b| a.min(b));
        
        aggregated.push(serde_json::json!({
            "avg": avg,
            "max": max,
            "min": min,
            "count": chunk.len()
        }));
    }
    
    to_value(&aggregated).map_err(|e| JsValue::from_str(&format!("Error: {}", e)))
}

// Helper functions

fn transform_payload(payload: &serde_json::Value) -> serde_json::Value {
    match payload {
        serde_json::Value::Object(map) => {
            let mut transformed = serde_json::Map::new();
            for (key, value) in map {
                transformed.insert(
                    format!("transformed_{}", key),
                    transform_payload(value)
                );
            }
            serde_json::Value::Object(transformed)
        }
        serde_json::Value::Array(arr) => {
            serde_json::Value::Array(
                arr.iter().map(transform_payload).collect()
            )
        }
        other => other.clone()
    }
}

fn calculate_checksum(data: &[u8]) -> u32 {
    data.iter().fold(0u32, |acc, &byte| {
        acc.wrapping_add(byte as u32)
    })
}

/// Export version information
#[wasm_bindgen]
pub fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// Memory statistics for monitoring
#[wasm_bindgen]
pub fn get_memory_stats() -> Result<JsValue, JsValue> {
    let stats = serde_json::json!({
        "wasm_memory_pages": wasm_bindgen::memory().buffer().byte_length() / 65536,
        "allocator": "wee_alloc"
    });
    
    to_value(&stats).map_err(|e| JsValue::from_str(&format!("Error: {}", e)))
}