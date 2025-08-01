import { useQuery } from '@tanstack/react-query';
import { Analytics } from './Analytics.tsx';
// import { Card, Button } from '../../../shared/src/components/DesignSystem.tsx';
import { DataTable } from './DataTable.tsx';

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => {
      return {
        totalUsers: 1234,
        activeUsers: 856,
        revenue: 45678,
        orders: 234,
        recentActivity: [
          { id: 1, action: 'User registered', user: 'john@example.com', timestamp: new Date() },
          { id: 2, action: 'Order placed', user: 'jane@example.com', timestamp: new Date() },
          { id: 3, action: 'Payment processed', user: 'bob@example.com', timestamp: new Date() },
        ],
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
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg bg-white shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
          <div className="text-2xl font-bold text-blue-600">{dashboardData?.totalUsers}</div>
        </div>
        <div className="p-4 border rounded-lg bg-white shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Users</h3>
          <div className="text-2xl font-bold text-green-600">{dashboardData?.activeUsers}</div>
        </div>
        <div className="p-4 border rounded-lg bg-white shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Revenue</h3>
          <div className="text-2xl font-bold text-purple-600">${dashboardData?.revenue}</div>
        </div>
        <div className="p-4 border rounded-lg bg-white shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Orders</h3>
          <div className="text-2xl font-bold text-orange-600">{dashboardData?.orders}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg bg-white shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Overview</h3>
          <Analytics />
        </div>

        <div className="p-4 border rounded-lg bg-white shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {dashboardData?.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
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
        </div>
      </div>

      <div className="p-4 border rounded-lg bg-white shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
        <DataTable />
      </div>
    </div>
  );
}
