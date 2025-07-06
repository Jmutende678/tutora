import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();
  factory FirebaseService() => _instance;
  FirebaseService._internal();

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Mock data for development
  final List<Map<String, dynamic>> _mockUsers = [
    {'name': 'Emma Johnson', 'email': 'emma@example.com', 'isAdmin': false},
    {'name': 'Michael Chen', 'email': 'michael@example.com', 'isAdmin': true},
    {
      'name': 'Sophie Williams',
      'email': 'sophie@example.com',
      'isAdmin': false
    },
  ];

  // Development mode flag
  bool get isDevelopmentMode => true;

  // Mock authentication methods
  Future<UserCredential?> signInWithEmailAndPassword(
      String email, String password) async {
    if (isDevelopmentMode) {
      // Simulate successful login
      return Future.delayed(const Duration(seconds: 1), () => null);
    }
    return _auth.signInWithEmailAndPassword(email: email, password: password);
  }

  Future<void> signOut() async {
    if (isDevelopmentMode) {
      return Future.delayed(const Duration(milliseconds: 500));
    }
    return _auth.signOut();
  }

  // Mock user data methods
  Stream<List<Map<String, dynamic>>> getUsers() {
    if (isDevelopmentMode) {
      return Stream.value(_mockUsers);
    }
    return _firestore.collection('users').snapshots().map((snapshot) {
      return snapshot.docs.map((doc) => doc.data()).toList();
    });
  }

  Future<void> addUser(Map<String, dynamic> userData) async {
    if (isDevelopmentMode) {
      _mockUsers.add(userData);
      return Future.delayed(const Duration(milliseconds: 500));
    }
    await _firestore.collection('users').add(userData);
  }

  // Add more mock methods as needed for your UI development
}
