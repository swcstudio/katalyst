<script lang="ts">
import { authStore } from 'shared/adapters';
import { onMount } from 'svelte';

let mounted = false;

onMount(() => {
  mounted = true;
});
</script>

<svelte:head>
  <title>SvelteKit SPA - SSE Framework</title>
  <meta name="description" content="SvelteKit SPA micro-frontend" />
</svelte:head>

<div class="app">
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/about">About</a>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer>
    <p>&copy; 2025 SSE Framework - SvelteKit SPA</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: system-ui, sans-serif;
  }

  header {
    background: #10b981;
    color: white;
    padding: 1rem;
  }

  nav {
    display: flex;
    gap: 1rem;
  }

  nav a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }

  nav a:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  main {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  footer {
    background: #f3f4f6;
    padding: 1rem;
    text-align: center;
    color: #6b7280;
  }
</style>
