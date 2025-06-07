import { createSignal } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';

export function TanstackIntegration() {
  const [postId, setPostId] = createSignal(1);
  
  const postQuery = createQuery(() => ({
    queryKey: ['blog-post', postId()],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        id: postId(),
        title: `Blog Post ${postId()}`,
        content: `This is the content for blog post ${postId()}. Demonstrating Tanstack Query in Astro dynamic blog.`,
        author: 'SSE Framework',
        publishedAt: new Date().toISOString(),
        tags: ['SolidJS', 'Astro', 'Tanstack', 'SSE']
      };
    },
  }));

  return (
    <div class="p-6 border rounded-lg">
      <h3 class="text-xl font-semibold mb-4">Dynamic Blog Content (Tanstack Query)</h3>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Select Post ID:</label>
        <select
          value={postId()}
          onChange={(e) => setPostId(Number(e.target.value))}
          class="border rounded px-3 py-1"
        >
          <option value={1}>Post 1</option>
          <option value={2}>Post 2</option>
          <option value={3}>Post 3</option>
        </select>
      </div>

      {postQuery.isLoading && <p>Loading post...</p>}
      {postQuery.error && <p class="text-red-500">Error loading post</p>}
      {postQuery.data && (
        <article class="bg-gray-50 p-4 rounded">
          <h4 class="text-lg font-semibold mb-2">{postQuery.data.title}</h4>
          <p class="text-gray-700 mb-3">{postQuery.data.content}</p>
          <div class="text-sm text-gray-600">
            <p>By: {postQuery.data.author}</p>
            <p>Published: {new Date(postQuery.data.publishedAt).toLocaleDateString()}</p>
            <div class="mt-2">
              <span class="font-medium">Tags: </span>
              {postQuery.data.tags.map((tag, index) => (
                <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
