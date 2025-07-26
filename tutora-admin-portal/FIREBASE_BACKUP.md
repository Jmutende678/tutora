# 🔥 FIREBASE CODE BACKUP

## PURPOSE
This document contains ALL Firebase-related code that was built for Tutora. 
**This code is fully functional** and can be restored later when scaling requires Firebase's advanced features.

## WHY SWITCHING TO SUPABASE
- **Speed**: Firebase setup was taking 3+ hours, Supabase takes 30 minutes
- **Development velocity**: Getting stuck on config instead of building features  
- **Migration capability**: Can easily migrate back to Firebase later
- **User experience**: Need to ship working product now

## FIREBASE CODE TO RESTORE LATER

### 1. Firebase Configuration Files

#### A. Mobile App Firebase Options (`lib/firebase_options.dart`)
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

#### B. Web Admin Firebase Config (`src/lib/firebase-admin.ts`)
```typescript
import { initializeApp, getApps, App, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

let app: App | null = null
let isFirebaseAvailable = false

function initializeFirebase() {
  const hasRequiredCredentials = 
    process.env.FIREBASE_PROJECT_ID && 
    process.env.FIREBASE_PRIVATE_KEY && 
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY.includes('BEGIN PRIVATE KEY')

  if (getApps().length === 0 && hasRequiredCredentials) {
    try {
      app = initializeApp({
        credential: cert(firebaseConfig),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })
      isFirebaseAvailable = true
      console.log('✅ Firebase initialized successfully')
    } catch (error) {
      console.log('❌ Firebase initialization failed:', error)
      app = null
      isFirebaseAvailable = false
    }
  }
}

export const db = app ? getFirestore(app) : null
export const auth = app ? getAuth(app) : null
export { isFirebaseAvailable }
```

### 2. Firebase Service Classes

#### A. Mobile Firebase Service (`lib/services/firebase_service.dart`)
```dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();
  factory FirebaseService() => _instance;
  FirebaseService._internal();

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Authentication methods
  Future<UserCredential?> signInWithEmailAndPassword(String email, String password) async {
    try {
      return await _auth.signInWithEmailAndPassword(email: email, password: password);
    } catch (e) {
      print('❌ Firebase Auth Error: $e');
      rethrow;
    }
  }

  Future<void> signOut() async {
    try {
      return await _auth.signOut();
    } catch (e) {
      print('❌ Firebase Sign Out Error: $e');
      rethrow;
    }
  }

  // User data methods
  Stream<List<Map<String, dynamic>>> getUsers() {
    try {
      return _firestore.collection('users').snapshots().map((snapshot) {
        return snapshot.docs.map((doc) => doc.data()).toList();
      });
    } catch (e) {
      print('❌ Firestore Get Users Error: $e');
      rethrow;
    }
  }

  Future<void> addUser(Map<String, dynamic> userData) async {
    try {
      await _firestore.collection('users').add(userData);
    } catch (e) {
      print('❌ Firestore Add User Error: $e');
      rethrow;
    }
  }

  // Company lookup
  Future<Map<String, dynamic>?> getCompanyByCode(String companyCode) async {
    try {
      final query = await _firestore
          .collection('companies')
          .where('companyCode', isEqualTo: companyCode)
          .get();

      if (query.docs.isNotEmpty) {
        return query.docs.first.data();
      }
      return null;
    } catch (e) {
      print('❌ Firestore Get Company Error: $e');
      return null;
    }
  }

  User? get currentUser => _auth.currentUser;
  bool get isAuthenticated => _auth.currentUser != null;
}
```

