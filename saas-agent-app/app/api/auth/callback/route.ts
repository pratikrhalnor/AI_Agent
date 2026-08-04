import { handleAuth } from '@workos-inc/authkit-nextjs';

export const GET = handleAuth({
  returnPathname: '/dashboard',
});

// Handle POST requests too (some OAuth flows use POST)
export const POST = handleAuth({
  returnPathname: '/dashboard',
});