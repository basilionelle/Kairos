const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const { hashSync } = require('bcrypt');

// Local MongoDB connection string
const localUri = "mongodb://localhost:27017/kairos";

// Update .env files with local connection
function updateEnvFiles() {
  const envContent = `DATABASE_URL="${localUri}"
NEXTAUTH_SECRET="kairos-nextauth-secret-key-2025"
NEXTAUTH_URL="http://localhost:3004"`;

  const envPath = path.join(__dirname, '..', '.env');
  const envLocalPath = path.join(__dirname, '..', '.env.local');
  
  fs.writeFileSync(envPath, envContent);
  fs.writeFileSync(envLocalPath, envContent);
  
  console.log('✅ Environment files updated with local MongoDB connection');
}

// Create a test user in the local database
async function createTestUser() {
  const client = new MongoClient(localUri);
  
  try {
    await client.connect();
    console.log('✅ Connected to local MongoDB');
    
    const db = client.db();
    
    // Hash password (salt rounds = 10)
    const hashedPassword = hashSync('password123', 10);
    
    // Create a unique ID for the user
    const userId = new Date().getTime().toString();
    
    // Create test user
    const result = await db.collection('User').updateOne(
      { email: 'test@kairos.edu' },
      { 
        $set: {
          _id: userId,
          name: 'Test User',
          email: 'test@kairos.edu',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log('✅ Test user created successfully!');
    console.log('User details:');
    console.log({
      id: userId,
      email: 'test@kairos.edu',
      name: 'Test User'
    });
    
    console.log('\nYou can now sign in with:');
    console.log('Email: test@kairos.edu');
    console.log('Password: password123');
    
    return true;
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    return false;
  } finally {
    await client.close();
  }
}

// Main function
async function main() {
  console.log('Setting up local MongoDB for Kairos...');
  
  // Update environment files
  updateEnvFiles();
  
  // Create test user
  const success = await createTestUser();
  
  if (success) {
    console.log('\n🎉 Local MongoDB setup complete!');
    console.log('You can now use the authentication system with the local database.');
    console.log('\nTo start the application:');
    console.log('1. Run: npm run dev');
    console.log('2. Navigate to: http://localhost:3004/signin');
    console.log('3. Sign in with the test user credentials');
  } else {
    console.log('\n⚠️ Local MongoDB setup failed.');
    console.log('Please make sure MongoDB is installed and running on your machine.');
    console.log('You can install MongoDB using:');
    console.log('  - macOS: brew install mongodb-community');
    console.log('  - Windows: Download from https://www.mongodb.com/try/download/community');
  }
}

// Run the setup
main().catch(console.error);
