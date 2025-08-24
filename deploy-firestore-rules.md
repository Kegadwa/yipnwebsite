# Deploy Firestore Security Rules

To fix the "Missing or insufficient permissions" error, you need to deploy the Firestore security rules to your Firebase project.

## Option 1: Using Firebase Console (Recommended for beginners)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `thewebsite-3cd60`
3. In the left sidebar, click on **Firestore Database**
4. Click on the **Rules** tab
5. Replace the existing rules with the content from `firestore.rules`
6. Click **Publish**

## Option 2: Using Firebase CLI

If you have Firebase CLI installed:

1. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Current Rules (Open Access)

The rules in `firestore.rules` currently allow open read/write access to all collections. This is **NOT recommended for production** but will get your admin dashboard working immediately.

## Production Rules

Once everything is working, you should update the rules to be more restrictive. Uncomment the alternative rules in `firestore.rules` and comment out the open access rules.

## Test the Connection

After deploying the rules, try accessing the admin page again with password: `YIPN2024`

The Firebase connection should now work and you should be able to add merchandise to the database.
