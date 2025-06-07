import { createQuery } from '@tanstack/solid-query';
import { createSignal } from 'solid-js';

export function TanstackIntegration() {
  const [docId, setDocId] = createSignal(1);

  const docQuery = createQuery(() => ({
    queryKey: ['documentation', docId()],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        id: docId(),
        title: `Documentation Section ${docId()}`,
        content: `This is the content for documentation section ${docId()}. Demonstrating Tanstack Query in Astro static docs.`,
        category: 'Framework Guide',
        lastUpdated: new Date().toISOString(),
        tags: ['SolidJS', 'Astro', 'Tanstack', 'SSE', 'Documentation'],
      };
    },
  }));

  return (
    <div class="p-6 border rounded-lg">
      <h3 class="text-xl font-semibold mb-4">Dynamic Documentation (Tanstack Query)</h3>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Select Documentation Section:</label>
        <select
          value={docId()}
          onChange={(e) => setDocId(Number(e.target.value))}
          class="border rounded px-3 py-1"
        >
          <option value={1}>Getting Started</option>
          <option value={2}>API Reference</option>
          <option value={3}>Advanced Topics</option>
          <option value={4}>Examples</option>
          <option value={5}>Troubleshooting</option>
        </select>
      </div>

      {docQuery.isLoading && <p>Loading documentation...</p>}
      {docQuery.error && <p class="text-red-500">Error loading documentation</p>}
      {docQuery.data && (
        <article class="bg-gray-50 p-4 rounded">
          <h4 class="text-lg font-semibold mb-2">{docQuery.data.title}</h4>
          <p class="text-gray-700 mb-3">{docQuery.data.content}</p>
          <div class="text-sm text-gray-600">
            <p>Category: {docQuery.data.category}</p>
            <p>Last Updated: {new Date(docQuery.data.lastUpdated).toLocaleDateString()}</p>
            <div class="mt-2">
              <span class="font-medium">Tags: </span>
              {docQuery.data.tags.map((tag, index) => (
                <span class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-1">
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
