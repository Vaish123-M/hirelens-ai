export function getAppUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!appUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL environment variable is required');
  }

  try {
    const url = new URL(appUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error();
    }
    return url.origin;
  } catch {
    throw new Error('NEXT_PUBLIC_APP_URL must be a valid HTTP(S) URL');
  }
}

export function isSameOrigin(request: Request & { nextUrl?: URL }): boolean {
  const origin = request.headers.get('origin');
  if (origin) {
    return origin === (request.nextUrl?.origin || new URL(request.url).origin);
  }

  const referer = request.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).origin === (request.nextUrl?.origin || new URL(request.url).origin);
    } catch {
      return false;
    }
  }

  return true;
}
