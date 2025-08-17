-- D1 Database schema for time-series data (replacing TimescaleDB)
-- Note: D1 is SQLite-based, so we adapt TimescaleDB concepts

-- Metrics table with time-based partitioning simulation
CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time INTEGER NOT NULL, -- Unix timestamp in milliseconds
    metric_name TEXT NOT NULL,
    value REAL NOT NULL,
    tags TEXT, -- JSON string
    metadata TEXT, -- JSON string
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

-- Indexes for efficient time-series queries
CREATE INDEX IF NOT EXISTS idx_metrics_time ON metrics(time DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_name_time ON metrics(metric_name, time DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_time_window ON metrics(time, metric_name);

-- Events table for real-time event streaming
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT UNIQUE NOT NULL,
    time INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    source TEXT NOT NULL,
    data TEXT NOT NULL, -- JSON string
    processed INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    error TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

CREATE INDEX IF NOT EXISTS idx_events_time ON events(time DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type, time DESC);
CREATE INDEX IF NOT EXISTS idx_events_processed ON events(processed, time);

-- Aggregates table for pre-computed metrics
CREATE TABLE IF NOT EXISTS aggregates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bucket_time INTEGER NOT NULL, -- Start of time bucket
    bucket_size INTEGER NOT NULL, -- Size in seconds (60, 300, 3600, etc)
    metric_name TEXT NOT NULL,
    avg_value REAL,
    max_value REAL,
    min_value REAL,
    sum_value REAL,
    count INTEGER,
    percentile_50 REAL,
    percentile_95 REAL,
    percentile_99 REAL,
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
    UNIQUE(bucket_time, bucket_size, metric_name)
);

CREATE INDEX IF NOT EXISTS idx_aggregates_bucket ON aggregates(bucket_time, metric_name);
CREATE INDEX IF NOT EXISTS idx_aggregates_metric ON aggregates(metric_name, bucket_time DESC);

-- Sessions table for distributed system tracking
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    node_id TEXT NOT NULL,
    region TEXT NOT NULL,
    started_at INTEGER NOT NULL,
    last_heartbeat INTEGER NOT NULL,
    metadata TEXT, -- JSON string
    status TEXT DEFAULT 'active',
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status, last_heartbeat);
CREATE INDEX IF NOT EXISTS idx_sessions_region ON sessions(region, status);

-- Tasks table for queue processing tracking
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT UNIQUE NOT NULL,
    queue_name TEXT NOT NULL,
    payload TEXT NOT NULL, -- JSON string
    status TEXT DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    scheduled_at INTEGER,
    started_at INTEGER,
    completed_at INTEGER,
    error TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

CREATE INDEX IF NOT EXISTS idx_tasks_queue_status ON tasks(queue_name, status);
CREATE INDEX IF NOT EXISTS idx_tasks_scheduled ON tasks(scheduled_at, status);

-- Vector metadata table (actual vectors stored in Vectorize)
CREATE TABLE IF NOT EXISTS vector_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vector_id TEXT UNIQUE NOT NULL,
    content TEXT,
    namespace TEXT DEFAULT 'default',
    metadata TEXT, -- JSON string
    score REAL,
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
    updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

CREATE INDEX IF NOT EXISTS idx_vector_namespace ON vector_metadata(namespace);
CREATE INDEX IF NOT EXISTS idx_vector_created ON vector_metadata(created_at DESC);

-- Cloudflare deployment tracking
CREATE TABLE IF NOT EXISTS cf_deployments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deployment_id TEXT UNIQUE NOT NULL,
    worker_name TEXT NOT NULL,
    version TEXT NOT NULL,
    deployed_at INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    routes TEXT, -- JSON array
    metadata TEXT, -- JSON string
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

CREATE INDEX IF NOT EXISTS idx_deployments_worker ON cf_deployments(worker_name, deployed_at DESC);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON cf_deployments(status, deployed_at DESC);

-- View for recent metrics (last hour)
CREATE VIEW IF NOT EXISTS recent_metrics AS
SELECT 
    metric_name,
    AVG(value) as avg_value,
    MAX(value) as max_value,
    MIN(value) as min_value,
    COUNT(*) as count
FROM metrics
WHERE time > (strftime('%s', 'now') * 1000 - 3600000)
GROUP BY metric_name;

-- View for active sessions
CREATE VIEW IF NOT EXISTS active_sessions AS
SELECT 
    session_id,
    node_id,
    region,
    (strftime('%s', 'now') * 1000 - started_at) / 1000 as uptime_seconds,
    metadata
FROM sessions
WHERE status = 'active' 
    AND last_heartbeat > (strftime('%s', 'now') * 1000 - 60000);