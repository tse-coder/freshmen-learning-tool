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

export const GET: RequestHandler = async ({ request }) => {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'));

  try {
    const users = await getAllUsers();
    return new Response(JSON.stringify(users), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

// Handle preflight OPTIONS request
export const OPTIONS: RequestHandler = async ({ request }) => {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'));
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};
