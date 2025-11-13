import React from 'react';
import { List } from '@refinedev/core';
import { useTable, ListButton, EditButton, ShowButton, DeleteButton } from '@refinedev/react-table';
import { ColumnDef } from '@tanstack/react-table';

// Mock data for demonstration
const mockApplications = [
    { id: 1, name: 'Main SPA', type: 'React 19', status: 'active', port: 20007, lastDeployed: '2024-01-15' },
    { id: 2, name: 'Marketing Site', type: 'Next.js 15', status: 'active', port: 20009, lastDeployed: '2024-01-14' },
    { id: 3, name: 'Admin Dashboard', type: 'Remix 2', status: 'active', port: 20008, lastDeployed: '2024-01-15' },
    { id: 4, name: 'Component Library', type: 'Storybook', status: 'building', port: 6006, lastDeployed: null },
    { id: 5, name: 'Mobile App', type: 'React Native', status: 'development', port: null, lastDeployed: null },
];

const ApplicationList: React.FC = () => {
    const columns = React.useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: 'name',
                header: 'Application',
                accessorKey: 'name',
                cell: ({ getValue, row }) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">{getValue()}</div>
                        <div className="text-sm text-gray-500">{row.original.type}</div>
                    </div>
                ),
            },
            {
                id: 'port',
                header: 'Port',
                accessorKey: 'port',
                cell: ({ getValue }) => (
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {getValue() || 'N/A'}
                    </span>
                ),
            },
            {
                id: 'status',
                header: 'Status',
                accessorKey: 'status',
                cell: ({ getValue }) => {
                    const status = getValue();
                    const statusColors = {
                        active: 'bg-green-100 text-green-800',
                        building: 'bg-yellow-100 text-yellow-800',
                        development: 'bg-blue-100 text-blue-800',
                        inactive: 'bg-red-100 text-red-800',
                    };
                    return (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                            {status}
                        </span>
                    );
                },
            },
            {
                id: 'lastDeployed',
                header: 'Last Deployed',
                accessorKey: 'lastDeployed',
                cell: ({ getValue }) => (
                    <span className="text-sm text-gray-600">
                        {getValue() || 'Never'}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                accessorKey: 'id',
                cell: ({ getValue }) => (
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                            View
                        </button>
                        <button className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                            Deploy
                        </button>
                        <button className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600">
                            Config
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
        data: mockApplications,
    });

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Application Management</h2>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Add Application
                </button>
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

export default ApplicationList;
