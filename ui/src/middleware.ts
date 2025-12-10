import { clerkMiddleware } from '@clerk/nextjs/server';

// Use simple Clerk middleware - route protection handled by components
export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};