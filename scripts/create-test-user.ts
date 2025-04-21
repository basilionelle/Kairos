import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Hash a password (copied from lib/auth.ts to avoid import issues)
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// This script creates a test user in the MongoDB database
// Run with: npx ts-node scripts/create-test-user.ts

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    
    // Hash the password for secure storage
    const hashedPassword = await hashPassword('kairos123');
    
    console.log('Creating test user...');
    
    // Create or update the test user
    const user = await prisma.user.upsert({
      where: { email: 'test@kairos.edu' },
      update: {
        name: 'Test User',
        password: hashedPassword,
      },
      create: {
        email: 'test@kairos.edu',
        name: 'Test User',
        password: hashedPassword,
      },
    });
    
    console.log('✅ Test user created successfully!');
    console.log('User details:');
    console.log({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    console.log('\nYou can now sign in with:');
    console.log('Email: test@kairos.edu');
    console.log('Password: kairos123');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check that your DATABASE_URL in .env is correct');
    console.log('2. Make sure you replaced <db_password> with your actual password');
    console.log('3. Verify that your IP address is whitelisted in MongoDB Atlas');
  } finally {
    await prisma.$disconnect();
  }
}

main();
