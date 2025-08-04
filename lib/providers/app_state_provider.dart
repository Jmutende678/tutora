import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../services/auth_service.dart';
import '../services/database_service.dart';
import '../models/user_model.dart';
import '../models/module_model.dart';

class AppStateProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  final DatabaseService _databaseService = DatabaseService();

  // Authentication state
  bool _isLoading = true;
  bool _isAuthenticated = false;
  User? _currentUser;
  Map<String, dynamic>? _userProfile;
  Map<String, dynamic>? _userCompany;

  // User data
  List<Map<String, dynamic>> _userModules = [];
  List<Map<String, dynamic>> _userAssignments = [];
  List<Map<String, dynamic>> _userNotifications = [];
  List<Map<String, dynamic>> _leaderboard = [];

  // Company data
  List<Map<String, dynamic>> _companyUsers = [];
  List<Map<String, dynamic>> _companyModules = [];

  // UI state
  bool _isOnline = true;
  String? _errorMessage;
  bool _showNotifications = true;

  // Getters
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  User? get currentUser => _currentUser;
  Map<String, dynamic>? get userProfile => _userProfile;
  Map<String, dynamic>? get userCompany => _userCompany;
  List<Map<String, dynamic>> get userModules => _userModules;
  List<Map<String, dynamic>> get userAssignments => _userAssignments;
  List<Map<String, dynamic>> get userNotifications => _userNotifications;
  List<Map<String, dynamic>> get leaderboard => _leaderboard;
  List<Map<String, dynamic>> get companyUsers => _companyUsers;
  List<Map<String, dynamic>> get companyModules => _companyModules;
  bool get isOnline => _isOnline;
  String? get errorMessage => _errorMessage;
  bool get showNotifications => _showNotifications;

  // User role getters
  bool get isAdmin =>
      _userProfile?['role'] == 'admin' ||
      _userProfile?['role'] == 'super_admin';
  bool get isManager => _userProfile?['role'] == 'manager' || isAdmin;
  bool get isRegularUser => _userProfile?['role'] == 'user';

  // Company info getters
  String? get userCompanyCode => _userCompany?['company_code'];
  String? get userCompanyName => _userCompany?['name'];
  String? get userCompanyPlan => _userCompany?['plan_type'];

  // ========================================
  // INITIALIZATION
  // ========================================

  /// Initialize the app state
  Future<void> initialize() async {
    try {
      _setLoading(true);
      _clearError();

      // Initialize auth service
      await _authService.initialize();

      // Check authentication status
      if (_authService.isAuthenticated) {
        await _loadAuthenticatedUser();
      } else {
        _setAuthenticated(false);
      }

      // Set up real-time subscriptions
      _setupRealtimeSubscriptions();
    } catch (e) {
      _setError('Failed to initialize app: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Load authenticated user data
  Future<void> _loadAuthenticatedUser() async {
    try {
      _currentUser = _authService.currentUser;
      _userProfile = _authService.userProfile;
      _userCompany = _authService.userCompany;
      _setAuthenticated(true);

      if (_userProfile != null) {
        await _loadUserData();
      }
    } catch (e) {
      _setError('Failed to load user data: $e');
    }
  }

  /// Load user-specific data
  Future<void> _loadUserData() async {
    if (_currentUser == null) return;

    try {
      // Load user assignments
      _userAssignments =
          await _databaseService.getUserAssignments(_currentUser!.id);

      // Load user notifications
      _userNotifications =
          await _databaseService.getUserNotifications(_currentUser!.id);

      // Load company data if admin/manager
      if (isManager) {
        await _loadCompanyData();
      }

      notifyListeners();
    } catch (e) {
      _setError('Failed to load user data: $e');
    }
  }

  /// Load company data (for managers/admins)
  Future<void> _loadCompanyData() async {
    if (_userProfile == null || _userProfile!['company_id'] == null) return;

    try {
      final companyId = _userProfile!['company_id'];

      // Load company users
      _companyUsers = await _databaseService.getUsersByCompany(companyId);

      // Load company modules
      _companyModules = await _databaseService.getModulesByCompany(companyId);

      // Load leaderboard
      _leaderboard = await _databaseService.getCompanyLeaderboard(companyId);

      notifyListeners();
    } catch (e) {
      _setError('Failed to load company data: $e');
    }
  }

  // ========================================
  // AUTHENTICATION METHODS
  // ========================================

  /// Sign in user
  Future<bool> signIn(String email, String password) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.signInWithEmail(
        email: email,
        password: password,
      );

      if (response.user != null) {
        await _loadAuthenticatedUser();
        return true;
      }

      return false;
    } catch (e) {
      _setError(_authService.getErrorMessage(e));
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Sign up user
  Future<bool> signUp({
    required String email,
    required String password,
    required String name,
    required String companyCode,
  }) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.signUpWithEmail(
        email: email,
        password: password,
        name: name,
        companyCode: companyCode,
      );

      if (response.user != null) {
        await _loadAuthenticatedUser();
        return true;
      }

      return false;
    } catch (e) {
      _setError(_authService.getErrorMessage(e));
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Sign out user
  Future<void> signOut() async {
    try {
      _setLoading(true);
      await _authService.signOut();
      _clearUserData();
      _setAuthenticated(false);
    } catch (e) {
      _setError('Failed to sign out: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Reset password
  Future<bool> resetPassword(String email) async {
    try {
      _setLoading(true);
      _clearError();

      await _authService.resetPassword(email);
      return true;
    } catch (e) {
      _setError(_authService.getErrorMessage(e));
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // ========================================
  // COMPANY REGISTRATION
  // ========================================

  /// Register new company
  Future<bool> registerCompany({
    required String companyName,
    required String adminEmail,
    required String adminName,
    required String adminPassword,
    String? domain,
    String planType = 'starter',
  }) async {
    try {
      _setLoading(true);
      _clearError();

      final company = await _authService.registerCompany(
        companyName: companyName,
        adminEmail: adminEmail,
        adminName: adminName,
        adminPassword: adminPassword,
        domain: domain,
        planType: planType,
      );

      if (company != null) {
        await _loadAuthenticatedUser();
        return true;
      }

      return false;
    } catch (e) {
      _setError('Failed to register company: $e');
      return false;
    } finally {
      _setLoading(false);
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
      _setLoading(true);
      _clearError();

      final success = await _authService.joinCompany(
        companyCode: companyCode,
        email: email,
        name: name,
        password: password,
      );

      if (success) {
        await _loadAuthenticatedUser();
      }

      return success;
    } catch (e) {
      _setError(_authService.getErrorMessage(e));
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // ========================================
  // MODULE OPERATIONS
  // ========================================

  /// Create new module
  Future<bool> createModule({
    required String title,
    required String description,
    String? category,
    String difficulty = 'beginner',
    int estimatedMinutes = 30,
    int pointsValue = 100,
    String contentType = 'video',
    String? contentUrl,
    String? thumbnailUrl,
    bool isAiGenerated = false,
    String? aiPrompt,
  }) async {
    if (_userProfile == null || _userProfile!['company_id'] == null)
      return false;

    try {
      _setLoading(true);
      _clearError();

      final module = await _databaseService.createModule(
        title: title,
        description: description,
        companyId: _userProfile!['company_id'],
        createdBy: _currentUser!.id,
        category: category,
        difficulty: difficulty,
        estimatedMinutes: estimatedMinutes,
        pointsValue: pointsValue,
        contentType: contentType,
        contentUrl: contentUrl,
        thumbnailUrl: thumbnailUrl,
        isAiGenerated: isAiGenerated,
        aiPrompt: aiPrompt,
      );

      if (module != null) {
        await _loadCompanyData(); // Refresh company modules
        return true;
      }

      return false;
    } catch (e) {
      _setError('Failed to create module: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Assign module to user
  Future<bool> assignModuleToUser({
    required String moduleId,
    required String userId,
    DateTime? dueDate,
  }) async {
    try {
      _setLoading(true);
      _clearError();

      final success = await _databaseService.assignModuleToUser(
        moduleId: moduleId,
        userId: userId,
        assignedBy: _currentUser!.id,
        dueDate: dueDate,
      );

      if (success) {
        await _loadUserData(); // Refresh assignments
      }

      return success;
    } catch (e) {
      _setError('Failed to assign module: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Update module progress
  Future<bool> updateModuleProgress({
    required String moduleId,
    double? progressPercentage,
    String? status,
    DateTime? startedAt,
    DateTime? completedAt,
    int? score,
    int? timeSpentMinutes,
  }) async {
    try {
      final success = await _databaseService.updateAssignmentProgress(
        moduleId: moduleId,
        userId: _currentUser!.id,
        progressPercentage: progressPercentage,
        status: status,
        startedAt: startedAt,
        completedAt: completedAt,
        score: score,
        timeSpentMinutes: timeSpentMinutes,
      );

      if (success) {
        await _loadUserData(); // Refresh data
      }

      return success;
    } catch (e) {
      _setError('Failed to update progress: $e');
      return false;
    }
  }

  // ========================================
  // NOTIFICATION OPERATIONS
  // ========================================

  /// Mark notification as read
  Future<bool> markNotificationAsRead(String notificationId) async {
    try {
      final success =
          await _databaseService.markNotificationAsRead(notificationId);

      if (success) {
        // Update local notification
        final index =
            _userNotifications.indexWhere((n) => n['id'] == notificationId);
        if (index != -1) {
          _userNotifications[index]['is_read'] = true;
          notifyListeners();
        }
      }

      return success;
    } catch (e) {
      _setError('Failed to mark notification as read: $e');
      return false;
    }
  }

  /// Toggle notifications
  void toggleNotifications() {
    _showNotifications = !_showNotifications;
    notifyListeners();
  }

  // ========================================
  // REAL-TIME SUBSCRIPTIONS
  // ========================================

  /// Set up real-time subscriptions
  void _setupRealtimeSubscriptions() {
    if (_currentUser == null) return;

    // Subscribe to user notifications
    _databaseService
        .subscribeToNotifications(_currentUser!.id)
        .listen((notifications) {
      _userNotifications = notifications;
      notifyListeners();
    });

    // Subscribe to user assignments
    _databaseService
        .subscribeToAssignments(_currentUser!.id)
        .listen((assignments) {
      _userAssignments = assignments;
      notifyListeners();
    });

    // Subscribe to user updates
    _databaseService.subscribeToUserUpdates(_currentUser!.id).listen((users) {
      if (users.isNotEmpty) {
        _userProfile = users.first;
        notifyListeners();
      }
    });
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /// Refresh all data
  Future<void> refreshData() async {
    if (_isAuthenticated) {
      await _loadUserData();
    }
  }

  /// Clear user data
  void _clearUserData() {
    _currentUser = null;
    _userProfile = null;
    _userCompany = null;
    _userModules = [];
    _userAssignments = [];
    _userNotifications = [];
    _leaderboard = [];
    _companyUsers = [];
    _companyModules = [];
  }

  /// Set loading state
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// Set authenticated state
  void _setAuthenticated(bool authenticated) {
    _isAuthenticated = authenticated;
    notifyListeners();
  }

  /// Set error message
  void _setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }

  /// Clear error message
  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  /// Set online status
  void setOnlineStatus(bool online) {
    _isOnline = online;
    notifyListeners();
  }

  // ========================================
  // FEATURE ACCESS METHODS
  // ========================================

  /// Check if user can access feature
  bool canAccessFeature(String feature) {
    return _authService.canAccessFeature(feature);
  }

  /// Get remaining AI modules
  int get remainingAiModules => _authService.remainingAiModules;

  /// Get remaining storage
  double get remainingStorage => _authService.remainingStorage;

  /// Check if user has exceeded limits
  bool get hasExceededLimits => _authService.hasExceededLimits;

  // ========================================
  // ANALYTICS
  // ========================================

  /// Track event
  Future<void> trackEvent({
    required String eventType,
    Map<String, dynamic>? eventData,
  }) async {
    if (_userProfile == null || _userProfile!['company_id'] == null) return;

    try {
      await _databaseService.trackEvent(
        companyId: _userProfile!['company_id'],
        userId: _currentUser?.id,
        eventType: eventType,
        eventData: eventData,
      );
    } catch (e) {
      print('❌ Failed to track event: $e');
    }
  }
}
