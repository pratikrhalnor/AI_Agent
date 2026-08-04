import { NextResponse } from 'next/server';
import { NANGO_CONFIG } from '@/config/nango';

export async function GET() {
  try {
    const response = await fetch(`${NANGO_CONFIG.hostedURL}/connections`, {
      headers: {
        'Authorization': `Bearer ${NANGO_CONFIG.secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch connections');
    }

    const data = await response.json();
    return NextResponse.json({ connections: data.data || [] });
  } catch (error) {
    console.error('Connections error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    );
  }
}