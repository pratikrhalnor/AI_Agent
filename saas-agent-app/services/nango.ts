import Nango from '@nangohq/frontend';
import { NANGO_CONFIG } from '@/config/nango';

class NangoService {
  private nango: Nango | null = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return this.nango;

    try {
      console.log('Initializing Nango with URL:', NANGO_CONFIG.hostedURL);
      
      const response = await fetch('/api/nango/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Session response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Session API error:', errorText);
        throw new Error(`Failed to get Nango session: ${response.status}`);
      }

      const data = await response.json();
      console.log('Session data received:', !!data.token);
      
      if (!data.token) {
        throw new Error('No token received from session API');
      }

      this.nango = new Nango({
        connectSessionToken: data.token,
        host: NANGO_CONFIG.hostedURL,
      });

      this.initialized = true;
      return this.nango;
    } catch (error) {
      console.error('Failed to initialize Nango:', error);
      throw error;
    }
  }

  async auth(provider: string) {
    try {
      const nango = await this.initialize();
      if (!nango) throw new Error('Nango not initialized');
      
      console.log(`Starting auth for provider: ${provider}`);
      
      // Open popup and wait for result
      // This will open a popup window
      const result = await nango.auth(provider, {
        // These options help with popup handling
        popup: true,
        width: 600,
        height: 700,
      });
      
      console.log('Auth result:', result);
      
      // Check if the connection was successful
      if (result && result.connectionId) {
        return {
          connectionId: result.connectionId
        };
      } else {
        return {
          connectionId: null
        };
      }
    } catch (error: any) {
      // Handle user closing the popup
      if (error?.message?.includes('closed') || 
          error?.message?.includes('cancelled') ||
          error?.message?.includes('popup')) {
        console.log('User closed the popup');
        return { connectionId: null, cancelled: true };
      }
      console.error(`Failed to connect ${provider}:`, error);
      throw error;
    }
  }

  async getConnections() {
    try {
      const response = await fetch('/api/nango/connections');
      const data = await response.json();
      return data.connections || [];
    } catch (error) {
      console.error('Failed to get connections:', error);
      throw error;
    }
  }

  async disconnect(provider: string) {
    try {
      const response = await fetch(`/api/nango/connections/${provider}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to disconnect');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to disconnect ${provider}:`, error);
      throw error;
    }
  }

  async getConnectionStatus(provider: string) {
    try {
      const connections = await this.getConnections();
      return connections.some((c: any) => c.provider_config_key === provider);
    } catch (error) {
      console.error('Failed to get connection status:', error);
      return false;
    }
  }
}

export const nangoService = new NangoService();