import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Demo credentials validation
    if (email === 'demo@agenthub.com' && password === 'demo123') {
      const response = NextResponse.json(
        { 
          success: true, 
          message: 'Login successful',
          user: { email: 'demo@agenthub.com', name: 'Demo User' }
        },
        { status: 200 }
      );

      // Set authentication cookie
      response.cookies.set('auth-token', 'demo-token-123456', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return response;
    }

    // Invalid credentials
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}