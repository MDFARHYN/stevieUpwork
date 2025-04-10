import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';

const BaseDomain = "http://localhost:8000";

// Define interface for sidebar items
interface SidebarItem {
  id: string;
  label: string;
  icon: string; // You can use a simple string representation of icons
}

const ProfileComponent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');

  // Sidebar navigation items
  const sidebarItems: SidebarItem[] = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'password', label: 'Change Password', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🛡️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content with Sidebar in the middle */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-5xl flex gap-8 p-8">
          {/* Sidebar - now in the middle */}
          <div className="w-64 bg-white border border-gray-200 rounded-lg h-fit sticky top-8 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Account Settings</h2>
            </div>
            <nav className="flex-1 overflow-y-auto">
              <ul className="py-2">
                {sidebarItems.map(item => (
                  <li key={item.id} className="px-2 py-1">
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm rounded-md ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-200">
              <button className="w-full py-2 text-sm text-red-600 hover:text-red-700">
                Sign Out
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeSection === 'profile' ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">
                  Profile section is under development. Check back soon for more options.
                </p>
              </div>
            ) : activeSection === 'password' ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-800 mb-6">Change Password</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Change your password to keep your account secure.
                </p>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 text-sm text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-800 mb-6">
                  {activeSection === 'notifications' ? 'Notification Settings' : 'Privacy Settings'}
                </h2>
                <p className="text-sm text-gray-500">
                  This section is under development. Check back soon for more options.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;