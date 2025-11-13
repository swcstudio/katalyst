import React from 'react';
import { Menu, Bell, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@katalyst/design-system';
import { useTauri } from '../providers/TauriProvider';

interface HeaderProps {
  onMenuClick: () => void;
  onThemeToggle: () => void;
  theme: string;
  appInfo: any;
  sidebarOpen: boolean;
}

export function Header({ onMenuClick, onThemeToggle, theme, appInfo, sidebarOpen }: HeaderProps) {
  const { showMessage } = useTauri();

  const handleNotificationClick = async () => {
    await showMessage('No new notifications', 'Notifications', 'info');
  };

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* App title */}
          <div>
            <h1 className="text-lg font-semibold">
              {appInfo?.name || 'Katalyst Desktop'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {appInfo?.version || 'v0.1.0'} • {appInfo?.platform || 'Desktop'}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeToggle}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotificationClick}
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {/* System monitor */}
          <Button
            variant="ghost"
            size="sm"
            title="System Monitor"
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
