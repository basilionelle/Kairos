# Setting Up Google Analytics for Kairos

This guide will help you set up Google Analytics to track traffic on your Kairos website.

## Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/) and sign in with your Google account
2. Click "Start measuring"
3. Enter an account name (e.g., "Kairos Analytics")
4. Configure your account settings and click "Next"
5. Enter a property name (e.g., "Kairos Website")
6. Select your reporting time zone and currency, then click "Next"
7. Enter your business information, then click "Create"

## Step 2: Set Up a Data Stream

1. In your Google Analytics property, go to "Admin" (gear icon)
2. In the "Property" column, click "Data Streams"
3. Click "Add stream" and select "Web"
4. Enter your website URL: `https://kairos-ph.netlify.app/`
5. Enter a stream name (e.g., "Kairos Website")
6. Click "Create stream"

## Step 3: Get Your Measurement ID

1. After creating the stream, you'll see a Measurement ID that looks like `G-XXXXXXXXXX`
2. Copy this Measurement ID

## Step 4: Update Your Code

1. Open the file `/components/GoogleAnalytics.tsx`
2. Replace `G-XXXXXXXXXX` with your actual Measurement ID
3. Save the file

## Step 5: Deploy to Netlify

1. Commit and push your changes to GitHub:
   ```
   git add app/layout.tsx components/GoogleAnalytics.tsx ANALYTICS_SETUP.md
   git commit -m "Add Google Analytics tracking"
   git push origin main
   ```
2. Netlify will automatically deploy your updated site

## Step 6: Verify Installation

1. Wait for your Netlify deployment to complete
2. Go to your Google Analytics dashboard
3. Navigate to "Reports" > "Realtime"
4. Visit your website in another tab
5. You should see your visit appear in the realtime report

## Step 7: Access Your Analytics Dashboard

1. Visit [Google Analytics](https://analytics.google.com/) anytime to see:
   - Number of visitors
   - Traffic sources
   - User behavior
   - Popular pages
   - Geographic data
   - Device information
   - And much more

## Important Notes

- It may take up to 24 hours for Google Analytics to start collecting comprehensive data
- The realtime report should work immediately
- Make sure you comply with privacy regulations by adding a cookie consent banner if needed

For any questions or issues, refer to the [Google Analytics documentation](https://support.google.com/analytics/answer/9304153).
