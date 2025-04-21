const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get the connection string from environment variables
const uri = process.env.DATABASE_URL;

// Function to parse MongoDB connection string
function parseMongoUri(uri) {
  try {
    // Basic pattern for MongoDB connection string
    const pattern = /mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)?(\?.*)?/;
    const match = uri.match(pattern);
    
    if (!match) return { valid: false, message: 'Invalid MongoDB connection string format' };
    
    return {
      valid: true,
      username: match[1],
      password: match[2] ? '********' : 'missing', // Hide actual password
      host: match[3],
      database: match[4] || 'none',
      options: match[5] || 'none'
    };
  } catch (error) {
    return { valid: false, message: 'Error parsing connection string' };
  }
}

// Print connection details (hiding password)
const connectionDetails = parseMongoUri(uri);
console.log('MongoDB Connection Details:');
console.log('-------------------------');
if (connectionDetails.valid) {
  console.log(`Username: ${connectionDetails.username}`);
  console.log(`Password: ${connectionDetails.password}`);
  console.log(`Host: ${connectionDetails.host}`);
  console.log(`Database: ${connectionDetails.database}`);
  console.log(`Options: ${connectionDetails.options}`);
} else {
  console.log(`Error: ${connectionDetails.message}`);
  console.log(`Raw string: ${uri.substring(0, 20)}...`);
}
console.log('-------------------------');

async function testConnection() {
  const client = new MongoClient(uri, { 
    serverSelectionTimeoutMS: 5000, // 5 second timeout
    connectTimeoutMS: 5000
  });

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    // List databases to verify connection works
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    console.log('Available databases:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB');
    console.error(`Error type: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    
    // Provide specific troubleshooting based on error
    if (error.message.includes('authentication failed')) {
      console.log('\n🔍 Authentication Error:');
      console.log('- Check that your username and password are correct');
      console.log('- Verify the user exists in MongoDB Atlas Database Access');
    } else if (error.message.includes('timed out')) {
      console.log('\n🔍 Connection Timeout:');
      console.log('- Whitelist your IP address in MongoDB Atlas Network Access');
      console.log('- Check if MongoDB Atlas is accessible from your network');
      console.log('- Verify that your cluster is active and running');
    } else if (error.message.includes('getaddrinfo')) {
      console.log('\n🔍 DNS Resolution Error:');
      console.log('- Check your internet connection');
      console.log('- Verify the hostname in your connection string');
    }
    
    return false;
  } finally {
    await client.close();
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('\n✨ Your MongoDB connection is working properly!');
      console.log('You can now proceed with setting up authentication.');
    } else {
      console.log('\n⚠️ Please fix the connection issues before continuing.');
      console.log('Refer to the mongodb-connection-guide.md for more help.');
    }
  });
