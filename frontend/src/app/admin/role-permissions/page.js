'use client';

import { useState } from 'react';
import { Save, RefreshCw, ChevronDown } from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';

// Sample data structure
const initialPermissions = {
  SuperAdmin: {
    users: { create: true, read: true, update: true, delete: true, view: true },
    leads: { create: true, read: true, update: true, delete: true, view: true },
    admins: { create: true, read: true, update: true, delete: true, view: true },
    analytics: { create: false, read: true, update: false, delete: false, view: true },
    auditLogs: { create: false, read: true, update: false, delete: false, view: true },
    settings: { create: true, read: true, update: true, delete: true, view: true },
  },
  Admin: {
    users: { create: true, read: true, update: true, delete: false, view: true },
    leads: { create: true, read: true, update: true, delete: true, view: true },
    admins: { create: false, read: true, update: false, delete: false, view: true },
    analytics: { create: false, read: true, update: false, delete: false, view: true },
    auditLogs: { create: false, read: true, update: false, delete: false, view: true },
    settings: { create: false, read: true, update: false, delete: false, view: true },
  },
  EditMode: {
    users: { create: true, read: true, update: true, delete: false, view: true },
    leads: { create: true, read: true, update: true, delete: false, view: true },
    admins: { create: false, read: true, update: false, delete: false, view: true },
    analytics: { create: false, read: true, update: false, delete: false, view: true },
    auditLogs: { create: false, read: false, update: false, delete: false, view: false },
    settings: { create: false, read: false, update: false, delete: false, view: false },
  },
  ViewMode: {
    users: { create: false, read: true, update: false, delete: false, view: true },
    leads: { create: false, read: true, update: false, delete: false, view: true },
    admins: { create: false, read: true, update: false, delete: false, view: true },
    analytics: { create: false, read: true, update: false, delete: false, view: true },
    auditLogs: { create: false, read: false, update: false, delete: false, view: false },
    settings: { create: false, read: false, update: false, delete: false, view: false },
  },
};

const permissionLabels = {
  users: 'Users',
  leads: 'Leads',
  admins: 'Admins',
  analytics: 'Analytics',
  auditLogs: 'Audit Logs',
  settings: 'Settings',
};

export default function RolePermissionsPage() {
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [permissions, setPermissions] = useState(initialPermissions);
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePermissionChange = (feature, permission, value) => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [feature]: {
          ...prev[selectedRole][feature],
          [permission]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Here you would typically make an API call to save the permissions
    console.log('Saving permissions:', permissions[selectedRole]);
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
    }, 1000);
  };

  const handleReset = () => {
    setPermissions(JSON.parse(JSON.stringify(initialPermissions)));
  };

  return (
    <ProtectedRoute>
      <AdminLayout 
        title="Role Permissions" 
        description="Manage permissions for different user roles"
      >
        <div className="space-y-6">
          {/* Role Selection */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <button
                type="button"
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm flex items-center justify-between"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="block truncate">{selectedRole}</span>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {Object.keys(permissions).map((role) => (
                    <div
                      key={role}
                      className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        role === selectedRole ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                      }`}
                      onClick={() => {
                        setSelectedRole(role);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="block truncate">{role}</span>
                      {role === selectedRole && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Permissions Table */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Features
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Create
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Read
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Update
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Delete
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {Object.entries(permissionLabels).map(([feature, label]) => (
                  <tr key={feature} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {label}
                    </td>
                    {['create', 'read', 'update', 'delete', 'view'].map((permission) => (
                      <td key={`${feature}-${permission}`} className="px-6 py-4 whitespace-nowrap text-center">
                        {permissions[selectedRole][feature][permission] !== undefined ? (
                          <input
                            type="checkbox"
                            checked={permissions[selectedRole][feature][permission]}
                            onChange={(e) => handlePermissionChange(feature, permission, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
