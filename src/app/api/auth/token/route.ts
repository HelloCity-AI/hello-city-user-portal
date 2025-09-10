import { type NextRequest, NextResponse } from 'next/server';
import { auth0 } from '../../../../lib/auth0';

export async function GET(_request: NextRequest) {
  try {
    // Get current session
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthenticated user' }, { status: 401 });
    }

    // Try to get access token (correct usage for Next.js 14 App Router)
    try {
      const accessTokenResult = await auth0.getAccessToken();

      if (accessTokenResult?.token) {
        return NextResponse.json({
          accessToken: accessTokenResult.token,
          tokenType: 'Bearer',
          message: 'Successfully obtained access token',
        });
      } else {
        // If no access token, it might be because audience is not configured
        return NextResponse.json({
          message:
            'User is authenticated, but unable to get access token (API audience may not be configured)',
          user: session.user,
          hasSession: true,
        });
      }
    } catch (tokenError) {
      console.warn('Unable to get access token:', tokenError);
      return NextResponse.json({
        message: 'User is authenticated, but failed to get access token',
        user: session.user,
        hasSession: true,
        tokenError: tokenError instanceof Error ? tokenError.message : String(tokenError),
      });
    }
  } catch (error) {
    console.error('Failed to get session:', error);
    return NextResponse.json(
      {
        error: 'Error occurred while getting session',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
