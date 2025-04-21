# MongoDB Connection Guide for Kairos

## Connection Issues Detected

We attempted to connect to your MongoDB Atlas cluster but encountered a server selection timeout error. Here's how to fix it:

## Step 1: Update Your Connection String

Make sure your `.env` and `.env.local` files contain the correct connection string with your actual password:

```env
DATABASE_URL="mongodb+srv://basilionelle3:YOUR_ACTUAL_PASSWORD@kairos.yhnas57.mongodb.net/?retryWrites=true&w=majority&appName=Kairos"
NEXTAUTH_SECRET="kairos-nextauth-secret-key-2025"
NEXTAUTH_URL="http://localhost:3004"
```

## Step 2: Whitelist Your IP Address

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your project
3. Go to "Network Access" in the left sidebar
4. Click "Add IP Address"
5. You can either:
   - Add your current IP address
   - Use "Allow Access from Anywhere" (0.0.0.0/0) for development (not recommended for production)
6. Click "Confirm"

## Step 3: Verify Your Database User

1. Go to "Database Access" in MongoDB Atlas
2. Make sure the user "basilionelle3" exists and has the correct password
3. Ensure the user has appropriate permissions (at least readWrite on the kairos database)

## Step 4: Test the Connection Again

After making these changes, run the test script again:

```bash
npx ts-node scripts/create-test-user.ts
```

## Additional Troubleshooting

If you're still having issues:

1. Try connecting with MongoDB Compass using the same connection string
2. Check if your MongoDB Atlas cluster is active and running
3. Ensure you're not behind a firewall or VPN that blocks MongoDB connections
4. Verify that your MongoDB Atlas plan allows connections from your current location

## Need More Help?

- Check the [MongoDB Atlas documentation](https://docs.atlas.mongodb.com/)
- Review the [Prisma connection guide](https://www.prisma.io/docs/orm/overview/databases/mongodb)
- Consult the [NextAuth.js documentation](https://next-auth.js.org/adapters/prisma) for authentication setup
