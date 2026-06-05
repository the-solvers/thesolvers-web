export const ADMIN_COOKIE_LEGACY = 'admin_auth';
export const ADMIN_COOKIE_VERIFIED = 'admin_verified';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function getStoredAdminPassword(): Promise<string | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_config?select=value&key=eq.admin_password&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
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
