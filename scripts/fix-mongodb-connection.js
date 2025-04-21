const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Path to your .env file
const envPath = path.join(__dirname, '..', '.env');
const envLocalPath = path.join(__dirname, '..', '.env.local');
const tempEnvPath = path.join(__dirname, '..', '.env.temp');

// Read the temporary connection string
console.log('Reading temporary connection configuration...');
const tempEnvContent = fs.readFileSync(tempEnvPath, 'utf8');

// Update the .env and .env.local files
console.log('Updating your database connection strings...');
fs.writeFileSync(envPath, tempEnvContent);
fs.writeFileSync(envLocalPath, tempEnvContent);

// Delete the temporary file
console.log('Cleaning up temporary files...');
fs.unlinkSync(tempEnvPath);

console.log('✅ Connection strings updated successfully!');
console.log('Now testing the MongoDB connection...');

// Test the connection by running the create-test-user script
exec('npx ts-node scripts/create-test-user.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error testing connection:', error.message);
    console.log(stdout);
    console.error(stderr);
    
    console.log('\n🔍 Additional troubleshooting:');
    console.log('1. Make sure your MongoDB Atlas cluster is active');
    console.log('2. Whitelist your IP address in MongoDB Atlas Network Access settings');
    console.log('3. Check that the username and password are correct');
    console.log('4. Verify that your MongoDB Atlas free tier hasn\'t expired');
    return;
  }
  
  console.log(stdout);
  
  if (stdout.includes('Test user created successfully')) {
    console.log('\n🎉 Success! Your MongoDB connection is working properly.');
    console.log('You can now sign in with the test user credentials.');
  } else {
    console.log('\n⚠️ The connection test completed but may not have been successful.');
    console.log('Please check the output above for more details.');
  }
});
