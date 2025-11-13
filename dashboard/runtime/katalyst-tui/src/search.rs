use anyhow::Result;
use std::{
    collections::HashMap,
    path::{Path, PathBuf},
    sync::Arc,
};
use tantivy::{
    collector::TopDocs,
    directory::MmapDirectory,
    doc,
    query::QueryParser,
    schema::{Field, Schema, SchemaBuilder, TEXT, STORED, STRING, INDEXED},
    Document, Index, IndexReader, IndexWriter, ReloadPolicy, Searcher,
};
use tokio::sync::RwLock;
use skim::prelude::*;
use rayon::prelude::*;

pub struct SearchEngine {
    index: Index,
    reader: IndexReader,
    writer: Arc<RwLock<IndexWriter>>,
    schema: Schema,
    fields: SearchFields,
}

struct SearchFields {
    path: Field,
    content: Field,
    language: Field,
    symbols: Field,
    line_number: Field,
}

impl SearchEngine {
    pub fn new(index_path: &Path) -> Result<Self> {
        // Build schema
        let mut schema_builder = SchemaBuilder::new();
        
        let path = schema_builder.add_text_field("path", TEXT | STORED);
        let content = schema_builder.add_text_field("content", TEXT | STORED);
        let language = schema_builder.add_text_field("language", STRING | STORED);
        let symbols = schema_builder.add_text_field("symbols", TEXT | STORED);
        let line_number = schema_builder.add_u64_field("line_number", STORED);
        
        let schema = schema_builder.build();
        
        // Create or open index
        let index = if index_path.exists() {
            let dir = MmapDirectory::open(index_path)?;
            Index::open(dir)?
        } else {
            std::fs::create_dir_all(index_path)?;
            let dir = MmapDirectory::open(index_path)?;
            Index::create(dir, schema.clone())?
        };
        
        let reader = index
            .reader_builder()
            .reload_policy(ReloadPolicy::OnCommit)
            .try_into()?;
        
        let writer = Arc::new(RwLock::new(index.writer(500_000_000)?));
        
        Ok(Self {
            index,
            reader,
            writer,
            schema,
            fields: SearchFields {
                path,
                content,
                language,
                symbols,
                line_number,
            },
        })
    }
    
    pub async fn index_file(&self, file_path: &Path, content: &str, language: &str) -> Result<()> {
        let mut writer = self.writer.write().await;
        
        // Parse symbols from content
        let symbols = self.extract_symbols(content, language);
        
        // Index each line separately for line-level search
        for (line_num, line) in content.lines().enumerate() {
            let mut doc = Document::new();
            doc.add_text(self.fields.path, file_path.to_string_lossy());
            doc.add_text(self.fields.content, line);
            doc.add_text(self.fields.language, language);
            doc.add_text(self.fields.symbols, &symbols);
            doc.add_u64(self.fields.line_number, line_num as u64);
            
            writer.add_document(doc)?;
        }
        
        writer.commit()?;
        Ok(())
    }
    
    pub async fn search(&self, query_str: &str, limit: usize) -> Result<Vec<SearchResult>> {
        let searcher = self.reader.searcher();
        
        let query_parser = QueryParser::for_index(
            &self.index,
            vec![self.fields.content, self.fields.symbols],
        );
        
        let query = query_parser.parse_query(query_str)?;
        let top_docs = searcher.search(&query, &TopDocs::with_limit(limit))?;
        
        let mut results = Vec::new();
        
        for (_score, doc_address) in top_docs {
            let retrieved_doc = searcher.doc(doc_address)?;
            
            let path = retrieved_doc
                .get_first(self.fields.path)
                .and_then(|f| f.as_text())
                .unwrap_or("")
                .to_string();
            
            let content = retrieved_doc
                .get_first(self.fields.content)
                .and_then(|f| f.as_text())
                .unwrap_or("")
                .to_string();
            
            let line_number = retrieved_doc
                .get_first(self.fields.line_number)
                .and_then(|f| f.as_u64())
                .unwrap_or(0);
            
            results.push(SearchResult {
                path: PathBuf::from(path),
                content,
                line_number: line_number as usize,
                score: _score,
            });
        }
        
        Ok(results)
    }
    
