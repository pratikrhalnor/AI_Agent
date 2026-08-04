import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('workos-authkit-session');
    const sessionSigCookie = cookieStore.get('workos-authkit-session.sig');
    
    const authenticated = !!(sessionCookie && sessionSigCookie);
    
    return NextResponse.json({ 
      authenticated,
      hasSession: !!sessionCookie,
      hasSig: !!sessionSigCookie
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ 
      authenticated: false,
      hasSession: false,
      hasSig: false
    });
  }
}