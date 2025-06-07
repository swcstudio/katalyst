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

<div class="dashboard">
  <h1>Dashboard</h1>
  
  {#if authState.isAuthenticated}
    <div class="welcome">
      <h2>Welcome back{authState.user ? `, ${authState.user.name}` : ''}!</h2>
    </div>
    
    <div class="dashboard-grid">
      <div class="widget">
        <h3>Analytics</h3>
        <div class="metric">
          <span class="value">1,234</span>
          <span class="label">Page Views</span>
        </div>
      </div>
      
      <div class="widget">
        <h3>Users</h3>
        <div class="metric">
          <span class="value">567</span>
          <span class="label">Active Users</span>
        </div>
      </div>
      
      <div class="widget">
        <h3>Revenue</h3>
        <div class="metric">
          <span class="value">$12,345</span>
          <span class="label">This Month</span>
        </div>
      </div>
      
      <div class="widget">
        <h3>Performance</h3>
        <div class="metric">
          <span class="value">98.5%</span>
          <span class="label">Uptime</span>
        </div>
      </div>
    </div>
  {:else}
    <div class="auth-required">
      <h2>Authentication Required</h2>
      <p>Please log in to access the dashboard.</p>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    max-width: 1000px;
    margin: 0 auto;
  }

  h1 {
    color: #10b981;
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  .welcome {
    background: #ecfdf5;
    border: 1px solid #10b981;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .welcome h2 {
    margin: 0;
    color: #047857;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .widget {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  .widget h3 {
    margin: 0 0 1rem 0;
    color: #374151;
    font-size: 1.1rem;
  }

  .metric {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .value {
    font-size: 2rem;
    font-weight: bold;
    color: #10b981;
    margin-bottom: 0.5rem;
  }

  .label {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .auth-required {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    padding: 2rem;
    border-radius: 0.5rem;
    text-align: center;
  }

  .auth-required h2 {
    margin-top: 0;
    color: #dc2626;
  }
</style>
