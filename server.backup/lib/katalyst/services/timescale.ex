defmodule Katalyst.Services.Timescale do
  @moduledoc """
  TimescaleDB service for time-series data and vector operations.
  """
  
  import Ecto.Query
  alias Katalyst.Repo
  alias Ecto.Adapters.SQL
  
  @vector_dimension 1536 # OpenAI ada-002 dimension
  
  @doc """
  Insert time-series metric data
  """
  def insert_metric(metric_name, value, tags \\ %{}, metadata \\ %{}) do
    SQL.query!(
      Repo,
      """
      INSERT INTO timeseries.metrics (time, metric_name, value, tags, metadata)
      VALUES (NOW(), $1, $2, $3, $4)
      """,
      [metric_name, value, Jason.encode!(tags), Jason.encode!(metadata)]
    )
  end
  
  @doc """
  Query time-series data with time bucketing
  """
  def query_metrics(metric_name, interval \\ "1 hour", time_range \\ "24 hours") do
    SQL.query!(
      Repo,
      """
      SELECT 
        time_bucket($1::interval, time) AS bucket,
        AVG(value) as avg_value,
        MAX(value) as max_value,
        MIN(value) as min_value,
        COUNT(*) as count
      FROM timeseries.metrics
      WHERE metric_name = $2
        AND time > NOW() - $3::interval
      GROUP BY bucket
      ORDER BY bucket DESC
      """,
      [interval, metric_name, time_range]
    )
  end
  
  @doc """
  Store vector embedding with metadata
  """
  def store_embedding(content, embedding, metadata \\ %{}, namespace \\ "default") do
    embedding_string = "[#{Enum.join(embedding, ",")}]"
    
    SQL.query!(
      Repo,
      """
      INSERT INTO vectors.embeddings (content, embedding, metadata, namespace)
      VALUES ($1, $2::vector, $3, $4)
      RETURNING id
      """,
      [content, embedding_string, Jason.encode!(metadata), namespace]
    )
  end
  
  @doc """
  Search for similar vectors using cosine similarity
  """
  def search_similar(query_embedding, opts \\ []) do
    limit = Keyword.get(opts, :limit, 10)
    namespace = Keyword.get(opts, :namespace, nil)
    threshold = Keyword.get(opts, :threshold, 0.0)
    
    embedding_string = "[#{Enum.join(query_embedding, ",")}]"
    
    query = """
    SELECT 
      id,
      content,
      1 - (embedding <=> $1::vector) AS similarity,
      metadata
    FROM vectors.embeddings
    WHERE 1 - (embedding <=> $1::vector) > $2
    """
    
    query = if namespace do
      query <> " AND namespace = $4"
    else
      query
    end
    
    query = query <> """
    ORDER BY embedding <=> $1::vector
    LIMIT $3
    """
    
    params = if namespace do
      [embedding_string, threshold, limit, namespace]
    else
      [embedding_string, threshold, limit]
    end
    
    SQL.query!(Repo, query, params)
  end
  
  @doc """
  Create a continuous aggregate for real-time analytics
  """
  def create_continuous_aggregate(name, query, refresh_interval \\ "1 minute") do
    SQL.query!(
      Repo,
      """
      CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.#{name}
      WITH (timescaledb.continuous) AS
      #{query}
      WITH NO DATA
      """,
      []
    )
    
    SQL.query!(
      Repo,
      """
      SELECT add_continuous_aggregate_policy('analytics.#{name}',
        start_offset => INTERVAL '2 hours',
        end_offset => INTERVAL '1 minute',
        schedule_interval => INTERVAL '#{refresh_interval}',
        if_not_exists => TRUE
      )
      """,
      []
    )
  end
  
  @doc """
  Insert an event for real-time processing
  """
  def insert_event(event_type, source, data) do
    SQL.query!(
      Repo,
      """
      INSERT INTO timeseries.events (event_type, source, data)
      VALUES ($1, $2, $3)
      RETURNING id, time
      """,
      [event_type, source, Jason.encode!(data)]
    )
  end
  
  @doc """
  Get compression status for hypertables
  """
  def compression_status do
    SQL.query!(
      Repo,
      """
      SELECT 
        hypertable_name,
        compression_status,
        uncompressed_size,
        compressed_size,
        compression_ratio
      FROM timescaledb_information.compression_settings cs
      JOIN timescaledb_information.hypertable h 
        ON cs.hypertable_name = h.table_name
      """,
      []
    )
  end
  
  @doc """
  Perform vector aggregation operations
  """
  def vector_centroid(namespace) do
    SQL.query!(
      Repo,
      """
      SELECT AVG(embedding)::vector AS centroid
      FROM vectors.embeddings
      WHERE namespace = $1
      """,
      [namespace]
    )
  end
  
  @doc """
  Real-time data ingestion with batching
  """
  def batch_insert_metrics(metrics) when is_list(metrics) do
    values = Enum.map(metrics, fn m ->
      "(NOW(), '#{m.name}', #{m.value}, '#{Jason.encode!(m.tags)}', '#{Jason.encode!(m.metadata)}')"
    end)
    |> Enum.join(", ")
    
    SQL.query!(
      Repo,
      """
      INSERT INTO timeseries.metrics (time, metric_name, value, tags, metadata)
      VALUES #{values}
      """,
      []
    )
  end
end