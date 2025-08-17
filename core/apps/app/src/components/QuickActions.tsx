interface QuickActionsProps {
  onCreateSession: (type: 'terminal' | 'browser' | 'devcontainer') => void;
}

export function QuickActions({ onCreateSession }: QuickActionsProps) {
  const actions = [
    {
      icon: '💻',
      label: 'Terminal',
      type: 'terminal' as const,
      description: 'Open new terminal'
    },
    {
      icon: '🌐',
      label: 'Browser',
      type: 'browser' as const,
      description: 'Launch browser'
    },
    {
      icon: '🐳',
      label: 'DevContainer',
      type: 'devcontainer' as const,
      description: 'Start dev environment'
    }
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Quick Actions
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {actions.map(action => (
          <button
            key={action.type}
            onClick={() => onCreateSession(action.type)}
            className="
              flex flex-col items-center justify-center p-3
              bg-gray-50 dark:bg-gray-700/50 rounded-lg
              hover:bg-blue-50 dark:hover:bg-blue-900/30
              transition-colors group
            "
            title={action.description}
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
              {action.icon}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}