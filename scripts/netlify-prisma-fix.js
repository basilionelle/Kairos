// netlify-prisma-fix.js
// This script ensures Prisma Client is properly generated during Netlify deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Running Prisma fix for Netlify deployment...');

// Check if Prisma schema exists
const prismaSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
if (!fs.existsSync(prismaSchemaPath)) {
  console.error('❌ Prisma schema not found at:', prismaSchemaPath);
  process.exit(1);
}

try {
  // Force Prisma to generate fresh client
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('✅ Prisma Client successfully generated');
  
  // Verify the client was generated
  const prismaClientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client');
  if (fs.existsSync(prismaClientPath)) {
    console.log('✅ Prisma Client directory exists at:', prismaClientPath);
  } else {
    console.warn('⚠️ Prisma Client directory not found at expected location');
  }
} catch (error) {
  console.error('❌ Error generating Prisma Client:', error.message);
  process.exit(1);
}

console.log('🚀 Prisma fix completed successfully');
