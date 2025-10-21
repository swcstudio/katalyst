import { createFileRoute } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Activity, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@katalyst/design-system';
import { useTauri } from '../providers/TauriProvider';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  const { appInfo, systemInfo } = useTauri();

  const stats = [
    {
      title: 'Active Projects',
      value: '12',
      change: '+2 from last week',
      icon: Package,
      trend: 'up',
    },
    {
      title: 'Total Users',
      value: '1,234',
      change: '+18% from last month',
      icon: Users,
      trend: 'up',
    },
    {
      title: 'System Performance',
      value: '98%',
      change: '+2% from yesterday',
      icon: Activity,
      trend: 'up',
    },
    {
      title: 'API Calls',
      value: '45.2K',
      change: '+12% from last week',
      icon: TrendingUp,
      trend: 'up',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'New project created',
      details: 'E-commerce Dashboard',
      time: '2 minutes ago',
      icon: Package,
    },
    {
      id: 2,
      action: 'User registered',
      details: 'john.doe@example.com',
      time: '15 minutes ago',
      icon: Users,
    },
    {
      id: 3,
      action: 'System update completed',
      details: 'Version 0.1.1 installed',
      time: '1 hour ago',
      icon: Activity,
    },
    {
      id: 4,
      action: 'Performance optimization',
      details: 'Cache cleared successfully',
      time: '2 hours ago',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Katalyst Desktop - Your development workspace
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>
            Latest events and updates in your Katalyst workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <activity.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.details}
                  </p>
                </div>
                <div className="flex-shrink-0 text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name:</span>
              <span className="text-sm font-medium">{appInfo?.name || 'Katalyst Desktop'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version:</span>
              <span className="text-sm font-medium">{appInfo?.version || '0.1.0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Platform:</span>
              <span className="text-sm font-medium">{appInfo?.platform || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Architecture:</span>
              <span className="text-sm font-medium">{appInfo?.arch || 'Unknown'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">OS:</span>
              <span className="text-sm font-medium">{systemInfo?.os || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Architecture:</span>
              <span className="text-sm font-medium">{systemInfo?.arch || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version:</span>
              <span className="text-sm font-medium">{systemInfo?.version || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Memory:</span>
              <span className="text-sm font-medium">{systemInfo?.memory || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
