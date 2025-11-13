defmodule Katalyst.Services.Dragonfly do
  @moduledoc """
  DragonflyDB service for high-performance caching and real-time data operations.
  Compatible with Redis protocol but with enhanced performance.
  """
  
  use GenServer
  require Logger
  
  @pool_size 10
  @default_ttl 3600 # 1 hour
  
  # Client API
  
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end
  
  @doc """
  Get a value from cache
  """
  def get(key) when is_binary(key) do
    GenServer.call(__MODULE__, {:get, key})
  end
  
  @doc """
  Set a value in cache with optional TTL
  """
  def set(key, value, ttl \\ @default_ttl) when is_binary(key) do
    GenServer.call(__MODULE__, {:set, key, value, ttl})
  end
  
  @doc """
  Delete a key from cache
  """
  def delete(key) when is_binary(key) do
    GenServer.call(__MODULE__, {:delete, key})
  end
  
  @doc """
  Set multiple keys at once (MSET)
  """
  def set_many(key_value_pairs) when is_list(key_value_pairs) do
    GenServer.call(__MODULE__, {:set_many, key_value_pairs})
  end
  
  @doc """
  Get multiple keys at once (MGET)
  """
  def get_many(keys) when is_list(keys) do
    GenServer.call(__MODULE__, {:get_many, keys})
  end
  
  @doc """
  Increment a counter
  """
  def incr(key, amount \\ 1) when is_binary(key) do
    GenServer.call(__MODULE__, {:incr, key, amount})
  end
  
  @doc """
  Add to a set
  """
  def sadd(key, members) when is_binary(key) and is_list(members) do
    GenServer.call(__MODULE__, {:sadd, key, members})
  end
  
  @doc """
  Get all members of a set
  """
  def smembers(key) when is_binary(key) do
    GenServer.call(__MODULE__, {:smembers, key})
  end
  
  @doc """
  Push to a list
  """
  def lpush(key, values) when is_binary(key) and is_list(values) do
    GenServer.call(__MODULE__, {:lpush, key, values})
  end
  
  @doc """
  Get range from a list
  """
  def lrange(key, start, stop) when is_binary(key) do
    GenServer.call(__MODULE__, {:lrange, key, start, stop})
  end
  
  @doc """
  Sorted set operations
  """
  def zadd(key, score_member_pairs) when is_binary(key) do
    GenServer.call(__MODULE__, {:zadd, key, score_member_pairs})
  end
  
  def zrange(key, start, stop, opts \\ []) when is_binary(key) do
    GenServer.call(__MODULE__, {:zrange, key, start, stop, opts})
  end
  
  @doc """
  Pub/Sub operations for real-time messaging
  """
  def publish(channel, message) when is_binary(channel) do
    GenServer.call(__MODULE__, {:publish, channel, message})
  end
  
  def subscribe(channel, callback) when is_binary(channel) do
    GenServer.call(__MODULE__, {:subscribe, channel, callback})
  end
  
  @doc """
  HyperLogLog for cardinality estimation
  """
  def pfadd(key, elements) when is_binary(key) and is_list(elements) do
    GenServer.call(__MODULE__, {:pfadd, key, elements})
  end
  
  def pfcount(keys) when is_list(keys) do
    GenServer.call(__MODULE__, {:pfcount, keys})
  end
  
  @doc """
  Geospatial operations
  """
  def geoadd(key, longitude, latitude, member) do
    GenServer.call(__MODULE__, {:geoadd, key, longitude, latitude, member})
  end
  
  def georadius(key, longitude, latitude, radius, unit \\ "km") do
    GenServer.call(__MODULE__, {:georadius, key, longitude, latitude, radius, unit})
  end
  
  @doc """
  Stream operations for event sourcing
  """
  def xadd(stream, fields, id \\ "*") do
    GenServer.call(__MODULE__, {:xadd, stream, fields, id})
  end
  
  def xread(streams, opts \\ []) do
    GenServer.call(__MODULE__, {:xread, streams, opts})
  end
  
  @doc """
  Cache invalidation patterns
  """
  def invalidate_pattern(pattern) when is_binary(pattern) do
    GenServer.call(__MODULE__, {:invalidate_pattern, pattern})
  end
  
  @doc """
  Get cache statistics
  """
  def stats do
    GenServer.call(__MODULE__, :stats)
  end
  
  # Server callbacks
  
  @impl true
  def init(opts) do
    # Initialize connection pool
    pool_config = [
      name: {:local, :dragonfly_pool},
      worker_module: Redix,
      size: Keyword.get(opts, :pool_size, @pool_size),
      max_overflow: 5
    ]
    
    worker_config = [
      host: Keyword.get(opts, :host, "localhost"),
      port: Keyword.get(opts, :port, 6379),
      database: Keyword.get(opts, :database, 0),
      socket_opts: [:inet6]
    ]
    
    children = [
      :poolboy.child_spec(:dragonfly_pool, pool_config, worker_config)
    ]
    
    Supervisor.start_link(children, strategy: :one_for_one)
    
    {:ok, %{pool: :dragonfly_pool, subscriptions: %{}}}
  end
  
  @impl true
  def handle_call({:get, key}, _from, state) do
    result = :poolboy.transaction(state.pool, fn worker ->
      Redix.command(worker, ["GET", key])
    end)
    
    {:reply, result, state}
  end
  
  @impl true
  def handle_call({:set, key, value, ttl}, _from, state) do
    encoded = encode_value(value)
    
    result = :poolboy.transaction(state.pool, fn worker ->
      if ttl do
        Redix.command(worker, ["SETEX", key, ttl, encoded])
      else
        Redix.command(worker, ["SET", key, encoded])
      end
    end)
    
    {:reply, result, state}
  end
  
  @impl true
  def handle_call({:delete, key}, _from, state) do
    result = :poolboy.transaction(state.pool, fn worker ->
      Redix.command(worker, ["DEL", key])
    end)
    
    {:reply, result, state}
  end
  
  @impl true
  def handle_call({:set_many, key_value_pairs}, _from, state) do
    flattened = Enum.flat_map(key_value_pairs, fn {k, v} ->
      [k, encode_value(v)]
    end)
    
    result = :poolboy.transaction(state.pool, fn worker ->
      Redix.command(worker, ["MSET" | flattened])
    end)
    
    {:reply, result, state}
  end
  
  @impl true
  def handle_call({:get_many, keys}, _from, state) do
    result = :poolboy.transaction(state.pool, fn worker ->
      case Redix.command(worker, ["MGET" | keys]) do
        {:ok, values} ->
          {:ok, Enum.map(values, &decode_value/1)}
        error ->
          error
      end
    end)
    
    {:reply, result, state}
  end
  
  @impl true
  def handle_call({:incr, key, amount}, _from, state) do
    result = :poolboy.transaction(state.pool, fn worker ->
      Redix.command(worker, ["INCRBY", key, amount])
    end)
    
    {:reply, result, state}
  end
  
  @impl true
  def handle_call({:zadd, key, score_member_pairs}, _from, state) do
    args = Enum.flat_map(score_member_pairs, fn {score, member} ->
      [to_string(score), encode_value(member)]
    end)
    
    result = :poolboy.transaction(state.pool, fn worker ->
      Redix.command(worker, ["ZADD", key | args])
    end)
    
    {:reply, result, state}
  end
  
  @impl true
  def handle_call({:invalidate_pattern, pattern}, _from, state) do
    result = :poolboy.transaction(state.pool, fn worker ->
      case Redix.command(worker, ["KEYS", pattern]) do
        {:ok, keys} when keys != [] ->
          Redix.command(worker, ["DEL" | keys])
        {:ok, []} ->
          {:ok, 0}
        error ->
          error
      end
    end)
    
    {:reply, result, state}
  end
  
  @impl true
  def handle_call(:stats, _from, state) do
    result = :poolboy.transaction(state.pool, fn worker ->
      with {:ok, info} <- Redix.command(worker, ["INFO", "stats"]),
           {:ok, memory} <- Redix.command(worker, ["INFO", "memory"]) do
        {:ok, %{stats: info, memory: memory}}
      end
    end)
    
    {:reply, result, state}
  end
  
  @impl true
  def handle_call(request, _from, state) do
    Logger.warn("Unhandled call: #{inspect(request)}")
    {:reply, {:error, :not_implemented}, state}
  end
  
  # Helper functions
  
  defp encode_value(value) when is_binary(value), do: value
  defp encode_value(value), do: Jason.encode!(value)
  
  defp decode_value(nil), do: nil
  defp decode_value(value) do
    case Jason.decode(value) do
      {:ok, decoded} -> decoded
      {:error, _} -> value
    end
  end
end