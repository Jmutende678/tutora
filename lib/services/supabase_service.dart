import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static final SupabaseService _instance = SupabaseService._internal();
  factory SupabaseService() => _instance;
  SupabaseService._internal();

  final SupabaseClient _supabase = Supabase.instance.client;

  // Authentication methods
  Future<AuthResponse?> signInWithEmailAndPassword(
      String email, String password) async {
    try {
      final response = await _supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );

      if (response.user != null) {
        // Update last login
        await _updateLastLogin(response.user!.id);
        print('✅ Supabase Sign In Successful');
        return response;
      }
      return null;
    } catch (e) {
      print('❌ Supabase Auth Error: $e');
      rethrow;
    }
  }

  Future<void> signOut() async {
    try {
      await _supabase.auth.signOut();
      print('✅ Supabase Sign Out Successful');
    } catch (e) {
      print('❌ Supabase Sign Out Error: $e');
      rethrow;
    }
  }

  Future<AuthResponse?> signUpWithEmailAndPassword(
      String email, String password, String name) async {
    try {
      final response = await _supabase.auth
          .signUp(email: email, password: password, data: {'name': name});

      print('✅ Supabase Sign Up Successful');
      return response;
    } catch (e) {
      print('❌ Supabase Sign Up Error: $e');
      rethrow;
    }
  }

  // User data methods
  Stream<List<Map<String, dynamic>>> getUsers() {
    try {
      return _supabase
          .from('users')
          .stream(primaryKey: ['id'])
          .order('created_at', ascending: false)
          .map((data) => data);
    } catch (e) {
      print('❌ Supabase Get Users Error: $e');
      return Stream.value([]);
    }
  }

  Future<List<Map<String, dynamic>>> getUsersByCompany(String companyId) async {
    try {
      final response = await _supabase
          .from('users')
          .select()
          .eq('company_id', companyId)
          .order('created_at', ascending: false);

      return response;
    } catch (e) {
      print('❌ Supabase Get Users By Company Error: $e');
      return [];
    }
  }

  Future<Map<String, dynamic>?> getUserById(String userId) async {
    try {
      final response =
          await _supabase.from('users').select().eq('id', userId).maybeSingle();

      return response;
    } catch (e) {
      print('❌ Supabase Get User By ID Error: $e');
      return null;
    }
  }

  Future<void> addUser(Map<String, dynamic> userData) async {
    try {
      await _supabase.from('users').insert(userData);
      print('✅ User added to Supabase');
    } catch (e) {
      print('❌ Supabase Add User Error: $e');
      rethrow;
    }
  }

  // Company lookup for company codes
  Future<Map<String, dynamic>?> getCompanyByCode(String companyCode) async {
    try {
      final response = await _supabase
          .from('companies')
          .select()
          .eq('company_code', companyCode)
          .eq('is_active', true)
          .maybeSingle();

      if (response != null) {
        print('✅ Company found: ${response['name']}');
        return {
          'id': response['id'],
          'name': response['name'],
          'companyCode': response['company_code'],
          'plan': response['plan'],
          'maxUsers': response['max_users'],
          'currentUsers': response['current_users'],
          'isActive': response['is_active'],
        };
      }

      print('⚠️ Company not found for code: $companyCode');
      return null;
    } catch (e) {
      print('❌ Supabase Get Company Error: $e');
      return null;
    }
  }

  // Modules management
  Future<List<Map<String, dynamic>>> getModulesByCompany(
      String companyId) async {
    try {
      final response = await _supabase
          .from('modules')
          .select()
          .eq('company_id', companyId)
          .eq('is_active', true)
          .order('created_at', ascending: false);

      return response;
    } catch (e) {
      print('❌ Supabase Get Modules Error: $e');
      return [];
    }
  }

  Future<void> createModule(Map<String, dynamic> moduleData) async {
    try {
      await _supabase.from('modules').insert(moduleData);
      print('✅ Module created in Supabase');
    } catch (e) {
      print('❌ Supabase Create Module Error: $e');
      rethrow;
    }
  }

  // Support tickets
  Future<void> createSupportTicket(Map<String, dynamic> ticketData) async {
    try {
      await _supabase.from('support_tickets').insert({
        ...ticketData,
        'status': 'open',
        'priority': ticketData['priority'] ?? 'medium',
        'created_at': DateTime.now().toIso8601String(),
        'updated_at': DateTime.now().toIso8601String(),
      });
      print('✅ Support ticket created in Supabase');
    } catch (e) {
      print('❌ Supabase Create Support Ticket Error: $e');
      rethrow;
    }
  }

  Future<List<Map<String, dynamic>>> getSupportTickets(String companyId) async {
    try {
      final response = await _supabase
          .from('support_tickets')
          .select()
          .eq('company_id', companyId)
          .order('created_at', ascending: false);

      return response;
    } catch (e) {
      print('❌ Supabase Get Support Tickets Error: $e');
      return [];
    }
  }

  // Analytics
  Future<Map<String, dynamic>> getAnalytics(String companyId) async {
    try {
      // Get user counts
      final totalUsers = await _supabase
          .from('users')
          .select('id')
          .eq('company_id', companyId);

      final activeUsers = await _supabase
          .from('users')
          .select('id')
          .eq('company_id', companyId)
          .eq('is_active', true);

      final totalUsersCount = totalUsers.length;
      final activeUsersCount = activeUsers.length;

      // Get analytics data
      final analyticsData = await _supabase
          .from('analytics')
          .select()
          .eq('company_id', companyId);

      // Calculate averages
      final engagementMetrics =
          analyticsData.where((a) => a['metric_type'] == 'engagement').toList();

      final completionMetrics =
          analyticsData.where((a) => a['metric_type'] == 'completion').toList();

      final avgEngagement = engagementMetrics.isNotEmpty
          ? engagementMetrics.fold<double>(
                  0, (sum, m) => sum + m['metric_value']) /
              engagementMetrics.length
          : 75.0;

      final avgCompletion = completionMetrics.isNotEmpty
          ? completionMetrics.fold<double>(
                  0, (sum, m) => sum + m['metric_value']) /
              completionMetrics.length
          : 68.0;

      return {
        'totalUsers': totalUsersCount,
        'activeUsers': activeUsersCount,
        'engagementScore': avgEngagement.round(),
        'completionRate': avgCompletion.round(),
        'companyId': companyId,
      };
    } catch (e) {
      print('❌ Supabase Get Analytics Error: $e');
      return {
        'totalUsers': 0,
        'activeUsers': 0,
        'engagementScore': 0,
        'completionRate': 0,
        'companyId': companyId,
      };
    }
  }

  // Helper methods
  Future<void> _updateLastLogin(String userId) async {
    try {
      await _supabase.from('users').update({
        'last_login': DateTime.now().toIso8601String(),
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('id', userId);
    } catch (e) {
      print('⚠️ Could not update last login: $e');
      // Don't throw, this is non-critical
    }
  }

  // Get current user
  User? get currentUser => _supabase.auth.currentUser;

  // Check if user is authenticated
  bool get isAuthenticated => _supabase.auth.currentUser != null;

  // Get current session
  Session? get currentSession => _supabase.auth.currentSession;

  // Listen to auth state changes
  Stream<AuthState> get authStateChanges => _supabase.auth.onAuthStateChange;
}
