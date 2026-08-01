import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    clientId: process.env.WORKOS_CLIENT_ID ? 'Set' : 'Not Set',
    apiKey: process.env.WORKOS_API_KEY ? 'Set' : 'Not Set',
    redirectUri: process.env.WORKOS_REDIRECT_URI || 'Not Set',
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD ? 'Set' : 'Not Set',
  });
}