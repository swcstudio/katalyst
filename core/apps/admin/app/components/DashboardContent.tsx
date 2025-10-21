import React from 'react';
import ApplicationList from './ApplicationList';
import SystemLogs from './SystemLogs';

interface DashboardContentProps {
    activeSection: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection }) => {
    const renderContent = () => {
        switch (activeSection) {
            case 'applications':
                return <ApplicationList />;
            case 'logs':
                return <SystemLogs />;
            case 'users':
                return (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
                        <p className="text-gray-600">User management interface will be implemented here.</p>
                        <div className="mt-4">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Add New User
                            </button>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings & Configuration</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-md font-medium text-gray-900 mb-2">General Settings</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" defaultChecked />
                                        <span className="text-sm text-gray-700">Enable debug mode</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" defaultChecked />
                                        <span className="text-sm text-gray-700">Send notifications</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-md font-medium text-gray-900 mb-2">Performance Settings</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cache Duration (seconds)</label>
                                        <input type="number" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="300" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Overview</h2>
                        <p className="text-gray-600">Select a section from the sidebar to view detailed information.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex-1">
            {renderContent()}
        </div>
    );
};

export default DashboardContent;
