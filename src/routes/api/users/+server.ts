// src/routes/api/users/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { getAllUsers } from '../../../api/controllers/users';

// Define allowed origins
const allowedOrigins = [
  'http://localhost:8081',       // your local dev server
  'capacitor://localhost',       // for Capacitor-based mobile apps
  'http://192.168.',             // allow local network IPs (mobile devices on same Wi-Fi)
];

function getCorsHeaders(origin: string | null) {
  let corsOrigin = 'null';

  if (origin) {
    // allow if origin matches allowed list or starts with local network IP prefix
    const isAllowed =
      allowedOrigins.some((o) => origin.startsWith(o));
    if (isAllowed) corsOrigin = origin;
  }

  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

import { asyncHandler } from '../../../lib/server/errors';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../lib/server/rateLimit';

const generalLimiter = rateLimit(RATE_LIMITS.GENERAL);

const handler = asyncHandler(async ({ request }) => {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'));
  const users = await getAllUsers();
  return new Response(JSON.stringify({ ok: true, data: users }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
});

export const GET: RequestHandler = withRateLimit(generalLimiter, handler);

// Handle preflight OPTIONS request
export const OPTIONS: RequestHandler = async ({ request }) => {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'));
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};
