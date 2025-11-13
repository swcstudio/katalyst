// Desktop app exports (will be created)
export { default as DesktopApp } from '../../apps/desktop/src/App';
export { default as DesktopMenu } from '../../apps/desktop/src/components/DesktopMenu';
export { default as DesktopTray } from '../../apps/desktop/src/components/DesktopTray';
export * from '../../apps/desktop/src/hooks/useDesktopFeatures';

// Desktop specific exports
export const DESKTOP_VERSION = '0.1.0';
