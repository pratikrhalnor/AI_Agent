'use client';

import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Key,
  Globe,
  Database,
  Zap,
  ChevronRight
} from 'lucide-react';

const settingsItems = [
  { 
    icon: User, 
    title: 'Profile', 
    description: 'Update your personal information',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  { 
    icon: Bell, 
    title: 'Notifications', 
    description: 'Manage your notification preferences',
    color: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  { 
    icon: Shield, 
    title: 'Security', 
    description: 'Manage your security settings',
    color: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  { 
    icon: Palette, 
    title: 'Appearance', 
    description: 'Customize the look and feel',
    color: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  { 
    icon: Key, 
    title: 'API Keys', 
    description: 'Manage your API keys and tokens',
    color: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  { 
    icon: Globe, 
    title: 'Language', 
    description: 'Change your language preferences',
    color: 'bg-teal-100',
    iconColor: 'text-teal-600'
  },
  { 
    icon: Database, 
    title: 'Data & Privacy', 
    description: 'Manage your data and privacy settings',
    color: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  { 
    icon: Zap, 
    title: 'Integrations', 
    description: 'Manage connected services',
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account settings and preferences</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}