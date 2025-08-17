defmodule Katalyst.Cloudflare.Vectorize do
  @moduledoc """
  Cloudflare Vectorize client for vector database operations.
  Replaces pgvector for embeddings and similarity search.
  """
  
  require Logger
  alias Katalyst.Cloudflare.API
  
  @doc """
  Insert vectors into an index
  """
  def insert(index_name, vectors) when is_list(vectors) do
    body = %{
      vectors: Enum.map(vectors, fn v ->
        %{
          id: v.id || UUID.uuid4(),
          values: v.values,
          metadata: v.metadata || %{},
          namespace: v.namespace || "default"
        }
      end)
    }
    
    API.post("/accounts/#{account_id()}/vectorize/indexes/#{index_name}/insert", body)
  end
  
  @doc """
  Query vectors by similarity
  """
  def query(index_name, vector, opts \\ []) do
    top_k = Keyword.get(opts, :top_k, 10)
    filter = Keyword.get(opts, :filter, %{})
    return_values = Keyword.get(opts, :return_values, false)
    return_metadata = Keyword.get(opts, :return_metadata, true)
    
    body = %{
      vector: vector,
      topK: top_k,
      filter: filter,
      returnValues: return_values,
      returnMetadata: return_metadata
    }
    
    case API.post("/accounts/#{account_id()}/vectorize/indexes/#{index_name}/query", body) do
      {:ok, %{"result" => %{"matches" => matches}}} ->
        {:ok, matches}
      error ->
        Logger.error("Vectorize query failed: #{inspect(error)}")
        error
    end
  end
  
  @doc """
  Query by vector ID
  """
  def get_by_ids(index_name, ids) when is_list(ids) do
    body = %{ids: ids}
    API.post("/accounts/#{account_id()}/vectorize/indexes/#{index_name}/get", body)
  end
  
  @doc """
  Delete vectors by ID
  """
  def delete(index_name, ids) when is_list(ids) do
    body = %{ids: ids}
    API.post("/accounts/#{account_id()}/vectorize/indexes/#{index_name}/delete", body)
  end
  
  @doc """
  Update vector metadata
  """
  def update_metadata(index_name, id, metadata) do
    body = %{
      vectors: [
        %{
          id: id,
          metadata: metadata
        }
      ]
    }
    API.post("/accounts/#{account_id()}/vectorize/indexes/#{index_name}/upsert", body)
  end
  
  @doc """
  Store text embeddings with automatic vectorization
  """
  def store_text_embedding(index_name, text, metadata \\ %{}) do
    # Get embedding from Cloudflare AI
    case get_text_embedding(text) do
      {:ok, embedding} ->
        insert(index_name, [
          %{
            id: UUID.uuid4(),
            values: embedding,
            metadata: Map.merge(metadata, %{
              "text" => text,
              "created_at" => DateTime.utc_now() |> DateTime.to_iso8601()
            })
          }
        ])
      error ->
        error
    end
  end
  
  @doc """
  Search similar texts
  """
  def search_similar_texts(index_name, query_text, opts \\ []) do
    case get_text_embedding(query_text) do
      {:ok, embedding} ->
        query(index_name, embedding, opts)
      error ->
        error
    end
  end
  
  @doc """
  Create a new Vectorize index
  """
  def create_index(name, dimensions, opts \\ []) do
    metric = Keyword.get(opts, :metric, "cosine")
    description = Keyword.get(opts, :description, "")
    
    body = %{
      name: name,
      dimensions: dimensions,
      metric: metric,
      description: description
    }
    
    API.post("/accounts/#{account_id()}/vectorize/indexes", body)
  end
  
  @doc """
  Get index information
  """
  def get_index(index_name) do
    API.get("/accounts/#{account_id()}/vectorize/indexes/#{index_name}")
  end
  
  @doc """
  List all indexes
  """
  def list_indexes do
    API.get("/accounts/#{account_id()}/vectorize/indexes")
  end
  
  @doc """
  Delete an index
  """
  def delete_index(index_name) do
    API.delete("/accounts/#{account_id()}/vectorize/indexes/#{index_name}")
  end
  
  # Private functions
  
  defp get_text_embedding(text) do
    # Use Cloudflare AI to generate embeddings
    Katalyst.Cloudflare.AI.text_embeddings(text)
  end
  
  defp account_id do
    Application.get_env(:katalyst, :cloudflare_account_id)
  end
end