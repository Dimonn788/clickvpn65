/* Client-side API wrappers for the real backend endpoints.
   All requests use cookie-based sessions (credentials: 'include').
   This file replaces server-side mock handlers and adapts frontend calls
   to hit the FastAPI `/api/*` endpoints. */

export type AuthUser = {
  id: string;
  email: string;
  username?: string | null;
  email_verified?: boolean;
  telegram_linked?: boolean;
};

function apiFetch<T = any>(path: string, opts: RequestInit = {}) {
  return fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    ...opts,
  }).then(async (res) => {
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) {
      const msg = json?.detail || json?.error || (typeof json === 'string' ? json : null) || res.statusText;
      throw new Error(msg || 'API error');
    }
    return json as T;
  });
}

export async function login(payload: { data: { email: string } }) {
  return apiFetch('/api/login/request', { method: 'POST', body: JSON.stringify({ email: payload.data.email }) });
}

export async function confirmLogin(payload: { data: { token: string } }) {
  return apiFetch('/api/login/confirm', { method: 'POST', body: JSON.stringify({ token: payload.data.token }) });
}

export async function logout() {
  return apiFetch('/api/logout', { method: 'POST' });
}

export async function getUserSession() {
  return apiFetch('/api/me', { method: 'GET' });
}

export async function updateTelegram() {
  // Start telegram linking process — returns deeplink url
  return apiFetch('/api/telegram/link/start', { method: 'POST' });
}

export async function createSubscriptionForUser(payload: { data: { planMonths: number } }) {
  // Calls backend to create a provider invoice. Chooses a default provider.
  const body = { months: payload.data.planMonths, provider: 'platega_card' };
  return apiFetch('/api/subscription/buy', { method: 'POST', body: JSON.stringify(body) });
}

export async function getLatestSubscriptionForUser() {
  const resp = await apiFetch('/api/subscriptions', { method: 'GET' });
  const subs = resp.subscriptions || [];
  const first = subs.length ? subs[0] : null;
  if (!first) return { subscription: null };
  return {
    subscription: {
      id: first.uuid ?? null,
      plan_months: first.months ?? first.plan_months ?? null,
      status: (first.status || '').toLowerCase(),
      vpn_key: first.subscription_url ?? null,
      expires_at: first.expire_at ?? first.expireAt ?? null,
    },
  };
}

export async function getPaymentsForUser() {
  return apiFetch('/api/payments', { method: 'GET' });
}

export async function getDevicesForUser() {
  const resp = await apiFetch('/api/devices', { method: 'GET' });
  const devices = (resp.devices || []).map((d: any) => ({
    id: d.hwid ?? d.id,
    name: d.name ?? d.hwid ?? 'Unknown',
    platform: (d.platform ?? 'unknown').toLowerCase(),
    created_at: d.createdAt ?? d.created_at ?? new Date().toISOString(),
    last_seen_at: d.lastSeenAt ?? d.last_seen_at ?? null,
  }));
  return { devices };
}

export async function removeDevice(payload: { data: { id: string } }) {
  // backend expects { hwid }
  return apiFetch('/api/devices/delete', { method: 'POST', body: JSON.stringify({ hwid: payload.data.id }) });
}
