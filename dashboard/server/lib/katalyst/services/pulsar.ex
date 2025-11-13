defmodule Katalyst.Services.Pulsar do
  @moduledoc """
  Apache Pulsar service for distributed messaging and event streaming.
  Provides pub/sub, queuing, and streaming capabilities.
  """
  
  use GenServer
  require Logger
  
  @default_tenant "public"
  @default_namespace "default"
  @producer_pool_size 5
  @consumer_pool_size 10
  
  # Client API
  
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end
  
  @doc """
  Produce a message to a topic
  """
  def produce(topic, message, opts \\ []) do
    GenServer.call(__MODULE__, {:produce, topic, message, opts})
  end
  
  @doc """
  Produce messages in batch
  """
  def produce_batch(topic, messages, opts \\ []) when is_list(messages) do
    GenServer.call(__MODULE__, {:produce_batch, topic, messages, opts})
  end
  
  @doc """
  Subscribe to a topic with a consumer
  """
  def subscribe(topic, subscription_name, handler, opts \\ []) do
    GenServer.call(__MODULE__, {:subscribe, topic, subscription_name, handler, opts})
  end
  
  @doc """
  Create a reader for a topic (no subscription tracking)
  """
  def create_reader(topic, start_message_id \\ :earliest, handler \\ nil) do
    GenServer.call(__MODULE__, {:create_reader, topic, start_message_id, handler})
  end
  
  @doc """
  Acknowledge message processing
  """
  def ack(consumer_id, message_id) do
    GenServer.call(__MODULE__, {:ack, consumer_id, message_id})
  end
  
  @doc """
  Negative acknowledge (triggers redelivery)
  """
  def nack(consumer_id, message_id) do
    GenServer.call(__MODULE__, {:nack, consumer_id, message_id})
  end
  
  @doc """
  Create a topic with specific configuration
  """
  def create_topic(topic, opts \\ []) do
    GenServer.call(__MODULE__, {:create_topic, topic, opts})
  end
  
  @doc """
  Delete a topic
  """
  def delete_topic(topic) do
    GenServer.call(__MODULE__, {:delete_topic, topic})
  end
  
  @doc """
  Get topic statistics
  """
  def topic_stats(topic) do
    GenServer.call(__MODULE__, {:topic_stats, topic})
  end
  
  @doc """
  List all topics in a namespace
  """
  def list_topics(tenant \\ @default_tenant, namespace \\ @default_namespace) do
    GenServer.call(__MODULE__, {:list_topics, tenant, namespace})
  end
  
  @doc """
  Create a partitioned topic
  """
  def create_partitioned_topic(topic, num_partitions) do
    GenServer.call(__MODULE__, {:create_partitioned_topic, topic, num_partitions})
  end
  
  @doc """
  SQL query on Pulsar (Pulsar SQL/Presto)
  """
  def sql_query(query) do
    GenServer.call(__MODULE__, {:sql_query, query})
  end
  
  @doc """
  Create a function (Pulsar Functions)
  """
  def deploy_function(name, function_config) do
    GenServer.call(__MODULE__, {:deploy_function, name, function_config})
  end
  
  @doc """
  Schema registry operations
  """
  def register_schema(topic, schema, schema_type \\ "AVRO") do
    GenServer.call(__MODULE__, {:register_schema, topic, schema, schema_type})
  end
  
  def get_schema(topic) do
    GenServer.call(__MODULE__, {:get_schema, topic})
  end
  
  # Server callbacks
  
  @impl true
  def init(opts) do
    pulsar_url = Keyword.get(opts, :url, "pulsar://localhost:6650")
    admin_url = Keyword.get(opts, :admin_url, "http://localhost:8080")
    
    state = %{
      pulsar_url: pulsar_url,
      admin_url: admin_url,
      producers: %{},
      consumers: %{},
      readers: %{},
      subscriptions: %{},
      schemas: %{}
    }
    
    # Initialize connection pools
    {:ok, _} = init_producer_pool(state)
    {:ok, _} = init_consumer_pool(state)
    
    {:ok, state}
  end
  
  @impl true
  def handle_call({:produce, topic, message, opts}, _from, state) do
    result = produce_message(topic, message, opts, state)
    {:reply, result, state}
  end
  
  @impl true
  def handle_call({:produce_batch, topic, messages, opts}, _from, state) do
    results = Enum.map(messages, fn msg ->
      produce_message(topic, msg, opts, state)
    end)
    
    {:reply, {:ok, results}, state}
  end
  
  @impl true
  def handle_call({:subscribe, topic, subscription_name, handler, opts}, _from, state) do
    subscription_type = Keyword.get(opts, :type, :exclusive)
    initial_position = Keyword.get(opts, :initial_position, :latest)
    
    consumer_config = %{
      topic: normalize_topic(topic),
      subscription: subscription_name,
      subscription_type: subscription_type,
      initial_position: initial_position,
      handler: handler
    }
    
    case create_consumer(consumer_config, state) do
      {:ok, consumer_id} ->
        new_state = put_in(state.consumers[consumer_id], consumer_config)
        spawn_consumer_loop(consumer_id, handler)
        {:reply, {:ok, consumer_id}, new_state}
      
      error ->
        {:reply, error, state}
    end
  end
  
  @impl true
  def handle_call({:create_topic, topic, opts}, _from, state) do
    normalized_topic = normalize_topic(topic)
    
    body = %{
      "replicationClusters" => Keyword.get(opts, :replication_clusters, ["standalone"]),
      "numPartitions" => Keyword.get(opts, :partitions, 1),
      "retentionPolicies" => Keyword.get(opts, :retention, default_retention()),
      "schemaCompatibilityStrategy" => Keyword.get(opts, :schema_compatibility, "FULL")
    }
    
    url = "#{state.admin_url}/admin/v2/persistent/#{normalized_topic}"
    
    case HTTPoison.put(url, Jason.encode!(body), [{"Content-Type", "application/json"}]) do
      {:ok, %{status_code: code}} when code in [200, 204] ->
        {:reply, :ok, state}
      
      {:ok, %{status_code: 409}} ->
        {:reply, {:error, :topic_exists}, state}
      
      error ->
        {:reply, {:error, error}, state}
    end
  end
  
  @impl true
  def handle_call({:topic_stats, topic}, _from, state) do
    normalized_topic = normalize_topic(topic)
    url = "#{state.admin_url}/admin/v2/persistent/#{normalized_topic}/stats"
    
    case HTTPoison.get(url) do
      {:ok, %{status_code: 200, body: body}} ->
        {:reply, Jason.decode(body), state}
      
      error ->
        {:reply, {:error, error}, state}
    end
  end
  
  @impl true
  def handle_call({:register_schema, topic, schema, schema_type}, _from, state) do
    normalized_topic = normalize_topic(topic)
    
    schema_data = %{
      "type" => schema_type,
      "schema" => Base.encode64(schema),
      "properties" => %{}
    }
    
    url = "#{state.admin_url}/admin/v2/schemas/#{normalized_topic}/schema"
    
    case HTTPoison.post(url, Jason.encode!(schema_data), [{"Content-Type", "application/json"}]) do
      {:ok, %{status_code: code}} when code in [200, 202] ->
        new_state = put_in(state.schemas[topic], schema_data)
        {:reply, :ok, new_state}
      
      error ->
        {:reply, {:error, error}, state}
    end
  end
  
  @impl true
  def handle_call({:sql_query, query}, _from, state) do
    # This would integrate with Pulsar SQL/Presto
    # Simplified mock implementation
    {:reply, {:ok, %{query: query, results: []}}, state}
  end
  
  @impl true
  def handle_call({:deploy_function, name, config}, _from, state) do
    # Deploy a Pulsar Function
    url = "#{state.admin_url}/admin/v3/functions/#{@default_tenant}/#{@default_namespace}/#{name}"
    
    function_config = Map.merge(default_function_config(), config)
    
    case HTTPoison.post(url, Jason.encode!(function_config), [{"Content-Type", "application/json"}]) do
      {:ok, %{status_code: code}} when code in [200, 202] ->
        {:reply, {:ok, name}, state}
      
      error ->
        {:reply, {:error, error}, state}
    end
  end
  
  # Helper functions
  
  defp init_producer_pool(state) do
    # Initialize producer connection pool
    # In production, use actual Pulsar client library
    {:ok, :producer_pool_initialized}
  end
  
  defp init_consumer_pool(state) do
    # Initialize consumer connection pool
    {:ok, :consumer_pool_initialized}
  end
  
  defp produce_message(topic, message, opts, state) do
    normalized_topic = normalize_topic(topic)
    
    # Message preparation
    payload = prepare_message(message, opts)
    
    # In production, use actual Pulsar producer
    # This is a simplified mock
    message_id = generate_message_id()
    
    Logger.debug("Producing message to #{normalized_topic}: #{inspect(payload)}")
    
    {:ok, %{message_id: message_id, topic: normalized_topic}}
  end
  
  defp create_consumer(config, state) do
    # In production, create actual Pulsar consumer
    consumer_id = generate_consumer_id()
    {:ok, consumer_id}
  end
  
  defp spawn_consumer_loop(consumer_id, handler) do
    spawn(fn ->
      consumer_loop(consumer_id, handler)
    end)
  end
  
  defp consumer_loop(consumer_id, handler) do
    # Simplified consumer loop
    # In production, poll messages from Pulsar
    receive do
      {:message, message} ->
        case handler.(message) do
          :ok -> 
            ack(consumer_id, message.id)
          :error ->
            nack(consumer_id, message.id)
        end
        consumer_loop(consumer_id, handler)
      
      :stop ->
        :ok
    end
  end
  
  defp normalize_topic(topic) do
    case String.split(topic, "/") do
      [_persistent_or_non, _tenant, _namespace, _name] = parts ->
        Enum.join(parts, "/")
      
      [name] ->
        "persistent/#{@default_tenant}/#{@default_namespace}/#{name}"
      
      _ ->
        topic
    end
  end
  
  defp prepare_message(message, opts) do
    %{
      payload: encode_payload(message),
      properties: Keyword.get(opts, :properties, %{}),
      event_time: Keyword.get(opts, :event_time, System.system_time(:millisecond)),
      key: Keyword.get(opts, :key),
      ordering_key: Keyword.get(opts, :ordering_key),
      replication_clusters: Keyword.get(opts, :replication_to, [])
    }
  end
  
  defp encode_payload(payload) when is_binary(payload), do: payload
  defp encode_payload(payload), do: Jason.encode!(payload)
  
  defp generate_message_id do
    "msg-#{System.unique_integer([:positive, :monotonic])}"
  end
  
  defp generate_consumer_id do
    "consumer-#{System.unique_integer([:positive, :monotonic])}"
  end
  
  defp default_retention do
    %{
      "retentionTimeInMinutes" => 60 * 24 * 7, # 1 week
      "retentionSizeInMB" => 1024 # 1GB
    }
  end
  
  defp default_function_config do
    %{
      "runtime" => "JAVA",
      "autoAck" => true,
      "parallelism" => 1,
      "resources" => %{
        "cpu" => 1,
        "ram" => 1073741824, # 1GB
        "disk" => 1073741824  # 1GB
      }
    }
  end
end