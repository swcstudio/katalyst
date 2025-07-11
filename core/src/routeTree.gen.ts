import { createRootRoute, createRoute } from '@tanstack/react-router';
import App from './App.tsx';

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});

export const routeTree = rootRoute.addChildren([indexRoute]);
