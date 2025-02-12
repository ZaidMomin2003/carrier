import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  try {
    // Get the session token from the request
    const sessionToken = request.cookies.get('__session')?.value;

    // Public paths that don't require authentication
    const publicPaths = ['/', '/sign-in', '/sign-up'];
    const isPublicPath = publicPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    );

    if (isPublicPath) {
      return NextResponse.next();
    }

    // If there's no session token, redirect to sign in
    if (!sessionToken) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect_url', request.url);
      return NextResponse.redirect(signInUrl);
    }

    try {
      // Verify the session
      const session = await clerkClient.sessions.verifySession(sessionToken);
      if (!session) {
        throw new Error('Invalid session');
      }
    } catch (error) {
      // If session verification fails, redirect to sign in
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
