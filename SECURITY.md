# Kairos Security Guidelines

## Environment Variables and Secrets Management

### ⚠️ Critical Security Alert

We recently identified and fixed a security vulnerability where API credentials were accidentally committed to the public GitHub repository. This document outlines the proper procedures for handling sensitive information in the Kairos project.

### Best Practices for Environment Variables

1. **Never commit secrets to Git**
   - API keys, tokens, passwords, and other secrets should never be committed to the repository
   - This includes configuration files like `netlify.toml`, `next.config.js`, etc.
   - Always use environment variables for sensitive information

2. **Use `.env.local` for local development**
   - Create a `.env.local` file for local development (this is already in `.gitignore`)
   - Store all sensitive environment variables in this file
   - Example:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

3. **Use Netlify Environment Variables for production**
   - Set environment variables in the Netlify dashboard
   - Go to Site settings > Build & deploy > Environment variables
   - Add each variable individually
   - These will be securely stored and injected during the build process

### What to Do If Secrets Are Exposed

If you accidentally commit sensitive information to the repository:

1. **Immediately revoke the exposed credentials**
   - For Supabase: Go to Project Settings > API and generate new API keys
   - Update all environments with the new keys

2. **Remove the sensitive data from Git history**
   - Use tools like BFG Repo Cleaner or git-filter-repo
   - Note: This requires force-pushing and can disrupt collaboration

3. **Notify relevant team members**
   - Ensure everyone is aware of the exposure and the remediation steps
   - Update all development environments with new credentials

### Environment Variables Reference

Here's a list of environment variables used in the Kairos project:

| Variable Name | Purpose | Where to Set |
|---------------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Netlify dashboard & .env.local |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous API key | Netlify dashboard & .env.local |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin API key (server-side only) | Netlify dashboard & .env.local |

### Security Resources

- [Netlify Environment Variables Documentation](https://docs.netlify.com/configure-builds/environment-variables/)
- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/managing-user-data)
