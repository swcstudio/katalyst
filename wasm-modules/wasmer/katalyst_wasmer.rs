// Katalyst Wasmer Module  
// Rust interface for Wasmer runtime integration

use wasmer::{Instance, Module, Store, Memory, Value, imports};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use anyhow::{Result, Error};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KatalystParams {
    pub method: String,
    pub data: serde_json::Value,
    pub context: Option<HashMap<String, serde_json::Value>>,
}

#[derive(Debug, Clone)]
pub struct KatalystWasmerState {
    pub instance: Instance,
    pub store: Store,
    pub memory: Memory,
    pub runtime_state: Arc<Mutex<HashMap<String, serde_json::Value>>>,
}

pub struct KatalystWasmer {
    state: Option<KatalystWasmerState>,
    initialized: bool,
}

impl KatalystWasmer {
    pub fn new() -> Self {
        Self {
            state: None,
            initialized: false,
        }
    }

    pub fn initialize(&mut self, wasm_bytes: &[u8]) -> Result<()> {
        if self.initialized {
            return Ok(());
        }

        let mut store = Store::default();
        let module = Module::new(&store, wasm_bytes)?;
        
        // Create imports object for WASM module
        let import_object = imports! {};
        
        let instance = Instance::new(&mut store, &module, &import_object)?;
        let memory = instance.exports.get_memory("memory")?;

        self.state = Some(KatalystWasmerState {
            instance,
            store,
            memory: memory.clone(),
            runtime_state: Arc::new(Mutex::new(HashMap::new())),
        });

        self.initialized = true;
        Ok(())
    }

    pub fn execute_stateful_call(
        &mut self, 
        method: &str, 
        params: &KatalystParams
    ) -> Result<serde_json::Value> {
        let state = self.state.as_mut()
            .ok_or_else(|| Error::msg("Wasmer not initialized"))?;

        match method {
            "process_context" => {
                self.call_wasm_function(state, "process_context", params)
            },
            "execute_protocol" => {
                self.call_wasm_function(state, "execute_protocol", params)  
            },
            "control_loop_step" => {
                self.call_wasm_function(state, "control_loop_step", params)
            },
            "bridge_call" => {
                self.call_wasm_function(state, "bridge_call", params)
            },
            _ => Err(Error::msg(format!("Unknown method: {}", method))),
        }
    }

    fn call_wasm_function(
        &mut self,
        state: &mut KatalystWasmerState,
        function_name: &str,
        params: &KatalystParams,
    ) -> Result<serde_json::Value> {
        let function = state.instance.exports.get_function(function_name)?;
        
        // Serialize parameters to JSON string
        let json_params = serde_json::to_string(params)?;
        
        // Allocate memory in WASM for input
        let input_ptr = self.allocate_string(&mut state.store, &state.memory, &json_params)?;
        
        // Call the WASM function
        let result = function.call(&mut state.store, &[Value::I32(input_ptr as i32)])?;
        
        // Extract result pointer from WASM
        let result_ptr = match result.get(0) {
            Some(Value::I32(ptr)) => *ptr as usize,
            _ => return Err(Error::msg("Invalid WASM function return type")),
        };
        
        // Read result string from WASM memory
        let result_json = self.read_string_from_memory(&state.store, &state.memory, result_ptr)?;
        
        // Parse JSON result
        let parsed_result: serde_json::Value = serde_json::from_str(&result_json)?;
        
        Ok(parsed_result)
    }

    fn allocate_string(
        &self,
        store: &mut Store,
        memory: &Memory,
        s: &str,
    ) -> Result<usize> {
        let bytes = s.as_bytes();
        let len = bytes.len();
        
        // Call WASM allocator function (assumes it exists)
        let alloc_func = self.state.as_ref().unwrap()
            .instance.exports.get_function("katalyst_alloc")?;
        
        let result = alloc_func.call(store, &[Value::I32(len as i32)])?;
        let ptr = match result.get(0) {
            Some(Value::I32(ptr)) => *ptr as usize,
            _ => return Err(Error::msg("Allocation failed")),
        };
        
        // Write string bytes to allocated memory
        let memory_view = memory.view(store);
        for (i, &byte) in bytes.iter().enumerate() {
            memory_view.write_u8(ptr + i, byte)?;
        }
        
        Ok(ptr)
    }

    fn read_string_from_memory(
        &self,
        store: &Store,
        memory: &Memory,
        ptr: usize,
    ) -> Result<String> {
        let memory_view = memory.view(store);
        
        // Read length (assuming it's stored as u32 at ptr)
        let len = memory_view.read_u32(ptr)? as usize;
        
        // Read string bytes
        let mut bytes = vec![0u8; len];
        for i in 0..len {
            bytes[i] = memory_view.read_u8(ptr + 4 + i)?;
        }
        
        String::from_utf8(bytes).map_err(Error::from)
    }

    pub fn get_state(&self) -> Option<HashMap<String, serde_json::Value>> {
        self.state.as_ref().and_then(|s| {
            s.runtime_state.lock().ok().map(|guard| guard.clone())
        })
    }

    pub fn cleanup(&mut self) {
        self.state = None;
        self.initialized = false;
    }
}

// Thread-safe singleton wrapper
use std::sync::OnceLock;

static KATALYST_WASMER: OnceLock<Arc<Mutex<KatalystWasmer>>> = OnceLock::new();

pub fn get_katalyst_wasmer() -> Arc<Mutex<KatalystWasmer>> {
    KATALYST_WASMER.get_or_init(|| {
        Arc::new(Mutex::new(KatalystWasmer::new()))
    }).clone()
}

// C-compatible API for FFI
#[no_mangle]
pub extern "C" fn katalyst_wasmer_init(wasm_bytes: *const u8, len: usize) -> i32 {
    if wasm_bytes.is_null() {
        return -1;
    }
    
    let bytes = unsafe { std::slice::from_raw_parts(wasm_bytes, len) };
    let katalyst = get_katalyst_wasmer();
    
    match katalyst.lock() {
        Ok(mut k) => {
            match k.initialize(bytes) {
                Ok(()) => 0,
                Err(_) => -2,
            }
        },
        Err(_) => -3,
    }
}

#[no_mangle]
pub extern "C" fn katalyst_wasmer_execute(
    method: *const u8,
    method_len: usize,
    params: *const u8,
    params_len: usize,
    result_ptr: *mut *mut u8,
    result_len: *mut usize,
) -> i32 {
    if method.is_null() || params.is_null() || result_ptr.is_null() || result_len.is_null() {
        return -1;
    }
    
    let method_bytes = unsafe { std::slice::from_raw_parts(method, method_len) };
    let params_bytes = unsafe { std::slice::from_raw_parts(params, params_len) };
    
    let method_str = match std::str::from_utf8(method_bytes) {
        Ok(s) => s,
        Err(_) => return -2,
    };
    
    let params: KatalystParams = match serde_json::from_slice(params_bytes) {
        Ok(p) => p,
        Err(_) => return -3,
    };
    
    let katalyst = get_katalyst_wasmer();
    let result = match katalyst.lock() {
        Ok(mut k) => k.execute_stateful_call(method_str, &params),
        Err(_) => return -4,
    };
    
    match result {
        Ok(value) => {
            let result_json = serde_json::to_string(&value).unwrap_or_default();
            let result_bytes = result_json.into_bytes();
            
            unsafe {
                *result_len = result_bytes.len();
                *result_ptr = result_bytes.as_ptr() as *mut u8;
                std::mem::forget(result_bytes); // Caller must free
            }
            
            0
        },
        Err(_) => -5,
    }
}
