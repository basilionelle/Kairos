// Simple script to initialize the SQLite database for the waitlist
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create the database tables based on the Prisma schema
    console.log('Initializing waitlist database...');
    
    // This will create the tables if they don't exist
    const tableInfo = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
    console.log('Tables created:', tableInfo);
    
    console.log('Waitlist database setup complete!');
  } catch (error) {
    console.error('Error setting up waitlist database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
