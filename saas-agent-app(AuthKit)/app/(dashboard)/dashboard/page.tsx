import { withAuth } from '@workos-inc/authkit-nextjs';
import { Activity, Users, MessageSquare, Zap, TrendingUp, Clock } from 'lucide-react';

const stats = [
  { name: 'Total Conversations', value: '1,234', change: '+12%', icon: MessageSquare, color: 'bg-blue-100', textColor: 'text-blue-600' },
  { name: 'Active Agents', value: '3', change: '+0%', icon: Activity, color: 'bg-green-100', textColor: 'text-green-600' },
  { name: 'Total Users', value: '48', change: '+8%', icon: Users, color: 'bg-purple-100', textColor: 'text-purple-600' },
  { name: 'Integrations', value: '5', change: '+2%', icon: Zap, color: 'bg-orange-100', textColor: 'text-orange-600' },
];

const recentActivities = [
  { title: 'Agent processed a user query', time: '2 minutes ago' },
  { title: 'New integration connected', time: '15 minutes ago' },
  { title: 'User signed up', time: '1 hour ago' },
  { title: 'Agent updated to v2.0', time: '3 hours ago' },
];

export default async function DashboardPage() {
  const { user } = await withAuth({ ensureSignedIn: true });

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName || user?.email || 'User'}!
        </h1>
        <p className="text-sm text-gray-500 mt-0.5 mb-4">Here's what's happening with your agents.</p>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">{stat.name}</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
                  <span className="inline-flex items-center gap-0.5 text-xs text-green-600 mt-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last 24 hours
              </span>
            </div>
            <div className="space-y-2">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.title}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">New Conversation</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 ml-6">Start a new chat with your agent</p>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-sm">Add Integration</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 ml-6">Connect external services</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}