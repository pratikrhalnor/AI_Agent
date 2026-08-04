import { NextRequest, NextResponse } from 'next/server';
import { NANGO_CONFIG } from '@/config/nango';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;
    
    const connectionsRes = await fetch(`${NANGO_CONFIG.hostedURL}/connections`, {
      headers: {
        'Authorization': `Bearer ${NANGO_CONFIG.secretKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!connectionsRes.ok) {
      throw new Error('Failed to fetch connections');
    }
    
    const connectionsData = await connectionsRes.json();
    const connection = connectionsData.data?.find(
      (c: any) => c.provider_config_key === provider
    );
    
    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    const response = await fetch(
      `${NANGO_CONFIG.hostedURL}/connections/${connection.id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${NANGO_CONFIG.secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete connection');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete connection error:', error);
    return NextResponse.json(
      { error: 'Failed to delete connection' },
      { status: 500 }
    );
  }
}