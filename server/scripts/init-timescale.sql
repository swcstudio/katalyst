-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
CREATE EXTENSION IF NOT EXISTS pgvector;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS uuid-ossp;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS timeseries;
CREATE SCHEMA IF NOT EXISTS vectors;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Time-series tables for metrics
CREATE TABLE IF NOT EXISTS timeseries.metrics (
    time TIMESTAMPTZ NOT NULL,
    metric_name TEXT NOT NULL,
    value DOUBLE PRECISION,
    tags JSONB,
    metadata JSONB
);

-- Create hypertable for time-series data
SELECT create_hypertable('timeseries.metrics', 'time', 
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_metrics_time_desc ON timeseries.metrics(time DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_name_time ON timeseries.metrics(metric_name, time DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_tags ON timeseries.metrics USING GIN(tags);

-- Vector storage for embeddings
CREATE TABLE IF NOT EXISTS vectors.embeddings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    content TEXT,
    embedding vector(1536), -- OpenAI ada-002 dimension
    metadata JSONB,
    namespace TEXT DEFAULT 'default',
    score FLOAT
);

-- Create vector similarity search index
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON vectors.embeddings 
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Create GIN index for metadata
CREATE INDEX IF NOT EXISTS idx_embeddings_metadata ON vectors.embeddings USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_embeddings_namespace ON vectors.embeddings(namespace);

-- Real-time events table
CREATE TABLE IF NOT EXISTS timeseries.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type TEXT NOT NULL,
    source TEXT NOT NULL,
    data JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processing_time_ms INTEGER,
    error TEXT
);

-- Create hypertable for events
SELECT create_hypertable('timeseries.events', 'time',
    chunk_time_interval => INTERVAL '1 hour',
    if_not_exists => TRUE
);

-- Continuous aggregates for real-time analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.metrics_1min
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('1 minute', time) AS bucket,
    metric_name,
    AVG(value) as avg_value,
    MAX(value) as max_value,
    MIN(value) as min_value,
    COUNT(*) as sample_count
FROM timeseries.metrics
GROUP BY bucket, metric_name
WITH NO DATA;

-- Refresh policy for continuous aggregate
SELECT add_continuous_aggregate_policy('analytics.metrics_1min',
    start_offset => INTERVAL '2 hours',
    end_offset => INTERVAL '1 minute',
    schedule_interval => INTERVAL '1 minute',
    if_not_exists => TRUE
);

-- Session management for distributed systems
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    node_id TEXT NOT NULL,
    region TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB,
    status TEXT DEFAULT 'active'
);

-- Pulsar message tracking
CREATE TABLE IF NOT EXISTS public.pulsar_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id TEXT UNIQUE NOT NULL,
    topic TEXT NOT NULL,
    partition INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending',
    payload JSONB,
    error TEXT
);

-- Cloudflare Workers deployment tracking
CREATE TABLE IF NOT EXISTS public.cf_deployments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    worker_name TEXT NOT NULL,
    version TEXT NOT NULL,
    deployed_at TIMESTAMPTZ DEFAULT NOW(),
    deployment_id TEXT,
    status TEXT DEFAULT 'pending',
    routes JSONB,
    metadata JSONB
);

-- Create compression policies
SELECT add_compression_policy('timeseries.metrics', 
    compress_after => INTERVAL '7 days',
    if_not_exists => TRUE
);

SELECT add_compression_policy('timeseries.events',
    compress_after => INTERVAL '3 days', 
    if_not_exists => TRUE
);

-- Data retention policies
SELECT add_retention_policy('timeseries.metrics',
    drop_after => INTERVAL '90 days',
    if_not_exists => TRUE
);

SELECT add_retention_policy('timeseries.events',
    drop_after => INTERVAL '30 days',
    if_not_exists => TRUE
);

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION vectors.search_similar(
    query_embedding vector(1536),
    match_count INT DEFAULT 10,
    filter_namespace TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    similarity FLOAT,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.content,
        1 - (e.embedding <=> query_embedding) AS similarity,
        e.metadata
    FROM vectors.embeddings e
    WHERE (filter_namespace IS NULL OR e.namespace = filter_namespace)
    ORDER BY e.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA timeseries TO katalyst;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA vectors TO katalyst;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA analytics TO katalyst;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA timeseries TO katalyst;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA vectors TO katalyst;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA analytics TO katalyst;