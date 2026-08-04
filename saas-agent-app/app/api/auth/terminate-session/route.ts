import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Call WorkOS API to terminate the session
    const response = await fetch(
      `https://api.workos.com/user_management/sessions/${sessionId}/terminate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WORKOS_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('WorkOS terminate session error:', error);
      return NextResponse.json(
        { error: 'Failed to terminate session' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Terminate session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}