import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function middleware(req) {
  const token = req.cookies.get('token'); // Retrieve the token from cookies
  
  const publicPaths = ['/signin', '/signup']; // Paths accessible without authentication

  const url = req.nextUrl.clone();

  // Allow access to public paths
  if (publicPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If token is missing or invalid, redirect to Sign In page
  if (!token) {
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  try {
    // Verify token (optional: customize payload usage)
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next(); // User is authenticated
  } catch (err) {
    url.pathname = '/signin';
    return NextResponse.redirect(url); // Redirect invalid tokens to Sign In
  }
}

export const config = {
  matcher: '/((?!api|_next|static).*)', // Protect all pages except API routes and public assets
};
