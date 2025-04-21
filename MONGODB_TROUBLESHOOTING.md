# MongoDB Atlas Connection Troubleshooting

We've encountered a TLS/SSL error when connecting to your MongoDB Atlas cluster. This guide will help you resolve the issue.

## The Error

```
Error type: MongoServerSelectionError
Error message: SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

This error indicates a security protocol issue between your application and MongoDB Atlas.

## Solution Options

### Option 1: Update Node.js Version

TLS issues can often be resolved by updating to a newer version of Node.js:

```bash
# Using nvm (Node Version Manager)
nvm install 18
nvm use 18

# Or download the latest LTS version from https://nodejs.org/
```

### Option 2: Use MongoDB Compass for Database Setup

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to your cluster using the connection string:
   ```
   mongodb+srv://basilionelle3:password123@kairos.yhnas57.mongodb.net/
   ```
3. Create a database named "kairos"
4. Create a collection named "User"
5. Add a document for your test user:
   ```json
   {
     "name": "Test User",
     "email": "test@kairos.edu",
     "password": "$2b$10$XFJCSYzKgFZYaVnJsXKZS.1q6lZ.iFXgqPwQCJk8JnLQSs5UpXF5m",
     "createdAt": new Date(),
     "updatedAt": new Date()
   }
   ```

### Option 3: Use MongoDB Atlas UI to Create User

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your cluster
3. Go to "Collections"
4. Create a database named "kairos"
5. Create a collection named "User"
6. Add a document for your test user (same as Option 2)

### Option 4: Use a Mock Authentication for Development

If you're just working on the frontend, you can modify the NextAuth configuration to use a mock provider:

1. Edit `/app/api/auth/[...nextauth]/route.ts`
2. Replace the Credentials provider with a mock implementation

## Verifying Your MongoDB Atlas Setup

1. **Check Network Access**: Make sure your IP is whitelisted
2. **Verify Database User**: Ensure the user has the correct permissions
3. **Check Cluster Status**: Verify the cluster is active and running
4. **Test with MongoDB Compass**: Try connecting with MongoDB Compass to isolate the issue

## Need More Help?

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Node.js TLS Documentation](https://nodejs.org/api/tls.html)
