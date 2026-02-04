import React from 'react';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Bird, PieChart, CheckCircle } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'imported', icon: CheckCircle, label: 'Imported Events' },
    { id: 'events', icon: Calendar, label: 'All Events' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-50 flex flex-col font-sans">
      {/* Brand */}
      <div className="h-24 flex items-center px-8 border-b border-gray-100">
        <Bird className="w-6 h-6 text-black mr-3" />
        <span className="font-serif font-bold text-xl tracking-tight">EventScale</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id
                ? 'bg-black text-white shadow-lg shadow-gray-200'
                : 'text-gray-500 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-gray-100">
        <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
            <LogOut size={18} />
            <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;