/**
 * Edge Runtime Compatible Authentication
 *
 * Uses Web Crypto API instead of Node.js crypto module
 * For use in Next.js middleware (Edge Runtime)
 */

const ADMIN_SECRET = process.env.ADMIN_SECRET || '';
const SESSION_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export interface SessionData {
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

/**
 * Generate HMAC signature using Web Crypto API
 */
async function generateSignature(data: SessionData): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(ADMIN_SECRET);
  const payload = encoder.encode(JSON.stringify(data));

  // Import key for HMAC
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Generate signature
  const signature = await crypto.subtle.sign('HMAC', key, payload);

  // Convert to hex
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify session token (Edge Runtime compatible)
 */
export async function verifySessionTokenEdge(token: string): Promise<SessionData | null> {
  try {
    // Decode token
    const decoded = JSON.parse(atob(token));
    const { data, signature } = decoded;

    // Verify signature
    const expectedSignature = await generateSignature(data);
    if (signature !== expectedSignature) {
      return null;
    }

    // Check expiration
    if (Date.now() > data.expiresAt) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

/**
 * Check if session is valid (Edge Runtime compatible)
 */
export async function isSessionValid(token: string | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }

  const session = await verifySessionTokenEdge(token);
  return session !== null;
}
