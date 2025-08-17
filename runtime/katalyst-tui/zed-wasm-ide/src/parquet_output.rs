use std::sync::Arc;
use arrow::array::{StringArray, Int64Array, TimestampMillisecondArray};
use arrow::datatypes::{DataType, Field, Schema, TimeUnit};
use arrow::record_batch::RecordBatch;
use parquet::arrow::ArrowWriter;
use parquet::file::properties::WriterProperties;
use serde::{Deserialize, Serialize};
use std::collections::VecDeque;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogEntry {
    pub timestamp: i64,
    pub event_type: String,
    pub category: String,
    pub details: String,
    pub metadata: String,
}

pub struct ParquetWriter {
    entries: VecDeque<LogEntry>,
    max_entries: usize,
    schema: Arc<Schema>,
}

impl ParquetWriter {
    pub fn new() -> Self {
        let schema = Arc::new(Schema::new(vec![
            Field::new("timestamp", DataType::Timestamp(TimeUnit::Millisecond, None), false),
            Field::new("event_type", DataType::Utf8, false),
            Field::new("category", DataType::Utf8, false),
            Field::new("details", DataType::Utf8, false),
            Field::new("metadata", DataType::Utf8, true),
        ]));
        
        Self {
            entries: VecDeque::with_capacity(10000),
            max_entries: 10000,
            schema,
        }
    }
    
    pub async fn log_file_operation(
        &mut self,
        operation: &str,
        path: &str,
        content: Option<&str>,
    ) -> Result<(), String> {
        let entry = LogEntry {
            timestamp: current_timestamp_millis(),
            event_type: "file_operation".to_string(),
            category: operation.to_string(),
            details: path.to_string(),
            metadata: content.map(|c| {
                if c.len() > 1000 {
                    format!("{}... (truncated)", &c[..1000])
                } else {
                    c.to_string()
                }
            }).unwrap_or_default(),
        };
        
        self.add_entry(entry);
        Ok(())
    }
    
    pub async fn log_execution(
        &mut self,
        language: &str,
        code: &str,
        result: &str,
    ) -> Result<(), String> {
        let entry = LogEntry {
            timestamp: current_timestamp_millis(),
            event_type: "code_execution".to_string(),
            category: language.to_string(),
            details: if code.len() > 500 {
                format!("{}... (truncated)", &code[..500])
            } else {
                code.to_string()
            },
            metadata: if result.len() > 1000 {
                format!("{}... (truncated)", &result[..1000])
            } else {
                result.to_string()
            },
        };
        
        self.add_entry(entry);
        Ok(())
    }
    
    pub async fn log_lsp_event(
        &mut self,
        event_type: &str,
        file_path: &str,
        details: &str,
    ) -> Result<(), String> {
        let entry = LogEntry {
            timestamp: current_timestamp_millis(),
            event_type: "lsp_event".to_string(),
            category: event_type.to_string(),
            details: file_path.to_string(),
            metadata: details.to_string(),
        };
        
        self.add_entry(entry);
        Ok(())
    }
    
    pub async fn log_terminal_command(
        &mut self,
        command: &str,
        output: &str,
    ) -> Result<(), String> {
        let entry = LogEntry {
            timestamp: current_timestamp_millis(),
            event_type: "terminal_command".to_string(),
            category: "command".to_string(),
            details: command.to_string(),
            metadata: if output.len() > 1000 {
                format!("{}... (truncated)", &output[..1000])
            } else {
                output.to_string()
            },
        };
        
        self.add_entry(entry);
        Ok(())
    }
    
    pub async fn log_user_action(
        &mut self,
        action: &str,
        target: &str,
        details: Option<&str>,
    ) -> Result<(), String> {
        let entry = LogEntry {
            timestamp: current_timestamp_millis(),
            event_type: "user_action".to_string(),
            category: action.to_string(),
            details: target.to_string(),
            metadata: details.unwrap_or_default().to_string(),
        };
        
        self.add_entry(entry);
        Ok(())
    }
    
    fn add_entry(&mut self, entry: LogEntry) {
        self.entries.push_back(entry);
        
        // Keep only the last max_entries
        while self.entries.len() > self.max_entries {
            self.entries.pop_front();
        }
    }
    
    pub async fn finalize(&mut self, output_path: &str) -> Result<Vec<u8>, String> {
        if self.entries.is_empty() {
            return Err("No entries to write".to_string());
        }
        
        // Convert entries to Arrow arrays
        let timestamps: Vec<i64> = self.entries.iter().map(|e| e.timestamp).collect();
        let event_types: Vec<String> = self.entries.iter().map(|e| e.event_type.clone()).collect();
        let categories: Vec<String> = self.entries.iter().map(|e| e.category.clone()).collect();
        let details: Vec<String> = self.entries.iter().map(|e| e.details.clone()).collect();
        let metadata: Vec<Option<String>> = self.entries.iter()
            .map(|e| if e.metadata.is_empty() { None } else { Some(e.metadata.clone()) })
            .collect();
        
        // Create Arrow arrays
        let timestamp_array = TimestampMillisecondArray::from(timestamps);
        let event_type_array = StringArray::from(event_types);
        let category_array = StringArray::from(categories);
        let details_array = StringArray::from(details);
        let metadata_array = StringArray::from(metadata);
        
        // Create record batch
        let batch = RecordBatch::try_new(
            self.schema.clone(),
            vec![
                Arc::new(timestamp_array),
                Arc::new(event_type_array),
                Arc::new(category_array),
                Arc::new(details_array),
                Arc::new(metadata_array),
            ],
        ).map_err(|e| format!("Failed to create record batch: {}", e))?;
        
        // Write to bytes (in WASM, we return bytes instead of writing to file)
        let mut buffer = Vec::new();
        {
            let props = WriterProperties::builder().build();
            let mut writer = ArrowWriter::try_new(&mut buffer, self.schema.clone(), Some(props))
                .map_err(|e| format!("Failed to create Parquet writer: {}", e))?;
            
            writer.write(&batch)
                .map_err(|e| format!("Failed to write batch: {}", e))?;
            
            writer.close()
                .map_err(|e| format!("Failed to close writer: {}", e))?;
        }
        
        Ok(buffer)
    }
    
    pub async fn get_entries_json(&self) -> Result<String, String> {
        serde_json::to_string(&self.entries.iter().collect::<Vec<_>>())
            .map_err(|e| format!("Failed to serialize entries: {}", e))
    }
    
    pub async fn clear(&mut self) {
        self.entries.clear();
    }
    
    pub async fn set_max_entries(&mut self, max: usize) {
        self.max_entries = max;
        
        // Trim entries if necessary
        while self.entries.len() > self.max_entries {
            self.entries.pop_front();
        }
    }
}

fn current_timestamp_millis() -> i64 {
    #[cfg(target_arch = "wasm32")]
    {
        js_sys::Date::now() as i64
    }
    
    #[cfg(not(target_arch = "wasm32"))]
    {
        use std::time::{SystemTime, UNIX_EPOCH};
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as i64
    }
}