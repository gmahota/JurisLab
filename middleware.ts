import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for a protected route
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtected) {
    // Check for session token in cookies (placeholder - replace with real auth)
    const token = request.cookies.get('jurislab-session')?.value

    // For now, allow all requests through (auth not yet enforced)
    // When real auth is ready, uncomment:
    // if (!token) {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }

    // Admin routes require admin role
    // if (pathname.startsWith('/admin')) {
    //   const role = getUserRoleFromToken(token)
    //   if (role !== 'ADMIN') {
    //     return NextResponse.redirect(new URL('/dashboard', request.url))
    //   }
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*|api).*)',
  ],
}
