# 🔥 Firebase Setup Guide - CRITICAL FIRST STEP

## Why Firebase First?
**95% of the backend functionality depends on Firebase being properly configured.** Without real Firebase credentials, everything returns fake data.

## Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Visit https://console.firebase.google.com/
2. Click "Create a project" or use existing project
3. **Project name**: `tutora-production` (or your preferred name)
4. **Enable Google Analytics**: Yes (recommended)
5. Click "Create project"

### 1.2 Enable Required Services
Once project is created:

1. **Authentication**:
   - Go to "Authentication" → "Get started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password"
   - Enable "Google" (optional but recommended)

2. **Firestore Database**:
   - Go to "Firestore Database" → "Create database"
   - **Start in production mode** (we'll configure rules later)
   - **Location**: Choose closest to your users (e.g., us-central1)

3. **Storage**:
   - Go to "Storage" → "Get started"
   - **Start in production mode**
   - Use same location as Firestore

## Step 2: Get Service Account Credentials

### 2.1 Generate Service Account Key
1. Go to "Project Settings" (gear icon)
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. **IMPORTANT**: Download the JSON file
5. **Keep this file SECURE** - it has admin access to your Firebase

### 2.2 Extract Credentials
From the downloaded JSON file, you need:
- `project_id`
- `client_email` 
- `private_key`

## Step 3: Get Web App Credentials

### 3.1 Register Web App
1. In Firebase Console → Project Overview
2. Click "Web" icon (</>) to add web app
3. **App nickname**: "Tutora Admin Portal"
4. **Enable Firebase Hosting**: No (we use Vercel)
5. Click "Register app"

### 3.2 Get Web Config
Copy the config object that looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "tutora-production.firebaseapp.com",
  projectId: "tutora-production",
  storageBucket: "tutora-production.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 3.3 Register Mobile Apps
1. Click "iOS" icon to add iOS app
   - **iOS bundle ID**: `com.tutora.app`
   - Download `GoogleService-Info.plist`

2. Click "Android" icon to add Android app
   - **Android package name**: `com.tutora.app`
   - Download `google-services.json`

## Step 4: Configure Environment Variables

### 4.1 Update .env.local
Replace these in `tutora-admin-portal/.env.local`:

```bash
# Firebase Admin (from service account JSON)
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"

# Web Firebase Config (from web app config)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4.2 Update Vercel Environment Variables
1. Go to https://vercel.com/dashboard
2. Select your Tutora project
3. Go to "Settings" → "Environment Variables"
4. Add all the Firebase variables above

## Step 5: Update Flutter Firebase Config

### 5.1 Replace lib/firebase_options.dart
Use the credentials from Step 3.2:

```dart
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return macos;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'YOUR_WEB_API_KEY',
    appId: 'YOUR_WEB_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'YOUR_PROJECT_ID',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    storageBucket: 'YOUR_PROJECT.appspot.com',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'YOUR_ANDROID_API_KEY',
    appId: 'YOUR_ANDROID_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'YOUR_IOS_API_KEY',
    appId: 'YOUR_IOS_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    iosBundleId: 'com.tutora.app',
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'YOUR_MACOS_API_KEY',
    appId: 'YOUR_MACOS_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    iosClientId: 'YOUR_MACOS_CLIENT_ID',
    iosBundleId: 'com.tutora.app',
  );
}
```

### 5.2 Add Firebase Config Files
- Copy `google-services.json` to `android/app/`
- Copy `GoogleService-Info.plist` to `ios/Runner/`

## Step 6: Set Up Firestore Security Rules

### 6.1 Configure Database Rules
In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Companies collection
    match /companies/{companyId} {
      allow read, write: if request.auth != null && 
        (request.auth.token.admin == true || 
         request.auth.token.companyId == companyId);
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         request.auth.token.admin == true);
    }
    
    // Modules collection
    match /modules/{moduleId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Support tickets
    match /support_tickets/{ticketId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 7: Test Firebase Connection

### 7.1 Test Admin Portal
```bash
cd tutora-admin-portal
npm run dev
```
Visit http://localhost:3000 and check browser console for Firebase connection.

### 7.2 Test Flutter App
```bash
flutter run
```
Check console for Firebase initialization success.

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Storage enabled
- [ ] Service account key downloaded
- [ ] Web app registered and config obtained
- [ ] Mobile apps registered and config files downloaded
- [ ] Environment variables updated in .env.local
- [ ] Vercel environment variables updated
- [ ] Flutter firebase_options.dart updated
- [ ] Firebase config files added to mobile apps
- [ ] Firestore security rules configured
- [ ] Admin portal connects to Firebase (no console errors)
- [ ] Flutter app connects to Firebase (no console errors)

## 🆘 If You Get Stuck

**Common Issues:**
1. **Private key format**: Ensure newlines are properly escaped as `\n`
2. **Project ID mismatch**: Must match exactly between all configs
3. **Rules too restrictive**: Start with permissive rules, tighten later
4. **Bundle ID mismatch**: iOS bundle ID must match in Xcode project

**Need Help?**
1. Check Firebase Console for any red error indicators
2. Look at browser/terminal console for specific error messages
3. Verify all environment variables are set correctly

---

**📝 IMPORTANT**: Complete this Firebase setup BEFORE I proceed with fixing the backend. Once Firebase is working, I can replace all the mock data with real database operations.

Send me a screenshot of your Firebase console showing the project created with Authentication, Firestore, and Storage enabled, then I'll start the comprehensive backend fixes. 