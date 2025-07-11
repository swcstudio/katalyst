import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Button } from '../../shared/src/components/DesignSystem';
import { DataTable } from './DataTable';
import { Analytics } from './Analytics';

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      return {
        totalUsers: 1234,
        activeUsers: 856,
        revenue: 45678,
        orders: 234,
        recentActivity: [
          { id: 1, action: 'User registered', user: 'john@example.com', timestamp: new Date() },
          { id: 2, action: 'Order placed', user: 'jane@example.com', timestamp: new Date() },
          { id: 3, action: 'Payment processed', user: 'bob@example.com', timestamp: new Date() },
        ]
      };
    },
  });

  if (isLoading) {
    return <div className="animate-pulse p-6">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="primary">Export Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Users">
          <div className="text-2xl font-bold text-blue-600">{dashboardData?.totalUsers}</div>
        </Card>
        <Card title="Active Users">
          <div className="text-2xl font-bold text-green-600">{dashboardData?.activeUsers}</div>
        </Card>
        <Card title="Revenue">
          <div className="text-2xl font-bold text-purple-600">${dashboardData?.revenue}</div>
        </Card>
        <Card title="Orders">
          <div className="text-2xl font-bold text-orange-600">{dashboardData?.orders}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Analytics Overview">
          <Analytics />
        </Card>
        
        <Card title="Recent Activity">
          <div className="space-y-3">
            {dashboardData?.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.user}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {activity.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Data Management">
        <DataTable />
      </Card>
    </div>
  );
}
