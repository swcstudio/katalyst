import { useQuery } from '@tanstack/react-query';

export function Analytics() {
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => ({
      pageViews: [
        { date: '2024-01-01', views: 1200 },
        { date: '2024-01-02', views: 1350 },
        { date: '2024-01-03', views: 1100 },
        { date: '2024-01-04', views: 1450 },
        { date: '2024-01-05', views: 1600 },
      ],
      topPages: [
        { path: '/dashboard', views: 2500 },
        { path: '/users', views: 1800 },
        { path: '/settings', views: 1200 },
        { path: '/reports', views: 900 },
      ],
    }),
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Page Views (Last 5 Days)</h3>
        <div className="space-y-2">
          {analyticsData?.pageViews.map((day) => (
            <div key={day.date} className="flex items-center justify-between">
              <span className="text-sm">{day.date}</span>
              <div className="flex items-center space-x-2">
                <div
                  className="bg-blue-200 h-2 rounded"
                  style={{ width: `${(day.views / 2000) * 100}px` }}
                />
                <span className="text-sm font-medium">{day.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Top Pages</h3>
        <div className="space-y-2">
          {analyticsData?.topPages.map((page) => (
            <div key={page.path} className="flex items-center justify-between">
              <span className="text-sm font-mono">{page.path}</span>
              <span className="text-sm font-medium">{page.views} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
