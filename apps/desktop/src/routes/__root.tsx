import { createRootRoute, Outlet } from '@tanstack/react-router';
import { DesktopLayout } from '../components/DesktopLayout';

export const Route = createRootRoute({
  component: () => (
    <DesktopLayout>
      <Outlet />
    </DesktopLayout>
  ),
});
