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
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  // 🔥 REPLACE THESE WITH YOUR ACTUAL FIREBASE CONFIG FROM CONSOLE
  // Go to Firebase Console → Project Settings → Your apps → Web app
  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyC...', // Replace with your actual API key
    appId: '1:123456789:web:abc123', // Replace with your actual app ID
    messagingSenderId: '123456789', // Replace with your actual sender ID
    projectId: 'tutora-production', // Replace with your actual project ID
    authDomain: 'tutora-production.firebaseapp.com', // Replace with your domain
    storageBucket: 'tutora-production.appspot.com', // Replace with your bucket
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyC...', // Replace with your Android API key
    appId: '1:123456789:android:abc123', // Replace with your Android app ID
    messagingSenderId: '123456789', // Replace with your actual sender ID
    projectId: 'tutora-production', // Replace with your actual project ID
    storageBucket: 'tutora-production.appspot.com', // Replace with your bucket
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyC...', // Replace with your iOS API key
    appId: '1:123456789:ios:abc123', // Replace with your iOS app ID
    messagingSenderId: '123456789', // Replace with your actual sender ID
    projectId: 'tutora-production', // Replace with your actual project ID
    storageBucket: 'tutora-production.appspot.com', // Replace with your bucket
    iosClientId:
        'abc123.apps.googleusercontent.com', // Replace with your iOS client ID
    iosBundleId: 'com.tutora.app', // Replace with your actual bundle ID
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'AIzaSyC...', // Replace with your macOS API key
    appId: '1:123456789:macos:abc123', // Replace with your macOS app ID
    messagingSenderId: '123456789', // Replace with your actual sender ID
    projectId: 'tutora-production', // Replace with your actual project ID
    storageBucket: 'tutora-production.appspot.com', // Replace with your bucket
    iosClientId:
        'abc123.apps.googleusercontent.com', // Replace with your macOS client ID
    iosBundleId: 'com.tutora.app', // Replace with your actual bundle ID
  );
}
