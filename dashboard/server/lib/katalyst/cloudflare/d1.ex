defmodule Katalyst.Cloudflare.D1 do
  @moduledoc """
  Cloudflare D1 Database client for SQLite at the edge.
  Replaces TimescaleDB for time-series and SQL data.
  """
  
  require Logger
  alias Katalyst.Cloudflare.API
  
  @base_url "https://api.cloudflare.com/client/v4"
  
  @doc """
  Execute a query on D1 database
  """
  def query(database_id, sql, params \\ []) do
    body = %{
      sql: sql,
      params: params
    }
    
    case API.post("/accounts/#{account_id()}/d1/database/#{database_id}/query", body) do
      {:ok, %{"result" => result}} ->
        {:ok, result}
      error ->
        Logger.error("D1 query failed: #{inspect(error)}")
        error
    end
  end
  
  @doc """
  Execute multiple queries in a transaction
  """
  def transaction(database_id, queries) when is_list(queries) do
    body = %{
      batch: Enum.map(queries, fn {sql, params} ->
        %{sql: sql, params: params || []}
      end)
    }
    
    API.post("/accounts/#{account_id()}/d1/database/#{database_id}/batch", body)
  end
  
  @doc """
  Insert time-series metric data
  """
  def insert_metric(database_id, metric_name, value, tags \\ %{}, metadata \\ %{}) do
    sql = """
    INSERT INTO metrics (time, metric_name, value, tags, metadata)
    VALUES (?, ?, ?, ?, ?)
    """
    
    params = [
      System.system_time(:millisecond),
      metric_name,
      value,
      Jason.encode!(tags),
      Jason.encode!(metadata)
    ]
    
    query(database_id, sql, params)
  end
  
  @doc """
  Query time-series data with time bucketing
  """
  def query_metrics(database_id, metric_name, opts \\ []) do
    bucket_size = Keyword.get(opts, :bucket_size, 60) # seconds
    time_range = Keyword.get(opts, :time_range, 3600) # seconds
    
    sql = """
    SELECT 
      (time / (? * 1000)) * (? * 1000) as bucket,
      AVG(value) as avg_value,
      MAX(value) as max_value,
      MIN(value) as min_value,
      COUNT(*) as count
    FROM metrics
    WHERE metric_name = ?
      AND time > (strftime('%s', 'now') * 1000 - ? * 1000)
    GROUP BY bucket
    ORDER BY bucket DESC
    """
    
    params = [bucket_size, bucket_size, metric_name, time_range]
    query(database_id, sql, params)
  end
  
  @doc """
  Create or update aggregate data
  """
  def upsert_aggregate(database_id, metric_name, bucket_time, bucket_size, stats) do
    sql = """
    INSERT INTO aggregates (
      bucket_time, bucket_size, metric_name,
      avg_value, max_value, min_value, sum_value, count,
      percentile_50, percentile_95, percentile_99
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(bucket_time, bucket_size, metric_name) 
    DO UPDATE SET
      avg_value = excluded.avg_value,
      max_value = excluded.max_value,
      min_value = excluded.min_value,
      sum_value = excluded.sum_value,
      count = excluded.count,
      percentile_50 = excluded.percentile_50,
      percentile_95 = excluded.percentile_95,
      percentile_99 = excluded.percentile_99
    """
    
    params = [
      bucket_time,
      bucket_size,
      metric_name,
      stats.avg,
      stats.max,
      stats.min,
      stats.sum,
      stats.count,
      stats.p50,
      stats.p95,
      stats.p99
    ]
    
    query(database_id, sql, params)
  end
  
  @doc """
  Store event data
  """
  def insert_event(database_id, event) do
    sql = """
    INSERT INTO events (event_id, time, event_type, source, data)
    VALUES (?, ?, ?, ?, ?)
    """
    
    params = [
      event.id || UUID.uuid4(),
      event.time || System.system_time(:millisecond),
      event.type,
      event.source,
      Jason.encode!(event.data)
    ]
    
    query(database_id, sql, params)
  end
  
  @doc """
  Get unprocessed events
  """
  def get_pending_events(database_id, limit \\ 100) do
    sql = """
    SELECT * FROM events
    WHERE processed = 0
    ORDER BY time ASC
    LIMIT ?
    """
    
    query(database_id, sql, [limit])
  end
  
  @doc """
  Mark events as processed
  """
  def mark_events_processed(database_id, event_ids) when is_list(event_ids) do
    placeholders = Enum.map(event_ids, fn _ -> "?" end) |> Enum.join(",")
    
    sql = """
    UPDATE events
    SET processed = 1,
        processing_time_ms = strftime('%s', 'now') * 1000 - time
    WHERE event_id IN (#{placeholders})
    """
    
    query(database_id, sql, event_ids)
  end
  
  @doc """
  Run database migration
  """
  def migrate(database_id, migration_sql) do
    # Split migration into individual statements
    statements = String.split(migration_sql, ";")
    |> Enum.map(&String.trim/1)
    |> Enum.filter(&(&1 != ""))
    
    queries = Enum.map(statements, fn sql ->
      {sql <> ";", []}
    end)
    
    transaction(database_id, queries)
  end
  
  @doc """
  Get database info and statistics
  """
  def get_info(database_id) do
    API.get("/accounts/#{account_id()}/d1/database/#{database_id}")
  end
  
  @doc """
  Create a new D1 database
  """
  def create_database(name) do
    body = %{name: name}
    API.post("/accounts/#{account_id()}/d1/database", body)
  end
  
  @doc """
  List all D1 databases
  """
  def list_databases do
    API.get("/accounts/#{account_id()}/d1/database")
  end
  
  # Helper functions
  
  defp account_id do
    Application.get_env(:katalyst, :cloudflare_account_id)
  end
end