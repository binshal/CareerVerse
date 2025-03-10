import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Define the shape of your session claims metadata
interface SessionMetadata {
  onboardingComplete?: boolean;
}

// Define the shape of your session claims
interface CustomSessionClaims {
  metadata?: SessionMetadata;
}

const isOnboardingRoute = createRouteMatcher(['/career-path','/dashboard','/skills','/mentor'])
const isPublicRoute = createRouteMatcher(["/", "/about", "/sign-in(.*)", "/sign-up(.*)", "/api(.*)"])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  
  // Type cast sessionClaims to our custom interface
  const customClaims = sessionClaims as CustomSessionClaims
  
  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next()
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    // return redirectToSignIn({ returnBackUrl: req.url })
    const returningUrl = new URL('/', req.url)
    return NextResponse.redirect(returningUrl)
  }

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboarding route to complete onboarding
  if (userId && !customClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && !isPublicRoute(req)) {
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}