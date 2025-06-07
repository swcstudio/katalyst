<script lang="ts">
import { onMount } from 'svelte';
import { authStore } from '../../../libs/shared/adapters/zustand-svelte';

let user = authStore.getState().user;

onMount(() => {
  const unsubscribe = authStore.subscribe((state) => {
    user = state.user;
  });

  return unsubscribe;
});
</script>

<main>
  <h1>SvelteKit SPA</h1>
  <p>Welcome to the SvelteKit Single Page Application</p>
  
  {#if user}
    <p>Welcome, {user.name}!</p>
  {:else}
    <p>Please log in to continue</p>
  {/if}
  
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/dashboard">Dashboard</a>
  </nav>
</main>

<style>
  main {
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  nav {
    margin-top: 2rem;
  }
  
  nav a {
    margin-right: 1rem;
    color: #0066cc;
    text-decoration: none;
  }
  
  nav a:hover {
    text-decoration: underline;
  }
</style>
