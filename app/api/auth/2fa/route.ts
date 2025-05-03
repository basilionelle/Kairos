import { NextRequest, NextResponse } from 'next/server';

// Configure the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getServerSession } from 'next-auth/next';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import prisma from '../../../../lib/prisma';

// Enable 2FA for a user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Generate a secret key for the user
    const secret = authenticator.generateSecret();
    
    // Create a QR code for the user to scan
    const otpauth = authenticator.keyuri(user.email, 'Kairos', secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauth);
    
    // In a real application, you would store the secret in the database
    // For this demo, we'll just return it
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { twoFactorSecret: secret },
    // });
    
    return NextResponse.json({
      secret,
      qrCodeUrl,
      message: 'Scan the QR code with your authenticator app',
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'An error occurred while setting up 2FA' },
      { status: 500 }
    );
  }
}

// Verify 2FA token
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { token, secret } = body;
    
    if (!token || !secret) {
      return NextResponse.json(
        { error: 'Token and secret are required' },
        { status: 400 }
      );
    }
    
    // Verify the token
    const isValid = authenticator.verify({
      token,
      secret,
    });
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }
    
    // In a real application, you would enable 2FA for the user
    // await prisma.user.update({
    //   where: { email: session.user.email },
    //   data: { twoFactorEnabled: true },
    // });
    
    return NextResponse.json({
      message: '2FA verified successfully',
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred while verifying 2FA' },
      { status: 500 }
    );
  }
}
