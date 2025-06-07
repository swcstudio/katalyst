<script lang="ts">
  import { authStore } from 'shared/adapters';
  import { onMount } from 'svelte';

  let authState = { isAuthenticated: false, user: null };

  onMount(() => {
    const unsubscribe = authStore.subscribe((state) => {
      authState = state;
    });

    return unsubscribe;
  });
</script>

<div class="container">
  <h1>SvelteKit Single Page Application</h1>
  
  <div class="auth-status">
    <h2>Authentication Status</h2>
    <p>Status: {authState.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
    {#if authState.user}
      <p>User: {authState.user.name}</p>
    {/if}
  </div>

  <div class="features">
    <h2>SvelteKit SPA Features</h2>
    <ul>
      <li>Client-side routing</li>
      <li>Shared Zustand state management</li>
      <li>TypeScript support</li>
      <li>Static site generation</li>
      <li>Optimized for SPAs</li>
    </ul>
  </div>

  <div class="grid">
    <div class="card">
      <h3>Reactive UI</h3>
      <p>Svelte's reactive programming model</p>
    </div>
    
    <div class="card">
      <h3>Performance</h3>
      <p>Compiled components for optimal performance</p>
    </div>
    
    <div class="card">
      <h3>Developer Experience</h3>
      <p>Excellent tooling and development experience</p>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: #10b981;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .auth-status {
    background: #f3f4f6;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .auth-status h2 {
    margin-top: 0;
  }

  .features {
    background: #ecfdf5;
    border: 1px solid #10b981;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .features h2 {
    margin-top: 0;
    color: #047857;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .card h3 {
    margin-top: 0;
  }
</style>