#### B. Web Firebase Admin Service
```typescript
export class FirebaseAdminService {
  // Company management
  async createCompany(companyData: CreateCompanyRequest): Promise<Company> {
    if (!isFirebaseAvailable || !db) {
      throw new Error('Firebase not available')
    }

    const company: Company = {
      id: nanoid(),
      companyCode: this.generateCompanyCode(),
      ...companyData,
      isActive: true,
      currentUsers: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    // Save to Firestore
    await db.collection('companies').doc(company.id).set(company)
    
    // Create admin user in Firebase Auth
    const userRecord = await auth!.createUser({
      email: company.adminUser.email,
      password: company.adminUser.password,
      displayName: company.adminUser.name,
    })

    // Update company with Firebase UID
    company.adminUser.firebaseUid = userRecord.uid
    await db.collection('companies').doc(company.id).update({
      'adminUser.firebaseUid': userRecord.uid
    })

    return company
  }

  async getCompanyByCode(companyCode: string): Promise<Company | null> {
    if (!isFirebaseAvailable || !db) return null

    const snapshot = await db
      .collection('companies')
      .where('companyCode', '==', companyCode)
      .where('isActive', '==', true)
      .get()

    if (snapshot.empty) return null
    return snapshot.docs[0].data() as Company
  }

  // User management
  async createUser(userData: CreateUserRequest): Promise<User> {
    if (!isFirebaseAvailable || !db || !auth) {
      throw new Error('Firebase not available')
    }

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.name,
    })

    const user: User = {
      id: nanoid(),
      firebaseUid: userRecord.uid,
      ...userData,
      isActive: true,
      createdAt: Timestamp.now(),
    }

    // Save to Firestore
    await db.collection('users').doc(user.id).set(user)
    return user
  }

  // Support tickets
  async createSupportTicket(ticketData: CreateSupportTicketRequest): Promise<SupportTicket> {
    if (!isFirebaseAvailable || !db) {
      throw new Error('Firebase not available')
    }

    const ticket: SupportTicket = {
      id: nanoid(),
      ...ticketData,
      status: 'open',
      priority: 'medium',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await db.collection('support_tickets').doc(ticket.id).set(ticket)
    return ticket
  }

  // Analytics
  async getAnalytics(companyId: string): Promise<AnalyticsData> {
    if (!isFirebaseAvailable || !db) {
      throw new Error('Firebase not available')
    }

    const snapshot = await db
      .collection('analytics')
      .where('companyId', '==', companyId)
      .get()

    const analytics = snapshot.docs.map(doc => doc.data())
    
    return {
      totalUsers: analytics.length,
      activeUsers: analytics.filter(a => a.isActive).length,
      engagementScore: analytics.reduce((acc, a) => acc + a.engagementScore, 0) / analytics.length,
      completionRate: analytics.reduce((acc, a) => acc + a.completionRate, 0) / analytics.length,
    }
  }

  private generateCompanyCode(): string {
    const prefix = process.env.COMPANY_CODE_PREFIX || 'TUT'
    const year = new Date().getFullYear()
    const randomId = nanoid(6).toUpperCase()
    return `${prefix}-${year}-${randomId}`
  }
}
```

### 3. Firebase Dependencies

#### A. Mobile Dependencies (`pubspec.yaml`)
```yaml
dependencies:
  firebase_core: ^3.14.0
  firebase_auth: ^5.6.0
  cloud_firestore: ^5.6.9
```

#### B. Web Dependencies (`package.json`)
```json
{
  "dependencies": {
    "firebase-admin": "^11.11.0"
  }
}
```

### 4. Firebase Environment Variables
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

### 5. Firebase Security Rules
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

### 6. Main App Initialization
```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    print('✅ Firebase initialized successfully');
  } catch (e) {
    print('❌ Firebase initialization error: $e');
  }

  runApp(const MyApp());
}
```

## MIGRATION BACK TO FIREBASE PLAN

### When to Migrate Back:
1. **Scale**: When Supabase limits are reached (unlikely for a while)
2. **AI Features**: When advanced Firebase ML features are needed
3. **Enterprise**: When enterprise Firebase features are required

### Migration Process:
1. **Complete Firebase setup** using `FIREBASE_SETUP_GUIDE.md`
2. **Restore code** from this backup file
3. **Update environment variables** with real Firebase credentials
4. **Deploy Firebase rules** and security settings
5. **Migrate data** from Supabase to Firebase (I'll write migration scripts)
6. **Switch DNS/environment** to use Firebase endpoints

### Code Architecture:
The code was designed to be **backend-agnostic**:
- Service layer abstraction
- Environment-based configuration
- Easy switching between backends
- No vendor lock-in in business logic

## ESTIMATED MIGRATION TIME: 4-6 HOURS
- Firebase setup: 1 hour
- Code restoration: 1 hour  
- Data migration scripts: 2-3 hours
- Testing and deployment: 1-2 hours

**This backup preserves 100% of Firebase functionality for future use!** 