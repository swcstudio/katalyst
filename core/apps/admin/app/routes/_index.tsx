import type { MetaFunction } from '@remix-run/node';
import React, { useState } from 'react';
import { List, Show, Create, Edit, useMany, useOne } from '@refinedev/core';
import {
    useTable,
    ListButton,
    EditButton,
    ShowButton,
    DeleteButton,
} from '@refinedev/react-table';
import { ColumnDef } from '@tanstack/react-table';
import DashboardContent from './components/DashboardContent';

// Mock data for demonstration
const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'moderator', status: 'inactive' },
];

const mockPosts = [
    { id: 1, title: 'Getting Started with Katalyst', content: 'Lorem ipsum...', authorId: 1, status: 'published' },
    { id: 2, title: 'Advanced React Patterns', content: 'Dolor sit amet...', authorId: 2, status: 'draft' },
];

export const meta: MetaFunction = () => {
    return [
        { title: 'Katalyst Admin Dashboard' },
        { name: 'description', content: 'Admin dashboard for managing Katalyst applications' },
    ];
};

// User List Component
const UserList: React.FC = () => {
    const columns = React.useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: 'id',
                header: 'ID',
                accessorKey: 'id',
            },
            {
                id: 'name',
                header: 'Name',
                accessorKey: 'name',
            },
            {
                id: 'email',
                header: 'Email',
                accessorKey: 'email',
            },
            {
                id: 'role',
                header: 'Role',
                accessorKey: 'role',
            },
            {
                id: 'status',
                header: 'Status',
                accessorKey: 'status',
                cell: ({ getValue }) => (
                    <span className={`px-2 py-1 rounded text-xs ${
                        getValue() === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
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
                        <ShowButton recordItemId={getValue()} />
                        <EditButton recordItemId={getValue()} />
                        <DeleteButton recordItemId={getValue()} />
                    </div>
                ),
            },
        ],
        []
    );

    const {
        getHeaderGroups,
        getRowModel,
        refineCore: { setCurrent, pageCount, current },
    } = useTable({
        columns,
        data: mockUsers,
    });

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
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
                            <tr key={row.id}>
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

// Stats Cards Component
const StatsCards: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                            <dd className="text-lg font-medium text-gray-900">1,234</dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Active Sessions</dt>
                            <dd className="text-lg font-medium text-gray-900">456</dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Avg. Response Time</dt>
                            <dd className="text-lg font-medium text-gray-900">123ms</dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Performance</dt>
                            <dd className="text-lg font-medium text-gray-900">98.5%</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sidebar Component
const Sidebar: React.FC<{ activeSection: string; onSectionChange: (section: string) => void }> = ({ activeSection, onSectionChange }) => {
    const menuItems = [
        { id: 'overview', label: 'Dashboard', icon: '📊' },
        { id: 'applications', label: 'Applications', icon: '🚀' },
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'logs', label: 'System Logs', icon: '📋' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="w-64 bg-white shadow-lg h-full">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900">Katalyst Admin</h2>
                <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
            </div>
            <nav className="mt-6">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`w-full text-left px-6 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                            activeSection === item.id ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : 'text-gray-700'
                        }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default function Index() {
    const [activeSection, setActiveSection] = useState('overview');

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Katalyst Admin Dashboard</h1>
                                <p className="text-sm text-gray-600 mt-1">Manage your applications, users, and system settings</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="p-2 text-gray-500 hover:text-gray-700">
                                    🔔
                                </button>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                        A
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Admin</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {activeSection === 'overview' ? (
                        <>
                            <StatsCards />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <UserList />
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => setActiveSection('users')}
                                            className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            Create New User
                                        </button>
                                        <button 
                                            onClick={() => setActiveSection('logs')}
                                            className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                        >
                                            View System Logs
                                        </button>
                                        <button 
                                            onClick={() => setActiveSection('applications')}
                                            className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                                        >
                                            Manage Applications
                                        </button>
                                        <button 
                                            onClick={() => setActiveSection('settings')}
                                            className="w-full text-left px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                                        >
                                            Settings & Configuration
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <DashboardContent activeSection={activeSection} />
                    )}
                </main>
            </div>
        </div>
    );
}
