import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();
  factory FirebaseService() => _instance;
  FirebaseService._internal();

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Mock data for development (fallback only)
  final List<Map<String, dynamic>> _mockUsers = [
    {'name': 'Emma Johnson', 'email': 'emma@example.com', 'isAdmin': false},
    {'name': 'Michael Chen', 'email': 'michael@example.com', 'isAdmin': true},
    {
      'name': 'Sophie Williams',
      'email': 'sophie@example.com',
      'isAdmin': false
    },
  ];

  // 🔥 PRODUCTION MODE ENABLED - Set to false for production
  bool get isDevelopmentMode => false;

  // Authentication methods (now using real Firebase)
  Future<UserCredential?> signInWithEmailAndPassword(
      String email, String password) async {
    if (isDevelopmentMode) {
      // Simulate successful login
      return Future.delayed(const Duration(seconds: 1), () => null);
    }
    try {
      return await _auth.signInWithEmailAndPassword(
          email: email, password: password);
    } catch (e) {
      print('❌ Firebase Auth Error: $e');
      rethrow;
    }
  }

  Future<void> signOut() async {
    if (isDevelopmentMode) {
      return Future.delayed(const Duration(milliseconds: 500));
    }
    try {
      return await _auth.signOut();
    } catch (e) {
      print('❌ Firebase Sign Out Error: $e');
      rethrow;
    }
  }

  // User data methods (now using real Firestore)
  Stream<List<Map<String, dynamic>>> getUsers() {
    if (isDevelopmentMode) {
      return Stream.value(_mockUsers);
    }
    try {
      return _firestore.collection('users').snapshots().map((snapshot) {
        return snapshot.docs.map((doc) => doc.data()).toList();
      });
    } catch (e) {
      print('❌ Firestore Get Users Error: $e');
      // Fallback to mock data if Firestore fails
      return Stream.value(_mockUsers);
    }
  }

  Future<void> addUser(Map<String, dynamic> userData) async {
    if (isDevelopmentMode) {
      _mockUsers.add(userData);
      return Future.delayed(const Duration(milliseconds: 500));
    }
    try {
      await _firestore.collection('users').add(userData);
    } catch (e) {
      print('❌ Firestore Add User Error: $e');
      rethrow;
    }
  }

  // Company lookup for company codes (production feature)
  Future<Map<String, dynamic>?> getCompanyByCode(String companyCode) async {
    if (isDevelopmentMode) {
      // Mock company data
      return {
        'id': 'demo_company',
        'name': 'Demo Company',
        'companyCode': companyCode,
        'plan': 'professional',
        'maxUsers': 100,
      };
    }
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

  // Get current user
  User? get currentUser => _auth.currentUser;

  // Check if user is authenticated
  bool get isAuthenticated => _auth.currentUser != null;
}
