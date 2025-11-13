import React, { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Users, 
  Package, 
  Monitor,
  Moon,
  Sun,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@katalyst/design-system';
import { useTauri } from '../providers/TauriProvider';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DesktopLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { appInfo, theme, setTheme } = useTauri();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Package,
    },
    {
      name: 'Files',
      href: '/files',
      icon: FileText,
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
    },
    {
      name: 'Monitor',
      href: '/monitor',
      icon: Monitor,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const handleThemeToggle = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  return (
    <div className="flex h-full bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onThemeToggle={handleThemeToggle}
          theme={theme}
          appInfo={appInfo}
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
