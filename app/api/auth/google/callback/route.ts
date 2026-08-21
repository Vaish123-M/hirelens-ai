import { NextRequest, NextResponse } from 'next/server';

function getSafeRedirect(value: string | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard';
  }
  return value;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = request.cookies.get('oauth_state')?.value;
  const redirect = getSafeRedirect(request.cookies.get('oauth_redirect')?.value);

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL('/login?error=oauth_state', request.url));
  }

  const exchangeResponse = await fetch(new URL('/api/auth/google', request.url), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
    cache: 'no-store',
  });

  if (!exchangeResponse.ok) {
    return NextResponse.redirect(new URL('/login?error=oauth_exchange', request.url));
  }

  const response = NextResponse.redirect(new URL(redirect, request.url));
  for (const cookie of exchangeResponse.headers.getSetCookie()) {
    response.headers.append('set-cookie', cookie);
  }
  response.cookies.delete('oauth_state');
  response.cookies.delete('oauth_redirect');
  return response;
}
