# Kairos Authentication Setup Guide

This guide will help you set up the authentication system for Kairos, including database configuration and test user creation.

## Prerequisites

- MongoDB Atlas account or local MongoDB instance
- Node.js and npm installed

## Setup Steps

### 1. Configure Environment Variables

1. Create a `.env` file in the root directory (if it doesn't exist already)
2. Add the following environment variables:

```
DATABASE_URL="mongodb+srv://username:password@cluster0.example.mongodb.net/kairos?retryWrites=true&w=majority"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3004"
```

Replace the `DATABASE_URL` with your actual MongoDB connection string.

### 2. Generate Prisma Client

Run the following command to generate the Prisma client based on your schema:

```bash
npm run prisma:generate
```

### 3. Create a Test User

Run the setup script to create a test user in your database:

```bash
npm run setup-db
```

This will create a test user with the following credentials:
- Email: test@kairos.edu
- Password: password123

### 4. Test Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3004/signin

3. Sign in with the test credentials:
   - Email: test@kairos.edu
   - Password: password123

## Troubleshooting

### Database Connection Issues

- Verify your MongoDB instance is running
- Check that your `DATABASE_URL` is correct in the `.env` file
- Make sure your IP address is whitelisted in MongoDB Atlas (if using Atlas)

### Authentication Errors

- Ensure `NEXTAUTH_SECRET` is set in your `.env` file
- Check that the user exists in the database
- Verify the password hashing is working correctly

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique passwords for production environments
- Consider adding additional authentication providers for production
