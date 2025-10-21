use std::{
    collections::VecDeque,
    sync::atomic::{AtomicU64, AtomicUsize, Ordering},
    time::{Duration, Instant},
};
use metrics::{counter, gauge, histogram};

/// Performance monitoring system for the terminal
pub struct PerformanceMonitor {
    // Frame timing
    frame_times: VecDeque<Duration>,
    frame_start: Option<Instant>,
    target_frame_time: Duration,
    
    // Metrics
    frames_rendered: AtomicU64,
    input_events: AtomicU64,
    bytes_rendered: AtomicU64,
    cache_hits: AtomicU64,
    cache_misses: AtomicU64,
    
    // Activity tracking
    last_input_time: Instant,
    last_render_time: Instant,
    
    // Performance stats
    min_frame_time: Duration,
    max_frame_time: Duration,
    avg_frame_time: Duration,
    
    // GPU metrics
    gpu_memory_used: AtomicUsize,
    gpu_utilization: AtomicUsize,
}

impl PerformanceMonitor {
    pub fn new() -> Self {
        // Register metrics
        gauge!("terminal.fps", "Current frames per second");
        histogram!("terminal.frame_time", "Frame render time");
        counter!("terminal.frames_total", "Total frames rendered");
        counter!("terminal.input_events_total", "Total input events");
        gauge!("terminal.gpu_memory_bytes", "GPU memory usage");
        gauge!("terminal.cache_hit_rate", "Glyph cache hit rate");
        
        Self {
            frame_times: VecDeque::with_capacity(144), // Track last 144 frames
            frame_start: None,
            target_frame_time: Duration::from_micros(6944), // 144 FPS
            frames_rendered: AtomicU64::new(0),
            input_events: AtomicU64::new(0),
            bytes_rendered: AtomicU64::new(0),
            cache_hits: AtomicU64::new(0),
            cache_misses: AtomicU64::new(0),
            last_input_time: Instant::now(),
            last_render_time: Instant::now(),
            min_frame_time: Duration::MAX,
            max_frame_time: Duration::ZERO,
            avg_frame_time: Duration::ZERO,
            gpu_memory_used: AtomicUsize::new(0),
            gpu_utilization: AtomicUsize::new(0),
        }
    }
    
    pub fn begin_frame(&mut self) {
        self.frame_start = Some(Instant::now());
    }
    
    pub fn end_frame(&mut self) {
        if let Some(start) = self.frame_start.take() {
            let frame_time = start.elapsed();
            
            // Update frame times buffer
            if self.frame_times.len() >= 144 {
                self.frame_times.pop_front();
            }
            self.frame_times.push_back(frame_time);
            
            // Update statistics
            self.min_frame_time = self.min_frame_time.min(frame_time);
            self.max_frame_time = self.max_frame_time.max(frame_time);
            
            let sum: Duration = self.frame_times.iter().sum();
            self.avg_frame_time = sum / self.frame_times.len() as u32;
            
            // Update metrics
            self.frames_rendered.fetch_add(1, Ordering::Relaxed);
            self.last_render_time = Instant::now();
            
            // Report to metrics system
            histogram!("terminal.frame_time", frame_time.as_micros() as f64);
            
            let fps = if frame_time.as_millis() > 0 {
                1000.0 / frame_time.as_millis() as f64
            } else {
                144.0
            };
            gauge!("terminal.fps", fps);
            
            // Warn if frame time exceeded budget
            if frame_time > self.target_frame_time {
                tracing::debug!(
                    "Frame time {} exceeded budget {}",
                    frame_time.as_micros(),
                    self.target_frame_time.as_micros()
                );
            }
        }
    }
    
    pub fn record_input(&self) {
        self.input_events.fetch_add(1, Ordering::Relaxed);
        counter!("terminal.input_events_total", 1);
    }
    
    pub fn record_cache_hit(&self) {
        self.cache_hits.fetch_add(1, Ordering::Relaxed);
    }
    
    pub fn record_cache_miss(&self) {
        self.cache_misses.fetch_add(1, Ordering::Relaxed);
    }
    
    pub fn record_bytes_rendered(&self, bytes: u64) {
        self.bytes_rendered.fetch_add(bytes, Ordering::Relaxed);
    }
    
    pub fn update_gpu_memory(&self, bytes: usize) {
        self.gpu_memory_used.store(bytes, Ordering::Relaxed);
        gauge!("terminal.gpu_memory_bytes", bytes as f64);
    }
    
    pub fn update_gpu_utilization(&self, percent: usize) {
        self.gpu_utilization.store(percent, Ordering::Relaxed);
        gauge!("terminal.gpu_utilization", percent as f64);
    }
    
    pub fn get_stats(&self) -> Stats {
        let total_frames = self.frames_rendered.load(Ordering::Relaxed);
        let total_hits = self.cache_hits.load(Ordering::Relaxed);
        let total_misses = self.cache_misses.load(Ordering::Relaxed);
        
        let cache_hit_rate = if total_hits + total_misses > 0 {
            (total_hits as f64 / (total_hits + total_misses) as f64) * 100.0
        } else {
            0.0
        };
        
        let current_fps = if !self.frame_times.is_empty() {
            let avg_frame = self.avg_frame_time.as_millis() as f64;
            if avg_frame > 0.0 {
                1000.0 / avg_frame
            } else {
                144.0
            }
        } else {
            0.0
        };
        
        Stats {
            fps: current_fps,
            frame_time_min_us: self.min_frame_time.as_micros() as u64,
            frame_time_max_us: self.max_frame_time.as_micros() as u64,
            frame_time_avg_us: self.avg_frame_time.as_micros() as u64,
            frames_rendered: total_frames,
            input_events: self.input_events.load(Ordering::Relaxed),
            bytes_rendered: self.bytes_rendered.load(Ordering::Relaxed),
            cache_hit_rate,
            gpu_memory_mb: (self.gpu_memory_used.load(Ordering::Relaxed) / 1024 / 1024),
            gpu_utilization: self.gpu_utilization.load(Ordering::Relaxed),
            input_activity_ms: self.last_input_time.elapsed().as_millis() as u64,
        }
    }
    
