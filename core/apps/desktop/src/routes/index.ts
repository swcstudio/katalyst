import { createFileRoute, Link } from '@tanstack/react-router';
import { createFileRoute as createProjectsRoute } from './projects';
import { createFileRoute as createFilesRoute } from './files';
import { createFileRoute as createUsersRoute } from './users';
import { createFileRoute as createMonitorRoute } from './monitor';
import { createFileRoute as createSettingsRoute } from './settings';

// Route tree
export const routes = [
  {
    path: '/',
    component: () => import('./index').then((m) => <m.Route />),
  },
  {
    path: '/projects',
    component: () => import('./projects').then((m) => <m.Route />),
  },
  {
    path: '/files',
    component: () => import('./files').then((m) => <m.Route />),
  },
  {
    path: '/users',
    component: () => import('./users').then((m) => <m.Route />),
  },
  {
    path: '/monitor',
    component: () => import('./monitor').then((m) => <m.Route />),
  },
  {
    path: '/settings',
    component: () => import('./settings').then((m) => <m.Route />),
  },
];

export default routes;
