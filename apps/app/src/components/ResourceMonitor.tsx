interface ResourceMonitorProps {
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    network: {
      in: number;
      out: number;
    };
  };
}

export function ResourceMonitor({ resources }: ResourceMonitorProps) {
  const getColorClass = (value: number) => {
    if (value < 50) return 'bg-green-500';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        System Resources
      </h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">CPU</span>
            <span className="text-gray-900 dark:text-white font-medium">{resources.cpu}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getColorClass(resources.cpu)} transition-all duration-300`}
              style={{ width: `${resources.cpu}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Memory</span>
            <span className="text-gray-900 dark:text-white font-medium">{resources.memory}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getColorClass(resources.memory)} transition-all duration-300`}
              style={{ width: `${resources.memory}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Disk</span>
            <span className="text-gray-900 dark:text-white font-medium">{resources.disk}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getColorClass(resources.disk)} transition-all duration-300`}
              style={{ width: `${resources.disk}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400">Network</div>
          <div className="flex justify-between mt-1">
            <span className="text-xs">
              <span className="text-gray-500">↓</span>
              <span className="text-gray-900 dark:text-white font-medium ml-1">
                {resources.network.in} MB/s
              </span>
            </span>
            <span className="text-xs">
              <span className="text-gray-500">↑</span>
              <span className="text-gray-900 dark:text-white font-medium ml-1">
                {resources.network.out} MB/s
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}