    pub async fn fuzzy_search(&self, pattern: &str) -> Result<Vec<SearchResult>> {
        // Use skim for fuzzy searching
        let options = SkimOptionsBuilder::default()
            .height(Some("50%"))
            .multi(true)
            .query(Some(pattern))
            .build()
            .unwrap();
        
        let searcher = self.reader.searcher();
        let query_parser = QueryParser::for_index(
            &self.index,
            vec![self.fields.content],
        );
        
        // Create fuzzy query
        let fuzzy_query = format!("{}~2", pattern); // Allow 2 character edits
        let query = query_parser.parse_query(&fuzzy_query)?;
        let top_docs = searcher.search(&query, &TopDocs::with_limit(100))?;
        
        let mut results = Vec::new();
        for (_score, doc_address) in top_docs {
            let doc = searcher.doc(doc_address)?;
            // Process similar to regular search
            results.push(self.doc_to_result(doc, _score)?);
        }
        
        Ok(results)
    }
    
    pub async fn search_symbols(&self, symbol_query: &str) -> Result<Vec<SymbolResult>> {
        let searcher = self.reader.searcher();
        let query_parser = QueryParser::for_index(&self.index, vec![self.fields.symbols]);
        let query = query_parser.parse_query(symbol_query)?;
        let top_docs = searcher.search(&query, &TopDocs::with_limit(50))?;
        
        let mut results = Vec::new();
        for (_score, doc_address) in top_docs {
            let doc = searcher.doc(doc_address)?;
            let path = doc
                .get_first(self.fields.path)
                .and_then(|f| f.as_text())
                .unwrap_or("")
                .to_string();
            
            let symbols = doc
                .get_first(self.fields.symbols)
                .and_then(|f| f.as_text())
                .unwrap_or("")
                .to_string();
            
            // Parse symbols and create results
            for symbol in symbols.split(',') {
                if symbol.contains(symbol_query) {
                    results.push(SymbolResult {
                        name: symbol.to_string(),
                        path: PathBuf::from(&path),
                        kind: self.detect_symbol_kind(symbol),
                    });
                }
            }
        }
        
        Ok(results)
    }
    
    pub async fn reindex_workspace(&self, workspace_root: &Path) -> Result<()> {
        // Clear existing index
        {
            let mut writer = self.writer.write().await;
            writer.delete_all_documents()?;
            writer.commit()?;
        }
        
        // Walk through all files and reindex
        let files: Vec<PathBuf> = walkdir::WalkDir::new(workspace_root)
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.file_type().is_file())
            .filter(|e| self.should_index_file(e.path()))
            .map(|e| e.path().to_path_buf())
            .collect();
        
        // Parallel indexing
        let chunks: Vec<Vec<PathBuf>> = files
            .chunks(100)
            .map(|chunk| chunk.to_vec())
            .collect();
        
        for chunk in chunks {
            for file_path in chunk {
                if let Ok(content) = std::fs::read_to_string(&file_path) {
                    let language = self.detect_language(&file_path);
                    self.index_file(&file_path, &content, &language).await?;
                }
            }
        }
        
