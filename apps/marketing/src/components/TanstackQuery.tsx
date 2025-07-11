import { createResource, For, Show } from 'solid-js';
import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function TanstackQuery() {
  const [posts] = createResource<Post[]>(fetchPosts);

  return (
    <div
      class={css({ padding: '4', borderRadius: 'md', bg: 'gray.50', _dark: { bg: 'gray.800' } })}
    >
      <h2 class={css({ fontSize: '2xl', fontWeight: 'bold', mb: '4', color: 'emerald.500' })}>
        Tanstack Query Example
      </h2>

      <Show when={posts.loading}>
        <div class={css({ p: '4', textAlign: 'center' })}>Loading posts...</div>
      </Show>

      <Show when={posts.error}>
        <div class={css({ p: '4', color: 'red.500' })}>Error: {posts.error?.message}</div>
      </Show>

      <Show when={!posts.loading && !posts.error}>
        <div class={flex({ direction: 'column', gap: '3' })}>
          <For each={posts()?.slice(0, 5)}>
            {(post) => (
              <div
                class={css({
                  p: '3',
                  borderRadius: 'md',
                  bg: 'white',
                  _dark: { bg: 'gray.700' },
                  boxShadow: 'sm',
                })}
              >
                <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold', mb: '2' })}>
                  {post.title}
                </h3>
                <p class={css({ fontSize: 'sm', color: 'gray.600', _dark: { color: 'gray.300' } })}>
                  {post.body}
                </p>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
