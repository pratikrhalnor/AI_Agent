'use client';

import { 
  Mail, 
  Database,
  MessageCircle,
  Plus,
  Link,
  Cloud,
  Users,
  Archive,
  Code,
  Globe
} from 'lucide-react';

const integrations = [
  { name: 'Twitter/X', icon: Globe, color: 'bg-blue-100', connected: true },
  { name: 'GitHub', icon: Code, color: 'bg-gray-100', connected: true },
  { name: 'Slack', icon: MessageCircle, color: 'bg-indigo-100', connected: false },
  { name: 'Email', icon: Mail, color: 'bg-green-100', connected: false },
  { name: 'Database', icon: Database, color: 'bg-purple-100', connected: false },
  { name: 'Webhooks', icon: Link, color: 'bg-orange-100', connected: false },
  { name: 'Cloud Storage', icon: Cloud, color: 'bg-cyan-100', connected: false },
  { name: 'Analytics', icon: Archive, color: 'bg-red-100', connected: false },
  { name: 'Users', icon: Users, color: 'bg-teal-100', connected: false },
  { name: 'Code Repository', icon: Code, color: 'bg-gray-100', connected: true },
  { name: 'CRM', icon: Users, color: 'bg-pink-100', connected: false },
  { name: 'Payment Gateway', icon: CreditCard, color: 'bg-green-100', connected: false },
];

// Import CreditCard if needed
import { CreditCard } from 'lucide-react';

export default function IntegrationsPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
            <p className="text-sm text-gray-500 mt-0.5">Connect your favorite tools and services</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap text-sm flex-shrink-0">
            <Plus className="w-4 h-4" />
            Add Integration
          </button>
        </div>
      </div>

      {/* Integrations Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div
                key={integration.name}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                      integration.connected
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {integration.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mt-3">
                  {integration.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 min-h-[32px]">
                  Connect your {integration.name} account to enable integration
                </p>
                <button
                  className={`mt-3 w-full px-4 py-1.5 rounded-lg transition-colors text-sm ${
                    integration.connected
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {integration.connected ? 'Configure' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}