        Ok(())
    }
    
    fn extract_symbols(&self, content: &str, language: &str) -> String {
        // Extract symbols based on language
        // This is a simplified version - in production, use tree-sitter
        let mut symbols = Vec::new();
        
        match language {
            "rust" => {
                // Extract Rust symbols
                for line in content.lines() {
                    if line.trim().starts_with("fn ") {
                        if let Some(name) = line.split_whitespace().nth(1) {
                            symbols.push(name.split('(').next().unwrap_or(name));
                        }
                    } else if line.trim().starts_with("struct ") {
                        if let Some(name) = line.split_whitespace().nth(1) {
                            symbols.push(name.split('{').next().unwrap_or(name));
                        }
                    } else if line.trim().starts_with("enum ") {
                        if let Some(name) = line.split_whitespace().nth(1) {
                            symbols.push(name.split('{').next().unwrap_or(name));
                        }
                    }
                }
            }
            "typescript" | "javascript" => {
                // Extract JS/TS symbols
                for line in content.lines() {
                    if line.contains("function ") {
                        if let Some(name) = line.split("function ").nth(1) {
                            if let Some(name) = name.split('(').next() {
                                symbols.push(name.trim());
                            }
                        }
                    } else if line.contains("class ") {
                        if let Some(name) = line.split("class ").nth(1) {
                            if let Some(name) = name.split_whitespace().next() {
                                symbols.push(name.trim_end_matches('{'));
                            }
                        }
                    }
                }
            }
            _ => {}
        }
        
        symbols.join(",")
    }
    
    fn detect_language(&self, path: &Path) -> String {
        match path.extension().and_then(|s| s.to_str()) {
            Some("rs") => "rust",
            Some("ts") | Some("tsx") => "typescript",
            Some("js") | Some("jsx") => "javascript",
            Some("py") => "python",
            Some("go") => "go",
            Some("java") => "java",
            Some("cpp") | Some("cc") | Some("cxx") => "cpp",
            Some("c") | Some("h") => "c",
            Some("rb") => "ruby",
            Some("php") => "php",
            Some("ex") | Some("exs") => "elixir",
            Some("kt") => "kotlin",
            Some("cs") => "csharp",
            _ => "text",
        }.to_string()
    }
    
    fn should_index_file(&self, path: &Path) -> bool {
        // Skip common non-source files and directories
        if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
            if name.starts_with('.') || name == "node_modules" || name == "target" {
                return false;
            }
        }
        
        // Only index known source file extensions
        matches!(
            path.extension().and_then(|s| s.to_str()),
            Some("rs") | Some("ts") | Some("tsx") | Some("js") | Some("jsx") |
            Some("py") | Some("go") | Some("java") | Some("cpp") | Some("cc") |
            Some("c") | Some("h") | Some("rb") | Some("php") | Some("ex") |
            Some("exs") | Some("kt") | Some("cs") | Some("md") | Some("toml") |
            Some("yaml") | Some("yml") | Some("json")
        )
    }
    
    fn doc_to_result(&self, doc: Document, score: f32) -> Result<SearchResult> {
        let path = doc
            .get_first(self.fields.path)
            .and_then(|f| f.as_text())
            .unwrap_or("")
            .to_string();
        
        let content = doc
            .get_first(self.fields.content)
            .and_then(|f| f.as_text())
            .unwrap_or("")
            .to_string();
        
        let line_number = doc
            .get_first(self.fields.line_number)
            .and_then(|f| f.as_u64())
            .unwrap_or(0);
        
        Ok(SearchResult {
            path: PathBuf::from(path),
            content,
            line_number: line_number as usize,
            score,
        })
    }
    
    fn detect_symbol_kind(&self, symbol: &str) -> SymbolKind {
        // Simple heuristic - in production, use proper parsing
        if symbol.starts_with("fn_") || symbol.contains("()") {
            SymbolKind::Function
        } else if symbol.starts_with("struct_") {
            SymbolKind::Struct
        } else if symbol.starts_with("enum_") {
            SymbolKind::Enum
        } else if symbol.starts_with("class_") {
            SymbolKind::Class
        } else {
            SymbolKind::Variable
        }
    }
}

#[derive(Debug, Clone)]
pub struct SearchResult {
    pub path: PathBuf,
    pub content: String,
    pub line_number: usize,
    pub score: f32,
}

#[derive(Debug, Clone)]
pub struct SymbolResult {
    pub name: String,
    pub path: PathBuf,
    pub kind: SymbolKind,
}

#[derive(Debug, Clone)]
pub enum SymbolKind {
    Function,
    Struct,
    Enum,
    Class,
    Variable,
    Module,
    Trait,
    Interface,
}

// Parallel file search using rayon
pub struct ParallelSearcher;

impl ParallelSearcher {
    pub fn search_in_files(
        root: &Path,
        pattern: &str,
        extensions: &[&str],
    ) -> Vec<(PathBuf, Vec<(usize, String)>)> {
        let pattern = pattern.to_string();
        let extensions: Vec<String> = extensions.iter().map(|s| s.to_string()).collect();
        
        let files: Vec<PathBuf> = walkdir::WalkDir::new(root)
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.file_type().is_file())
            .filter(|e| {
                if extensions.is_empty() {
                    true
                } else {
                    e.path()
                        .extension()
                        .and_then(|ext| ext.to_str())
                        .map(|ext| extensions.iter().any(|e| e == ext))
                        .unwrap_or(false)
                }
            })
            .map(|e| e.path().to_path_buf())
            .collect();
        
        files
            .par_iter()
            .filter_map(|path| {
                std::fs::read_to_string(path).ok().and_then(|content| {
                    let matches: Vec<(usize, String)> = content
                        .lines()
                        .enumerate()
                        .filter(|(_, line)| line.contains(&pattern))
                        .map(|(n, line)| (n + 1, line.to_string()))
                        .collect();
                    
                    if matches.is_empty() {
                        None
                    } else {
                        Some((path.clone(), matches))
                    }
                })
            })
            .collect()
    }
}