import React from 'react';
import { useTable } from '@refinedev/react-table';
import { ColumnDef } from '@tanstack/react-table';

// Mock data for demonstration
const mockSystemLogs = [
    { 
        id: 1, 
        timestamp: '2024-01-15 10:30:45', 
        level: 'info', 
        application: 'Main SPA', 
        message: 'Application started successfully',
        source: 'server.js'
    },
    { 
        id: 2, 
        timestamp: '2024-01-15 10:28:12', 
        level: 'warning', 
        application: 'Admin Dashboard', 
        message: 'High memory usage detected: 85%',
        source: 'memory-monitor'
    },
    { 
        id: 3, 
        timestamp: '2024-01-15 10:25:33', 
        level: 'error', 
        application: 'Marketing Site', 
        message: 'Database connection timeout',
        source: 'db-connector'
    },
    { 
        id: 4, 
        timestamp: '2024-01-15 10:22:18', 
        level: 'info', 
        application: 'Component Library', 
        message: 'Build completed successfully',
        source: 'build-system'
    },
    { 
        id: 5, 
        timestamp: '2024-01-15 10:20:45', 
        level: 'debug', 
        application: 'Main SPA', 
        message: 'User authentication successful',
        source: 'auth-service'
    },
];

const SystemLogs: React.FC = () => {
    const columns = React.useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: 'timestamp',
                header: 'Time',
                accessorKey: 'timestamp',
                cell: ({ getValue }) => (
                    <span className="text-sm text-gray-600 font-mono">
                        {getValue()}
                    </span>
                ),
            },
            {
                id: 'level',
                header: 'Level',
                accessorKey: 'level',
                cell: ({ getValue }) => {
                    const level = getValue();
                    const levelColors = {
                        error: 'bg-red-100 text-red-800',
                        warning: 'bg-yellow-100 text-yellow-800',
                        info: 'bg-blue-100 text-blue-800',
                        debug: 'bg-gray-100 text-gray-800',
                    };
                    return (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${levelColors[level] || 'bg-gray-100 text-gray-800'}`}>
                            {level.toUpperCase()}
                        </span>
                    );
                },
            },
            {
                id: 'application',
                header: 'Application',
                accessorKey: 'application',
                cell: ({ getValue }) => (
                    <span className="text-sm font-medium text-gray-900">
                        {getValue()}
                    </span>
                ),
            },
            {
                id: 'message',
                header: 'Message',
                accessorKey: 'message',
                cell: ({ getValue }) => (
                    <div className="max-w-xs">
                        <p className="text-sm text-gray-900 truncate">{getValue()}</p>
                    </div>
                ),
            },
            {
                id: 'source',
                header: 'Source',
                accessorKey: 'source',
                cell: ({ getValue }) => (
                    <span className="text-sm text-gray-500 font-mono">
                        {getValue()}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                accessorKey: 'id',
                cell: ({ getValue }) => (
                    <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm">
                            Export
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const {
        getHeaderGroups,
        getRowModel,
    } = useTable({
        columns,
        data: mockSystemLogs,
    });

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">System Logs</h2>
                <div className="flex gap-2">
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                        <option value="">All Levels</option>
                        <option value="error">Error</option>
                        <option value="warning">Warning</option>
                        <option value="info">Info</option>
                        <option value="debug">Debug</option>
                    </select>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                        Refresh
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                        Clear Logs
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header.column.columnDef.header}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {cell.getValue()}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SystemLogs;
