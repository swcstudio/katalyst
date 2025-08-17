interface VMStatusProps {
  status: 'running' | 'starting' | 'stopped';
  uptime: string;
  cpu: number;
  memory: number;
  disk: number;
  network: {
    in: number;
    out: number;
  };
}

export function VMStatus({ status, uptime }: VMStatusProps) {
  const statusColors = {
    running: 'bg-green-500',
    starting: 'bg-yellow-500',
    stopped: 'bg-red-500'
  };

  const statusText = {
    running: 'VM Running',
    starting: 'VM Starting',
    stopped: 'VM Stopped'
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 ${statusColors[status]} rounded-full animate-pulse`}></div>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {statusText[status]}
        </span>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {uptime}
      </span>
    </div>
  );
}