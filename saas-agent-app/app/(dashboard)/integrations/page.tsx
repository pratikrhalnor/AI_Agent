'use client';

import { useEffect, useState } from 'react';
import { nangoService } from '@/services/nango';
import { 
  Mail, 
  Calendar,
  MessageCircle,
  Plus,
  Loader2,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  GitBranch
} from 'lucide-react';

const INTEGRATIONS = [
  { id: 'github', name: 'GitHub', icon: GitBranch, color: 'bg-gray-100', provider: 'github' },
  { id: 'slack', name: 'Slack', icon: MessageCircle, color: 'bg-indigo-100', provider: 'slack' },
  { id: 'google-mail', name: 'Gmail', icon: Mail, color: 'bg-red-100', provider: 'google-mail' },
  { id: 'google-calendar', name: 'Google Calendar', icon: Calendar, color: 'bg-blue-100', provider: 'google-calendar' },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load connections on mount
  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const connections = await nangoService.getConnections();
      
      setIntegrations(prev => prev.map(integration => {
        const connection = connections.find(
          (c: any) => c.provider_config_key === integration.provider
        );
        return {
          ...integration,
          connected: !!connection,
          connectionId: connection?.id,
        };
      }));
    } catch (error) {
      console.error('Failed to load connections:', error);
      setError('Failed to load integrations');
    } finally {
      setLoading(false);
    }
  };

  const connectIntegration = async (integration: any) => {
    try {
      setConnecting(integration.id);
      setError(null);
      setSuccess(null);

      console.log(`Starting connection for ${integration.name} with provider: ${integration.provider}...`);

      const result = await nangoService.auth(integration.provider);
      
      console.log('Auth result:', result);

      if (result && result.connectionId) {
        setIntegrations(prev => prev.map(item =>
          item.id === integration.id
            ? { ...item, connected: true, connectionId: result.connectionId }
            : item
        ));
        setSuccess(`✅ Successfully connected to ${integration.name}!`);
        await loadConnections();
      } else {
        const connections = await nangoService.getConnections();
        const isConnected = connections.some(
          (c: any) => c.provider_config_key === integration.provider
        );
        
        if (isConnected) {
          setIntegrations(prev => prev.map(item =>
            item.id === integration.id
              ? { ...item, connected: true }
              : item
          ));
          setSuccess(`✅ Successfully connected to ${integration.name}!`);
          await loadConnections();
        } else {
          setError(`Failed to connect to ${integration.name}. Please try again.`);
        }
      }
      
    } catch (error: any) {
      console.error('Failed to connect:', error);
      
      if (error?.message?.includes('cancelled') || 
          error?.message?.includes('closed') || 
          error?.message?.includes('popup') ||
          error?.message?.includes('User cancelled')) {
        setError('Connection cancelled. Please try again when ready.');
      } else {
        try {
          const connections = await nangoService.getConnections();
          const isConnected = connections.some(
            (c: any) => c.provider_config_key === integration.provider
          );
          
          if (isConnected) {
            setIntegrations(prev => prev.map(item =>
              item.id === integration.id
                ? { ...item, connected: true }
                : item
            ));
            setSuccess(`✅ Successfully connected to ${integration.name}!`);
            await loadConnections();
          } else {
            setError(`Failed to connect to ${integration.name}. Please try again.`);
          }
        } catch {
          setError(`Failed to connect to ${integration.name}. Please try again.`);
        }
      }
    } finally {
      setConnecting(null);
    }
  };

  const disconnectIntegration = async (integration: any) => {
    try {
      setConnecting(integration.id);
      setError(null);
      setSuccess(null);

      await nangoService.disconnect(integration.provider);

      setIntegrations(prev => prev.map(item =>
        item.id === integration.id
          ? { ...item, connected: false, connectionId: undefined }
          : item
      ));
      
      setSuccess(`✅ Successfully disconnected ${integration.name}`);
    } catch (error) {
      console.error('Failed to disconnect:', error);
      setError(`Failed to disconnect ${integration.name}`);
    } finally {
      setConnecting(null);
    }
  };

  // Auto-refresh when page gets focus
  useEffect(() => {
    const handleFocus = () => {
      if (!connecting) {
        loadConnections();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [connecting]);

  // Refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !connecting) {
        loadConnections();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, connecting]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Connect your favorite tools and services
            </p>
            {error && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-500 mt-1 flex items-center gap-1 animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                {success}
              </p>
            )}
          </div>
          <button
            onClick={loadConnections}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-500">Loading integrations...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              const isConnecting = connecting === integration.id;
              
              return (
                <div
                  key={integration.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2 flex items-center gap-1 transition-all ${
                        integration.connected
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {integration.connected ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Connected
                        </>
                      ) : (
                        'Disconnected'
                      )}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-semibold text-gray-900 mt-3">
                    {integration.name}
                  </h3>
                  
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 min-h-[32px]">
                    {integration.connected 
                      ? `✅ Connected to ${integration.name}`
                      : `Connect your ${integration.name} account`}
                  </p>

                  {integration.connected ? (
                    <button
                      onClick={() => disconnectIntegration(integration)}
                      disabled={isConnecting}
                      className="mt-3 w-full px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {isConnecting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => connectIntegration(integration)}
                      disabled={isConnecting}
                      className="mt-3 w-full px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          Connect
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}