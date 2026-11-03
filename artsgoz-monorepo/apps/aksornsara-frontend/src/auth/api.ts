import { requireAuth } from './firebase';

/** Call a trusted backend with the current user's automatically refreshed ID token. */
export async function authenticatedFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const user = requireAuth().currentUser;
  if (!user) throw new Error('Sign in before calling the API.');

  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!baseUrl) throw new Error('VITE_API_BASE_URL is not configured.');
  // Keep requests relative to the configured API so tokens cannot be sent to another host.
  if (!path.startsWith('/') || path.startsWith('//') || /[\\#]/.test(path)) {
    throw new Error('Use an API path starting with a single slash.');
  }
  const base = new URL(
    baseUrl.replace(/\/$/, '') + '/',
    window.location.origin,
  );
  const url = new URL(base.href.replace(/\/$/, '') + path);
  if (url.origin !== base.origin) throw new Error('Invalid API origin.');

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  return fetch(url, { ...options, headers, redirect: 'error' });
}
