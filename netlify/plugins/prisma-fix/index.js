// Custom Netlify plugin to fix Prisma Client initialization issues
module.exports = {
  onPreBuild: async ({ utils }) => {
    try {
      console.log('🔧 Running Prisma fix plugin...');
      
      // Clear cache to prevent Prisma Client initialization errors
      await utils.run.command('rm -rf node_modules/.prisma');
      
      // Generate fresh Prisma Client
      await utils.run.command('npx prisma generate');
      
      console.log('✅ Prisma Client successfully generated');
    } catch (error) {
      // Report the error but don't fail the build
      utils.build.failBuild('Failed to generate Prisma Client: ' + error.message);
    }
  },
  
  onBuild: async ({ utils }) => {
    // Verify Prisma Client was generated
    try {
      await utils.run.command('ls -la node_modules/.prisma');
      console.log('✅ Prisma Client directory verified');
    } catch (error) {
      console.log('⚠️ Could not verify Prisma Client directory');
    }
  }
};
