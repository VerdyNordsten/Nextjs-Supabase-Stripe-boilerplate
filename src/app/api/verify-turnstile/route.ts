import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Turnstile] Development mode - skipping verification');
      return NextResponse.json({ 
        success: true,
        'dev-mode': true 
      });
    }

    const body = await request.json();
    const token = body['cf-turnstile-response'] || body.token;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Turnstile token is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const verificationResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!verificationResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Verification service unavailable' },
        { status: 503 }
      );
    }

    const verificationResult = await verificationResponse.json();

    if (verificationResult.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: 'Verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}