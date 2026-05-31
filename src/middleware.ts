import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = [
  '/admindashboard',
  '/createbuilt',
  '/createcomingsoon',
  '/createadminblogs',
];

const COOKIE_NAME = 'admin_auth';
const COOKIE_VERIFIED = 'admin_verified'; // safe boolean cookie, no password stored

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY!;

/** Fetch the stored password hash from Supabase admin_config table */
async function getStoredPassword(): Promise<string | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_config?select=value&key=eq.admin_password&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        // Edge runtime — no node cache, always fresh
        cache: 'no-store',
      }
    );
    if (!res.ok) return null;
    const rows = await res.json() as { value: string }[];
    return rows?.[0]?.value ?? null;
  } catch {
    return null;
  }
}

function buildLoginPage(pathname: string, error = false): NextResponse {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Access — TheSolvers</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #EDEAE3;
      font-family: 'DM Sans', -apple-system, sans-serif;
    }
    .card {
      background: #E4E1D9;
      border: 1px solid #CCC9C0;
      border-radius: 20px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      margin: 1rem;
    }
    .logo { display: flex; align-items: center; gap: 2px; margin-bottom: 2rem; }
    .logo-the   { font-size: 20px; font-weight: 700; color: #1a1814; letter-spacing: -0.5px; font-family: Georgia, serif; }
    .logo-solvers { font-size: 20px; font-weight: 700; color: #e8633a; letter-spacing: -0.5px; font-family: Georgia, serif; }
    h2 { font-family: Georgia, serif; font-size: 22px; font-weight: 600; color: #1a1814; margin-bottom: 6px; }
    .subtitle { font-size: 13px; color: #8a8880; margin-bottom: 1.75rem; }
    label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #8a8880; margin-bottom: 7px; }
    input[type="password"] {
      width: 100%; padding: 12px 14px;
      background: transparent;
      border: 1px solid ${error ? '#b93a3a' : '#B8B5AC'};
      border-radius: 10px; font-size: 15px; color: #1a1814;
      outline: none; margin-bottom: 1rem; font-family: inherit;
      transition: border-color 0.2s;
    }
    input[type="password"]:focus { border-color: #e8633a; }
    button {
      width: 100%; padding: 12px;
      background: #e8633a; color: white; border: none;
      border-radius: 10px; font-size: 14px; font-weight: 600;
      cursor: pointer; font-family: inherit; transition: background 0.2s;
    }
    button:hover { background: #d0522a; }
    .error { font-size: 13px; color: #b93a3a; margin-top: 10px; font-weight: 500; }
    .lock {
      width: 40px; height: 40px;
      background: rgba(232,99,58,0.12);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1.25rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <span class="logo-the">The</span><span class="logo-solvers">Solvers</span>
    </div>
    <div class="lock">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8633a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </div>
    <h2>Admin Access</h2>
    <p class="subtitle">Enter the password to continue.</p>
    <form method="POST" action="/__admin_auth?redirect=${encodeURIComponent(pathname)}">
      <label>Password</label>
      <input type="password" name="password" placeholder="••••••••" autofocus />
      <button type="submit">Enter →</button>
      ${error ? '<p class="error">Incorrect password. Try again.</p>' : ''}
    </form>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Handle the auth POST endpoint ────────────────────────────────────────
  if (pathname === '/__admin_auth' && request.method === 'POST') {
    const redirect = request.nextUrl.searchParams.get('redirect') || '/admindashboard';

    // Parse form body
    const body = await request.text();
    const params = new URLSearchParams(body);
    const submitted = params.get('password') ?? '';

    // Fetch stored password from Supabase (server-side only)
    const stored = await getStoredPassword();

    if (stored && submitted === stored) {
      // Set a simple verified cookie — no password value stored
      const response = NextResponse.redirect(new URL(redirect, request.url));
      response.cookies.set(COOKIE_VERIFIED, 'true', {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
      return response;
    }

    // Wrong password — re-render login with error
    return buildLoginPage(redirect, true);
  }

  // ── Guard protected routes ────────────────────────────────────────────────
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  // Check verified cookie
  const verified = request.cookies.get(COOKIE_VERIFIED);
  if (verified?.value === 'true') return NextResponse.next();

  // Legacy: accept old password cookie during transition
  const legacy = request.cookies.get(COOKIE_NAME);
  if (legacy?.value) {
    const stored = await getStoredPassword();
    if (stored && legacy.value === stored) {
      const response = NextResponse.next();
      response.cookies.set(COOKIE_VERIFIED, 'true', {
        httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24, path: '/',
      });
      return response;
    }
  }

  // Show login gate
  return buildLoginPage(pathname);
}

export const config = {
  matcher: [
    '/__admin_auth',
    '/admindashboard/:path*',
    '/createbuilt/:path*',
    '/createcomingsoon/:path*',
    '/createadminblogs/:path*',
  ],
};

