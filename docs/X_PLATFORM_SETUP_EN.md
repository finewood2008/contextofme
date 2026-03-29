# X Platform API Setup Guide

## Prerequisites
- X (Twitter) account
- X Developer account (free)

## Step 1: Apply for X Developer Account

1. Visit https://developer.twitter.com/
2. Click "Sign up" or "Apply" in the top right
3. Log in with your X account
4. Fill out the application form:
   - Purpose: "Building tools for myself" or "Exploring the API"
   - Use case: "Personal content automation and social media management"
   - Agree to developer terms
5. Submit - usually approved within minutes

## Step 2: Create an App

1. Log in to https://developer.twitter.com/en/portal/dashboard
2. Click "Projects & Apps" in the left sidebar
3. Click "+ Create App" button
4. Fill in app details:
   - **App name**: `contextofme` (or any name)
   - **Description**: "Personal context vault with social media integration"
   - **Website URL**: `https://contextof.me` (or your website)
5. Click "Create"

## Step 3: Configure App Permissions

1. In the app details page, click the "Settings" tab
2. Find "User authentication settings" section
3. Click "Set up" button
4. Configure permissions:
   - **App permissions**: Select "Read and write" ✅ (Important!)
   - **Type of App**: Select "Web App, Automated App or Bot"
   - **Callback URI**: Enter `https://contextof.me/callback` (can be any URL)
   - **Website URL**: `https://contextof.me`
5. Click "Save"

## Step 4: Get API Credentials

### 4.1 Get API Key and API Secret

1. In the app details page, click "Keys and tokens" tab
2. Find "Consumer Keys" section
3. You'll see:
   - **API Key** (also called Consumer Key)
   - **API Key Secret** (also called Consumer Secret)
4. Click "Show" to view the full keys
5. Copy these two values

**Mapping:**
- `API Key` → Enter in contextof.me **API Key** field
- `API Key Secret` → Enter in contextof.me **API Secret** field

### 4.2 Generate Access Token and Access Token Secret

1. On the same page, find "Authentication Tokens" section
2. Click "Generate" to create Access Token
3. You'll see:
   - **Access Token**
   - **Access Token Secret**
4. ⚠️ **Important**: These values are shown only once - copy them immediately!
5. If you accidentally close the window, click "Regenerate"

**Mapping:**
- `Access Token` → Enter in contextof.me **Access Token** field
- `Access Token Secret` → Enter in contextof.me **Access Token Secret** field

## Step 5: Configure in contextof.me

1. Log in to https://contextof.me
2. Go to Dashboard
3. Click "INTEGRATIONS" tab
4. In "X Platform Configuration" section, enter:
   - **API Key**: Paste API Key from step 4.1
   - **API Secret**: Paste API Key Secret from step 4.1
   - **Access Token**: Paste Access Token from step 4.2
   - **Access Token Secret**: Paste Access Token Secret from step 4.2
5. (Optional) Enable "Auto-post to X" toggle to automatically post new slices
6. Click "Save Configuration"

## Step 6: Test

1. Go back to "VAULT" tab
2. Find any slice
3. Hover over it and click the "Send" icon in the top right
4. If configured correctly, you'll see "Posted to X"
5. Check your X account - you should see the posted tweet

## Troubleshooting

### Q: Error "X platform credentials not configured"
A: You haven't saved the configuration or a field is empty. Check that all 4 fields are filled.

### Q: Error "Twitter API error: 403 Forbidden"
A: App permissions are insufficient. Go back to step 3 and ensure "Read and write" is selected.

### Q: Error "Invalid signature"
A: API Secret or Access Token Secret is incorrect. Re-copy and paste, making sure there are no extra spaces.

### Q: Accidentally closed Access Token window?
A: Click "Regenerate" in X Developer Portal, then update the configuration in contextof.me.

### Q: Will tweets show "via contextofme"?
A: Yes, tweets will show the source as your app name.

## Security Tips

- ⚠️ **Never share your API Secret and Access Token Secret**
- ⚠️ These credentials can fully control your X account
- ⚠️ If leaked, immediately regenerate them in X Developer Portal
- ✅ contextof.me securely encrypts and stores your credentials

## Reference Diagram

### X Developer Portal - Keys and tokens page
```
OAuth 1.0a Keys
├── Consumer Key (API Key)          → API Key
├── Consumer Secret (API Secret)    → API Secret
└── Authentication Tokens
    ├── Access Token                → Access Token
    └── Access Token Secret         → Access Token Secret
```

---

After configuration, you can:
1. Manually click the send button to post slices to X
2. Enable auto-post to automatically sync new slices to X
3. View post history in Dashboard

Questions? Contact us anytime!
