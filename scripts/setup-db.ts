import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create a test user
    const hashedPassword = await hashPassword('password123');
    
    const user = await prisma.user.upsert({
      where: { email: 'test@kairos.edu' },
      update: {},
      create: {
        email: 'test@kairos.edu',
        name: 'Test User',
        password: hashedPassword,
      },
    });
    
    console.log('Database setup complete!');
    console.log('Created test user:');
    console.log({
      email: user.email,
      name: user.name,
      id: user.id,
    });
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
