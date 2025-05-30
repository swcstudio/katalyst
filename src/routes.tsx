import { Route, RootRoute, Outlet, createRootRouteWithContext } from '@tanstack/solid-router';
import { lazy } from 'solid-js';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/blog/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/blog/BlogPostPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const rootRoute = createRootRouteWithContext<{}>()({
  component: () => <Outlet />,
});

const layoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: MainLayout,
});

const indexRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/contact',
  component: ContactPage,
});

const blogIndexRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/blog',
  component: BlogPage,
});

const blogPostRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/blog/$slug',
  component: BlogPostPage,
});

const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

export const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    aboutRoute,
    contactRoute,
    blogIndexRoute,
    blogPostRoute,
  ]),
  notFoundRoute,
]);

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
