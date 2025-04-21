# Deploying Kairos to Netlify

This guide will walk you through deploying the Kairos project to Netlify using GitHub.

## Prerequisites

- A GitHub account
- A Netlify account
- Your Kairos project code ready to push

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub at https://github.com/basilionelle/Kairos
2. Initialize your local repository and push your code:

```bash
# Navigate to your project directory
cd /Users/faye/Tech\ Folder/Kairos

# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add GitHub repository as remote
git remote add origin https://github.com/basilionelle/Kairos.git

# Push to GitHub
git push -u origin main
```

## Step 2: Connect to Netlify

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Select GitHub as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select the `basilionelle/Kairos` repository

## Step 3: Configure Build Settings

Configure the following build settings:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Advanced build settings**: Add the following environment variables:
  - `NETLIFY_NEXT_PLUGIN_SKIP`: `true`

## Step 4: Deploy

1. Click "Deploy site"
2. Wait for the build and deployment to complete
3. Once deployed, Netlify will provide you with a URL for your site

## Step 5: Configure Custom Domain (Optional)

1. Go to "Site settings" > "Domain management"
2. Click "Add custom domain"
3. Follow the instructions to set up your custom domain

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Netlify build logs for errors
2. Ensure all required environment variables are set
3. Verify that the `netlify.toml` file is correctly configured
4. Make sure the `.gitignore` file is not excluding necessary files

## Automatic Deployments

With the GitHub integration, Netlify will automatically deploy your site whenever you push changes to the main branch of your repository.

## Additional Resources

- [Netlify Docs for Next.js](https://docs.netlify.com/integrations/frameworks/next-js/overview/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
