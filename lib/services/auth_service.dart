import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'database_service.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final SupabaseClient _supabase = Supabase.instance.client;
  final DatabaseService _databaseService = DatabaseService();

  // Current user data
  User? _currentUser;
  Map<String, dynamic>? _userProfile;
  Map<String, dynamic>? _userCompany;

  // Getters
  User? get currentUser => _currentUser;
  Map<String, dynamic>? get userProfile => _userProfile;
  Map<String, dynamic>? get userCompany => _userCompany;
  bool get isAuthenticated => _currentUser != null;
  bool get isAdmin =>
      _userProfile?['role'] == 'admin' ||
      _userProfile?['role'] == 'super_admin';
  bool get isManager => _userProfile?['role'] == 'manager' || isAdmin;

  // ========================================
  // AUTHENTICATION METHODS
  // ========================================

  /// Initialize authentication service
  Future<void> initialize() async {
    // Listen to auth state changes
    _supabase.auth.onAuthStateChange.listen((data) async {
      final AuthChangeEvent event = data.event;
      final Session? session = data.session;

      print('🔐 Auth state changed: $event');

      if (event == AuthChangeEvent.signedIn && session != null) {
        await _handleSignIn(session.user);
      } else if (event == AuthChangeEvent.signedOut) {
        await _handleSignOut();
      }
    });

    // Check if user is already signed in
    final session = _supabase.auth.currentSession;
    if (session != null) {
      await _handleSignIn(session.user);
    }
  }

  /// Handle user sign in
  Future<void> _handleSignIn(User user) async {
    _currentUser = user;

    // Load user profile from database
    await _loadUserProfile();

    // Load user company
    if (_userProfile != null) {
      await _loadUserCompany();
    }

    print('✅ User signed in: ${user.email}');
  }

  /// Handle user sign out
  Future<void> _handleSignOut() async {
    _currentUser = null;
    _userProfile = null;
    _userCompany = null;

    // Clear stored data
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();

    print('✅ User signed out');
  }

  /// Load user profile from database
  Future<void> _loadUserProfile() async {
    if (_currentUser == null) return;

    try {
      _userProfile = await _databaseService.getUserById(_currentUser!.id);
      print('✅ User profile loaded');
    } catch (e) {
      print('❌ Error loading user profile: $e');
    }
  }

  /// Load user company
  Future<void> _loadUserCompany() async {
    if (_userProfile == null || _userProfile!['company_id'] == null) return;

    try {
      _userCompany =
          await _databaseService.getCompanyById(_userProfile!['company_id']);
      print('✅ User company loaded');
    } catch (e) {
      print('❌ Error loading user company: $e');
    }
  }

  // ========================================
  // SIGN UP & SIGN IN
  // ========================================

  /// Sign up with email and password
  Future<AuthResponse> signUpWithEmail({
    required String email,
    required String password,
    required String name,
    required String companyCode,
  }) async {
    try {
      // First, verify company code exists
      final company = await _databaseService.getCompanyByCode(companyCode);
      if (company == null) {
        throw AuthException(
            'Invalid company code. Please check with your administrator.');
      }

      // Check if user already exists in this company
      final existingUser = await _databaseService.userExists(email);
      if (existingUser) {
        throw AuthException('A user with this email already exists.');
      }

      // Create user in Supabase Auth
      final authResponse = await _supabase.auth.signUp(
        email: email,
        password: password,
        data: {
          'name': name,
          'company_code': companyCode,
        },
      );

      if (authResponse.user != null) {
        // Create user profile in database
        await _databaseService.createUser(
          email: email,
          name: name,
          companyId: company['id'],
          role: 'user',
        );

        print('✅ User signed up successfully');
      }

      return authResponse;
    } catch (e) {
      print('❌ Sign up error: $e');
      rethrow;
    }
  }

  /// Sign in with email and password
  Future<AuthResponse> signInWithEmail({
    required String email,
    required String password,
  }) async {
    try {
      final authResponse = await _supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );

      if (authResponse.user != null) {
        // Update last login
        await _databaseService.updateUser(authResponse.user!.id, {
          'last_active': DateTime.now().toIso8601String(),
        });

        print('✅ User signed in successfully');
      }

      return authResponse;
    } catch (e) {
      print('❌ Sign in error: $e');
      rethrow;
    }
  }

  /// Sign out
  Future<void> signOut() async {
    try {
      await _supabase.auth.signOut();
      print('✅ User signed out successfully');
    } catch (e) {
      print('❌ Sign out error: $e');
      rethrow;
    }
  }

  // ========================================
  // PASSWORD RESET
  // ========================================

  /// Send password reset email
  Future<void> resetPassword(String email) async {
    try {
      await _supabase.auth.resetPasswordForEmail(email);
      print('✅ Password reset email sent');
    } catch (e) {
      print('❌ Password reset error: $e');
      rethrow;
    }
  }

  /// Update password
  Future<void> updatePassword(String newPassword) async {
    try {
      await _supabase.auth.updateUser(
        UserAttributes(password: newPassword),
      );
      print('✅ Password updated successfully');
    } catch (e) {
      print('❌ Password update error: $e');
      rethrow;
    }
  }

  // ========================================
  // COMPANY REGISTRATION
  // ========================================

  /// Register a new company
  Future<Map<String, dynamic>?> registerCompany({
    required String companyName,
    required String adminEmail,
    required String adminName,
    required String adminPassword,
    String? domain,
    String planType = 'starter',
  }) async {
    try {
      // Create company in database
      final company = await _databaseService.createCompany(
        name: companyName,
        domain: domain,
        planType: planType,
      );

      if (company == null) {
        throw Exception('Failed to create company');
      }

      // Create admin user in Supabase Auth
      final authResponse = await _supabase.auth.signUp(
        email: adminEmail,
        password: adminPassword,
        data: {
          'name': adminName,
          'company_code': company['company_code'],
        },
      );

      if (authResponse.user != null) {
        // Create admin user profile
        await _databaseService.createUser(
          email: adminEmail,
          name: adminName,
          companyId: company['id'],
          role: 'admin',
          position: 'Administrator',
        );

        print('✅ Company registered successfully');
        return company;
      }

      return null;
    } catch (e) {
      print('❌ Company registration error: $e');
      rethrow;
    }
  }

  /// Join existing company
  Future<bool> joinCompany({
    required String companyCode,
    required String email,
    required String name,
    required String password,
  }) async {
    try {
      // Verify company exists
      final company = await _databaseService.getCompanyByCode(companyCode);
      if (company == null) {
        throw AuthException('Invalid company code');
      }

      // Check if user already exists
      final existingUser = await _databaseService.userExists(email);
      if (existingUser) {
        throw AuthException('A user with this email already exists');
      }

      // Create user account
      final authResponse = await signUpWithEmail(
        email: email,
        password: password,
        name: name,
        companyCode: companyCode,
      );

      return authResponse.user != null;
    } catch (e) {
      print('❌ Join company error: $e');
      rethrow;
    }
  }

  // ========================================
  // USER MANAGEMENT
  // ========================================

  /// Update user profile
  Future<bool> updateProfile({
    String? name,
    String? position,
    String? department,
    String? avatarUrl,
  }) async {
    if (_currentUser == null) return false;

    try {
      final updates = <String, dynamic>{};
      if (name != null) updates['name'] = name;
      if (position != null) updates['position'] = position;
      if (department != null) updates['department'] = department;
      if (avatarUrl != null) updates['avatar_url'] = avatarUrl;

      final success =
          await _databaseService.updateUser(_currentUser!.id, updates);

      if (success) {
        await _loadUserProfile(); // Reload profile
      }

      return success;
    } catch (e) {
      print('❌ Update profile error: $e');
      return false;
    }
  }

  /// Update user role (admin only)
  Future<bool> updateUserRole(String userId, String newRole) async {
    if (!isAdmin) return false;

    try {
      final success =
          await _databaseService.updateUser(userId, {'role': newRole});
      return success;
    } catch (e) {
      print('❌ Update user role error: $e');
      return false;
    }
  }

  /// Deactivate user (admin only)
  Future<bool> deactivateUser(String userId) async {
    if (!isAdmin) return false;

    try {
      final success =
          await _databaseService.updateUser(userId, {'is_active': false});
      return success;
    } catch (e) {
      print('❌ Deactivate user error: $e');
      return false;
    }
  }

  // ========================================
  // SESSION MANAGEMENT
  // ========================================

  /// Get current session
  Session? get currentSession => _supabase.auth.currentSession;

  /// Check if session is valid
  bool get isSessionValid {
    final session = currentSession;
    if (session == null) return false;

    // Check if session is expired
    final expiresAt = session.expiresAt;
    if (expiresAt == null) return false;

    return DateTime.fromMillisecondsSinceEpoch(expiresAt * 1000)
        .isAfter(DateTime.now());
  }

  /// Refresh session
  Future<void> refreshSession() async {
    try {
      await _supabase.auth.refreshSession();
      print('✅ Session refreshed');
    } catch (e) {
      print('❌ Session refresh error: $e');
      rethrow;
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /// Get user's company code
  String? get userCompanyCode => _userCompany?['company_code'];

  /// Get user's company name
  String? get userCompanyName => _userCompany?['name'];

  /// Get user's company plan
  String? get userCompanyPlan => _userCompany?['plan_type'];

  /// Check if user can access feature based on plan
  bool canAccessFeature(String feature) {
    final plan = userCompanyPlan ?? 'starter';

    switch (feature) {
      case 'ai_modules':
        return plan == 'growth' || plan == 'enterprise';
      case 'advanced_analytics':
        return plan == 'growth' || plan == 'enterprise';
      case 'white_label':
        return plan == 'enterprise';
      case 'api_access':
        return plan == 'enterprise';
      default:
        return true;
    }
  }

  /// Get user's remaining AI modules
  int get remainingAiModules {
    final plan = userCompanyPlan ?? 'starter';
    final used = _userCompany?['ai_modules_used'] ?? 0;

    switch (plan) {
      case 'starter':
        return 10 - (used as int);
      case 'growth':
        return 50 - (used as int);
      case 'enterprise':
        return 999999 - (used as int); // Unlimited
      default:
        return 0;
    }
  }

  /// Get user's remaining storage (in GB)
  double get remainingStorage {
    final plan = userCompanyPlan ?? 'starter';
    final used = _userCompany?['storage_used_gb'] ?? 0.0;

    switch (plan) {
      case 'starter':
        return 5.0 - used;
      case 'growth':
        return 10.0 - used;
      case 'enterprise':
        return 100.0 - used;
      default:
        return 0.0;
    }
  }

  /// Check if user has exceeded plan limits
  bool get hasExceededLimits {
    return remainingAiModules <= 0 || remainingStorage <= 0;
  }

  // ========================================
  // ERROR HANDLING
  // ========================================

  /// Get user-friendly error message
  String getErrorMessage(dynamic error) {
    if (error is AuthException) {
      switch (error.message) {
        case 'Invalid login credentials':
          return 'Invalid email or password. Please try again.';
        case 'Email not confirmed':
          return 'Please check your email and confirm your account.';
        case 'User already registered':
          return 'An account with this email already exists.';
        case 'Password should be at least 6 characters':
          return 'Password must be at least 6 characters long.';
        default:
          return error.message;
      }
    }

    return 'An unexpected error occurred. Please try again.';
  }
}
