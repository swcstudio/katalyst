import { useEffect, useRef, useState } from 'react';

interface TerminalProps {
  sessionId: string;
  type: 'terminal' | 'browser' | 'devcontainer';
}

export function Terminal({ sessionId, type }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([
    'Katalyst Terminal v1.0.0',
    'Connected to sandboxed VM environment',
    '',
    '$ '
  ]);
  const [currentInput, setCurrentInput] = useState('');

  const handleCommand = (command: string) => {
    const newLines = [...lines];
    newLines[newLines.length - 1] += command;
    
    // Simulate command responses
    switch (command.trim()) {
      case 'help':
        newLines.push(
          '',
          'Available commands:',
          '  help     - Show this help message',
          '  clear    - Clear terminal',
          '  status   - Show VM status',
          '  ls       - List files',
          '  cd       - Change directory',
          '  code     - Open VS Code',
          ''
        );
        break;
      case 'clear':
        setLines(['$ ']);
        return;
      case 'status':
        newLines.push(
          '',
          'VM Status: Running',
          'Uptime: 2h 34m',
          'CPU: 25% | Memory: 45% | Disk: 60%',
          ''
        );
        break;
      case 'ls':
        newLines.push(
          '',
          'Documents/  Downloads/  Projects/  .config/',
          ''
        );
        break;
      default:
        if (command.trim()) {
          newLines.push('', `Command not found: ${command}`, '');
        }
    }
    
    newLines.push('$ ');
    setLines(newLines);
    setCurrentInput('');
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  if (type === 'browser') {
    return (
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex items-center space-x-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 flex items-center space-x-2 ml-4">
            <input
              type="text"
              className="flex-1 px-3 py-1 bg-white dark:bg-gray-800 rounded text-sm"
              placeholder="https://localhost:3000"
            />
          </div>
        </div>
        <div className="p-8 text-center text-gray-500">
          <div className="mb-4">🌐</div>
          Browser session ready
        </div>
      </div>
    );
  }

  if (type === 'devcontainer') {
    return (
      <div className="h-full bg-gray-900 rounded-lg shadow-lg overflow-hidden p-4">
        <div className="text-green-400 font-mono text-sm">
          <div>🐳 DevContainer Environment</div>
          <div className="mt-2 text-gray-400">
            Node.js 20.x | Python 3.11 | Rust 1.75
          </div>
          <div className="mt-4">Ready for development...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div
        ref={terminalRef}
        className="h-full p-4 font-mono text-sm text-green-400 overflow-y-auto"
        onClick={() => document.getElementById('terminal-input')?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
            {i === lines.length - 1 && (
              <>
                <input
                  id="terminal-input"
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCommand(currentInput);
                    }
                  }}
                  className="bg-transparent outline-none border-none caret-green-400"
                  style={{ caretColor: '#10b981' }}
                  autoFocus
                />
                <span className="animate-pulse">_</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}