    pub fn should_throttle(&self) -> bool {
        // Throttle if no activity for more than 5 seconds
        self.last_input_time.elapsed() > Duration::from_secs(5) &&
        self.last_render_time.elapsed() > Duration::from_secs(1)
    }
    
    pub fn get_recommended_fps(&self) -> u32 {
        let input_idle = self.last_input_time.elapsed();
        
        if input_idle < Duration::from_millis(100) {
            144 // Maximum responsiveness during active input
        } else if input_idle < Duration::from_millis(500) {
            120 // High responsiveness
        } else if input_idle < Duration::from_secs(1) {
            60  // Normal responsiveness
        } else if input_idle < Duration::from_secs(5) {
            30  // Reduced for power saving
        } else {
            10  // Minimal for idle
        }
    }
}

#[derive(Debug, Clone)]
pub struct Stats {
    pub fps: f64,
    pub frame_time_min_us: u64,
    pub frame_time_max_us: u64,
    pub frame_time_avg_us: u64,
    pub frames_rendered: u64,
    pub input_events: u64,
    pub bytes_rendered: u64,
    pub cache_hit_rate: f64,
    pub gpu_memory_mb: usize,
    pub gpu_utilization: usize,
    pub input_activity_ms: u64,
}

impl Stats {
    pub fn print_summary(&self) {
        println!("╭─────────────────────────────────────╮");
        println!("│     Terminal Performance Stats      │");
        println!("├─────────────────────────────────────┤");
        println!("│ FPS:              {:>6.1} fps        │", self.fps);
        println!("│ Frame Time (avg): {:>6} µs         │", self.frame_time_avg_us);
        println!("│ Frame Time (min): {:>6} µs         │", self.frame_time_min_us);
        println!("│ Frame Time (max): {:>6} µs         │", self.frame_time_max_us);
        println!("│ Cache Hit Rate:   {:>6.1}%          │", self.cache_hit_rate);
        println!("│ GPU Memory:       {:>6} MB         │", self.gpu_memory_mb);
        println!("│ GPU Utilization:  {:>6}%           │", self.gpu_utilization);
        println!("│ Input Events:     {:>6}            │", self.input_events);
        println!("│ Frames Rendered:  {:>6}            │", self.frames_rendered);
        println!("╰─────────────────────────────────────╯");
    }
}

/// Benchmarking utilities
pub mod benchmark {
    use super::*;
    use std::hint::black_box;
    
    pub struct Benchmark {
        name: String,
        iterations: usize,
        results: Vec<Duration>,
    }
    
    impl Benchmark {
        pub fn new(name: impl Into<String>) -> Self {
            Self {
                name: name.into(),
                iterations: 1000,
                results: Vec::new(),
            }
        }
        
        pub fn iterations(mut self, n: usize) -> Self {
            self.iterations = n;
            self
        }
        
        pub fn run<F, T>(mut self, mut f: F) -> BenchmarkResult
        where
            F: FnMut() -> T,
        {
            // Warmup
            for _ in 0..100 {
                black_box(f());
            }
            
            // Actual benchmark
            for _ in 0..self.iterations {
                let start = Instant::now();
                black_box(f());
                self.results.push(start.elapsed());
            }
            
            self.analyze()
        }
        
        fn analyze(self) -> BenchmarkResult {
            let mut sorted = self.results.clone();
            sorted.sort();
            
            let min = sorted[0];
            let max = sorted[sorted.len() - 1];
            let median = sorted[sorted.len() / 2];
            let sum: Duration = sorted.iter().sum();
            let mean = sum / sorted.len() as u32;
            
            // Calculate percentiles
            let p95 = sorted[(sorted.len() as f64 * 0.95) as usize];
            let p99 = sorted[(sorted.len() as f64 * 0.99) as usize];
            
            BenchmarkResult {
                name: self.name,
                iterations: self.iterations,
                min,
                max,
                mean,
                median,
                p95,
                p99,
            }
        }
    }
    
    pub struct BenchmarkResult {
        pub name: String,
        pub iterations: usize,
        pub min: Duration,
        pub max: Duration,
        pub mean: Duration,
        pub median: Duration,
        pub p95: Duration,
        pub p99: Duration,
    }
    
    impl BenchmarkResult {
        pub fn print(&self) {
            println!("Benchmark: {}", self.name);
            println!("  Iterations: {}", self.iterations);
            println!("  Min:    {:>10.3} µs", self.min.as_secs_f64() * 1_000_000.0);
            println!("  Median: {:>10.3} µs", self.median.as_secs_f64() * 1_000_000.0);
            println!("  Mean:   {:>10.3} µs", self.mean.as_secs_f64() * 1_000_000.0);
            println!("  P95:    {:>10.3} µs", self.p95.as_secs_f64() * 1_000_000.0);
            println!("  P99:    {:>10.3} µs", self.p99.as_secs_f64() * 1_000_000.0);
            println!("  Max:    {:>10.3} µs", self.max.as_secs_f64() * 1_000_000.0);
        }
    }
}