import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // TEMPORARY: Always log to see if middleware is running
  console.log('🔒 Middleware running for path:', pathname);
  
  // Check for admin and dashboard routes that should be protected
  const isProtectedRoute = 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.includes('dashboard-');
  
  console.log('🔒 Is protected route?', isProtectedRoute);
  
  if (isProtectedRoute) {
    // Check for various possible authentication cookie names
    const adminSession = request.cookies.get('admin_session');
    const authToken = request.cookies.get('auth_token');
    const sessionToken = request.cookies.get('session_token');
    const token = request.cookies.get('token');
    
    // Debug logging (always)
    console.log('🔒 Middleware: Checking route:', pathname);
    console.log('🔒 Middleware: All cookies:', request.cookies.getAll());
    console.log('🔒 Middleware: Auth cookies found:', {
      adminSession: adminSession?.value,
      authToken: authToken?.value,
      sessionToken: sessionToken?.value,
      token: token?.value
    });
    
    // If no authentication cookie exists, redirect to login
    if (!adminSession && !authToken && !sessionToken && !token) {
      console.log('🔒 Middleware: No auth cookies found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    console.log('🔒 Middleware: Auth cookies found, allowing access');
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/dashboard-home',
    '/dashboard-add-property',
    '/dashboard-my-properties',
    '/dashboard-my-profile',
    '/dashboard-my-package',
    '/dashboard-my-favourites',
    '/dashboard-message',
    '/dashboard-reviews',
    '/dashboard-saved-search'
  ],
}; 