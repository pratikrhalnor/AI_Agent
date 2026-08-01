import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Get session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('workos-authkit-session');
    
    let sessionId = null;
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie.value);
        sessionId = sessionData.id || sessionData.sessionId;
      } catch {
        sessionId = sessionCookie.value;
      }
    }

    // Terminate session in WorkOS
    if (sessionId && process.env.WORKOS_API_KEY) {
      try {
        await fetch(
          `https://api.workos.com/user_management/sessions/${sessionId}/terminate`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.WORKOS_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.error('WorkOS terminate error:', error);
      }
    }

    const response = NextResponse.json({ success: true }, { status: 200 });
    
    // Clear ALL cookies
    const allCookies = cookieStore.getAll();
    allCookies.forEach(cookie => {
      response.cookies.delete(cookie.name);
    });

    // Clear specific auth cookies
    ['workos-authkit-session', 'workos-authkit-session.sig', '__session', 'auth-token'].forEach(name => {
      response.cookies.delete(name);
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}