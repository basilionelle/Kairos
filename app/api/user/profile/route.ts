import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../../lib/prisma';
import { hashPassword, comparePassword } from '../../../../lib/auth';

// Configure the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the profile' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, image, currentPassword, newPassword } = body;
    
    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (image) updateData.image = image;
    
    // If password change is requested
    if (currentPassword && newPassword) {
      // Verify current password
      const passwordValid = await comparePassword(currentPassword, user.password || '');
      
      if (!passwordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }
      
      // Hash new password
      updateData.password = await hashPassword(newPassword);
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the profile' },
      { status: 500 }
    );
  }
}
