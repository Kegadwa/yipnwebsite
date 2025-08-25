# Firebase Setup Guide for YIPN Admin System

This guide will help you set up Firebase for the YIPN website admin system with real-time data persistence, user authentication, and image storage.

## Prerequisites

- Node.js 16+ installed
- Firebase account
- Git installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `yipn-website` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firebase Services

### Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Click "Save"

### Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (we'll secure it later)
3. Select a location close to your users (e.g., `europe-west1`)
4. Click "Done"

### Storage
1. Go to "Storage" → "Get started"
2. Choose "Start in test mode"
3. Select the same location as Firestore
4. Click "Done"

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → "Web"
4. Register app with name: `yipn-website-web`
5. Copy the configuration object

## Step 4: Set Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 5: Create Admin User

1. In Firebase Console, go to "Authentication" → "Users"
2. Click "Add user"
3. Enter admin email and password
4. Go to "Firestore Database" → "Data"
5. Create a new collection called `users`
6. Add a document with the admin user's UID
7. Set the following fields:

```json
{
  "email": "admin@yipn.com",
  "displayName": "Admin User",
  "role": "admin",
  "permissions": {
    "canManageUsers": true,
    "canManageInstructors": true,
    "canManageBlog": true,
    "canManageMerchandise": true,
    "canUploadImages": true,
    "canExportData": true,
    "canDeleteContent": true
  },
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-01T00:00:00.000Z"
}
```

## Step 6: Set Up Firestore Security Rules

Go to "Firestore Database" → "Rules" and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin users can manage all data
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Moderators can manage content but not users
    match /instructors/{document} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.canManageInstructors == true;
    }
    
    match /blog_posts/{document} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.canManageBlog == true;
    }
    
    match /products/{document} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.canManageMerchandise == true;
    }
    
    match /categories/{document} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.canManageMerchandise == true;
    }
    
    match /orders/{document} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.canManageMerchandise == true;
    }
  }
}
```

## Step 7: Set Up Storage Security Rules

Go to "Storage" → "Rules" and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload images
    match /instructors/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.resource.size < 5 * 1024 * 1024 && // 5MB max
        request.resource.contentType.matches('image/.*');
    }
    
    match /blog/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.resource.size < 5 * 1024 * 1024 &&
        request.resource.contentType.matches('image/.*');
    }
    
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.resource.size < 5 * 1024 * 1024 &&
        request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Step 8: Install Dependencies

```bash
npm install firebase
```

## Step 9: Test the Setup

1. Start your development server: `npm run dev`
2. Go to `/admin` page
3. Sign in with your admin credentials
4. Test creating, editing, and deleting instructors
5. Test image uploads
6. Test data export/import

## User Roles and Permissions

### Admin
- Full access to all features
- Can manage users and permissions
- Can delete content

### Moderator
- Can manage instructors, blog, and merchandise
- Can upload images
- Can export data
- Cannot delete content or manage users

### Editor
- Can manage blog posts
- Can upload images
- Cannot access other sections

### Viewer
- Read-only access
- No management capabilities

## Troubleshooting

### Common Issues

1. **"Firebase connection failed"**
   - Check your environment variables
   - Verify Firebase project is active
   - Check browser console for specific errors

2. **"Permission denied"**
   - Verify Firestore security rules
   - Check user permissions in the database
   - Ensure user is authenticated

3. **"Image upload failed"**
   - Check Storage security rules
   - Verify file size (max 5MB)
   - Check file type (images only)

4. **"Real-time updates not working"**
   - Check Firestore security rules
   - Verify collection names match exactly
   - Check browser console for errors

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_DEBUG=true
```

## Security Best Practices

1. **Never commit `.env.local` to version control**
2. **Use environment-specific Firebase projects** (dev, staging, prod)
3. **Regularly review security rules**
4. **Monitor Firebase usage and costs**
5. **Backup important data regularly**

## Cost Optimization

1. **Monitor Firestore reads/writes**
2. **Use appropriate indexes**
3. **Implement pagination for large datasets**
4. **Optimize image sizes before upload**
5. **Use Firebase's free tier limits wisely**

## Support

If you encounter issues:

1. Check Firebase Console for errors
2. Review browser console logs
3. Check Firebase documentation
4. Contact the development team

## Next Steps

After setup:

1. Create additional admin users as needed
2. Set up monitoring and alerts
3. Configure backup strategies
4. Set up CI/CD for production deployment
5. Implement additional security measures

---

**Note**: This setup provides a secure foundation for your admin system. Always test thoroughly in a development environment before deploying to production.
