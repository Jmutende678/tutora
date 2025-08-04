import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user_model.dart';
import '../models/module_model.dart';
import '../models/quiz_model.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  final SupabaseClient _supabase = Supabase.instance.client;

  // ========================================
  // COMPANY OPERATIONS
  // ========================================

  /// Create a new company
  Future<Map<String, dynamic>?> createCompany({
    required String name,
    String? domain,
    String planType = 'starter',
  }) async {
    try {
      final response = await _supabase
          .from('companies')
          .insert({
            'name': name,
            'domain': domain,
            'plan_type': planType,
          })
          .select()
          .single();

      print('✅ Company created: ${response['name']}');
      return response;
    } catch (e) {
      print('❌ Error creating company: $e');
      rethrow;
    }
  }

  /// Get company by company code
  Future<Map<String, dynamic>?> getCompanyByCode(String companyCode) async {
    try {
      final response = await _supabase
          .from('companies')
          .select()
          .eq('company_code', companyCode)
          .maybeSingle();

      return response;
    } catch (e) {
      print('❌ Error getting company by code: $e');
      return null;
    }
  }

  /// Get company by ID
  Future<Map<String, dynamic>?> getCompanyById(String companyId) async {
    try {
      final response = await _supabase
          .from('companies')
          .select()
          .eq('id', companyId)
          .maybeSingle();

      return response;
    } catch (e) {
      print('❌ Error getting company by ID: $e');
      return null;
    }
  }

  /// Update company settings
  Future<bool> updateCompany(
      String companyId, Map<String, dynamic> updates) async {
    try {
      await _supabase.from('companies').update(updates).eq('id', companyId);

      print('✅ Company updated successfully');
      return true;
    } catch (e) {
      print('❌ Error updating company: $e');
      return false;
    }
  }

  // ========================================
  // USER OPERATIONS
  // ========================================

  /// Create a new user
  Future<Map<String, dynamic>?> createUser({
    required String email,
    required String name,
    required String companyId,
    String role = 'user',
    String? position,
    String? department,
  }) async {
    try {
      final response = await _supabase
          .from('users')
          .insert({
            'email': email,
            'name': name,
            'company_id': companyId,
            'role': role,
            'position': position,
            'department': department,
          })
          .select()
          .single();

      print('✅ User created: ${response['name']}');
      return response;
    } catch (e) {
      print('❌ Error creating user: $e');
      rethrow;
    }
  }

  /// Get user by ID
  Future<Map<String, dynamic>?> getUserById(String userId) async {
    try {
      final response =
          await _supabase.from('users').select().eq('id', userId).maybeSingle();

      return response;
    } catch (e) {
      print('❌ Error getting user by ID: $e');
      return null;
    }
  }

  /// Get users by company
  Future<List<Map<String, dynamic>>> getUsersByCompany(String companyId) async {
    try {
      final response = await _supabase
          .from('users')
          .select()
          .eq('company_id', companyId)
          .order('created_at', ascending: false);

      return response;
    } catch (e) {
      print('❌ Error getting users by company: $e');
      return [];
    }
  }

  /// Update user
  Future<bool> updateUser(String userId, Map<String, dynamic> updates) async {
    try {
      await _supabase.from('users').update(updates).eq('id', userId);

      print('✅ User updated successfully');
      return true;
    } catch (e) {
      print('❌ Error updating user: $e');
      return false;
    }
  }

  /// Update user points and streak
  Future<bool> updateUserProgress(
    String userId, {
    int? points,
    int? streakDays,
    DateTime? lastActive,
  }) async {
    try {
      final updates = <String, dynamic>{};
      if (points != null) updates['points'] = points;
      if (streakDays != null) updates['streak_days'] = streakDays;
      if (lastActive != null)
        updates['last_active'] = lastActive.toIso8601String();

      await _supabase.from('users').update(updates).eq('id', userId);

      return true;
    } catch (e) {
      print('❌ Error updating user progress: $e');
      return false;
    }
  }

  // ========================================
  // MODULE OPERATIONS
  // ========================================

  /// Create a new module
  Future<Map<String, dynamic>?> createModule({
    required String title,
    required String description,
    required String companyId,
    required String createdBy,
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
    try {
      final response = await _supabase
          .from('modules')
          .insert({
            'title': title,
            'description': description,
            'company_id': companyId,
            'created_by': createdBy,
            'category': category,
            'difficulty': difficulty,
            'estimated_minutes': estimatedMinutes,
            'points_value': pointsValue,
            'content_type': contentType,
            'content_url': contentUrl,
            'thumbnail_url': thumbnailUrl,
            'is_ai_generated': isAiGenerated,
            'ai_prompt': aiPrompt,
            'status': 'published',
          })
          .select()
          .single();

      print('✅ Module created: ${response['title']}');
      return response;
    } catch (e) {
      print('❌ Error creating module: $e');
      rethrow;
    }
  }

  /// Get modules by company
  Future<List<Map<String, dynamic>>> getModulesByCompany(
      String companyId) async {
    try {
      final response = await _supabase
          .from('modules')
          .select()
          .eq('company_id', companyId)
          .eq('status', 'published')
          .order('created_at', ascending: false);

      return response;
    } catch (e) {
      print('❌ Error getting modules by company: $e');
      return [];
    }
  }

  /// Get module by ID
  Future<Map<String, dynamic>?> getModuleById(String moduleId) async {
    try {
      final response = await _supabase
          .from('modules')
          .select()
          .eq('id', moduleId)
          .maybeSingle();

      return response;
    } catch (e) {
      print('❌ Error getting module by ID: $e');
      return null;
    }
  }

  /// Update module
  Future<bool> updateModule(
      String moduleId, Map<String, dynamic> updates) async {
    try {
      await _supabase.from('modules').update(updates).eq('id', moduleId);

      print('✅ Module updated successfully');
      return true;
    } catch (e) {
      print('❌ Error updating module: $e');
      return false;
    }
  }

  // ========================================
  // MODULE ASSIGNMENT OPERATIONS
  // ========================================

  /// Assign module to user
  Future<bool> assignModuleToUser({
    required String moduleId,
    required String userId,
    required String assignedBy,
    DateTime? dueDate,
  }) async {
    try {
      await _supabase.from('module_assignments').insert({
        'module_id': moduleId,
        'user_id': userId,
        'assigned_by': assignedBy,
        'due_date': dueDate?.toIso8601String(),
        'status': 'assigned',
      });

      print('✅ Module assigned successfully');
      return true;
    } catch (e) {
      print('❌ Error assigning module: $e');
      return false;
    }
  }

  /// Get user's assigned modules
  Future<List<Map<String, dynamic>>> getUserAssignments(String userId) async {
    try {
      final response = await _supabase.from('module_assignments').select('''
            *,
            modules (*)
          ''').eq('user_id', userId).order('assigned_at', ascending: false);

      return response;
    } catch (e) {
      print('❌ Error getting user assignments: $e');
      return [];
    }
  }

  /// Update module assignment progress
  Future<bool> updateAssignmentProgress({
    required String moduleId,
    required String userId,
    double? progressPercentage,
    String? status,
    DateTime? startedAt,
    DateTime? completedAt,
    int? score,
    int? timeSpentMinutes,
  }) async {
    try {
      final updates = <String, dynamic>{};
      if (progressPercentage != null)
        updates['progress_percentage'] = progressPercentage;
      if (status != null) updates['status'] = status;
      if (startedAt != null)
        updates['started_at'] = startedAt.toIso8601String();
      if (completedAt != null)
        updates['completed_at'] = completedAt.toIso8601String();
      if (score != null) updates['score'] = score;
      if (timeSpentMinutes != null)
        updates['time_spent_minutes'] = timeSpentMinutes;

      await _supabase
          .from('module_assignments')
          .update(updates)
          .eq('module_id', moduleId)
          .eq('user_id', userId);

      return true;
    } catch (e) {
      print('❌ Error updating assignment progress: $e');
      return false;
    }
  }

  // ========================================
  // QUIZ OPERATIONS
  // ========================================

  /// Create a quiz
  Future<Map<String, dynamic>?> createQuiz({
    required String moduleId,
    required String title,
    String? description,
    int passingScore = 70,
    int? timeLimitMinutes,
    bool isRequired = true,
  }) async {
    try {
      final response = await _supabase
          .from('quizzes')
          .insert({
            'module_id': moduleId,
            'title': title,
            'description': description,
            'passing_score': passingScore,
            'time_limit_minutes': timeLimitMinutes,
            'is_required': isRequired,
          })
          .select()
          .single();

      print('✅ Quiz created: ${response['title']}');
      return response;
    } catch (e) {
      print('❌ Error creating quiz: $e');
      rethrow;
    }
  }

  /// Add question to quiz
  Future<bool> addQuestionToQuiz({
    required String quizId,
    required String questionText,
    required String questionType,
    Map<String, dynamic>? options,
    String? correctAnswer,
    int points = 1,
    int orderIndex = 0,
  }) async {
    try {
      await _supabase.from('questions').insert({
        'quiz_id': quizId,
        'question_text': questionText,
        'question_type': questionType,
        'options': options,
        'correct_answer': correctAnswer,
        'points': points,
        'order_index': orderIndex,
      });

      print('✅ Question added to quiz');
      return true;
    } catch (e) {
      print('❌ Error adding question: $e');
      return false;
    }
  }

  /// Get quiz with questions
  Future<Map<String, dynamic>?> getQuizWithQuestions(String quizId) async {
    try {
      final response = await _supabase.from('quizzes').select('''
            *,
            questions (*)
          ''').eq('id', quizId).maybeSingle();

      return response;
    } catch (e) {
      print('❌ Error getting quiz with questions: $e');
      return null;
    }
  }

  /// Submit quiz attempt
  Future<Map<String, dynamic>?> submitQuizAttempt({
    required String quizId,
    required String userId,
    required int score,
    required int maxScore,
    required bool passed,
    int? timeTakenMinutes,
    List<Map<String, dynamic>>? answers,
  }) async {
    try {
      final response = await _supabase
          .from('quiz_attempts')
          .insert({
            'quiz_id': quizId,
            'user_id': userId,
            'score': score,
            'max_score': maxScore,
            'passed': passed,
            'time_taken_minutes': timeTakenMinutes,
            'answers': answers,
            'completed_at': DateTime.now().toIso8601String(),
          })
          .select()
          .single();

      print('✅ Quiz attempt submitted');
      return response;
    } catch (e) {
      print('❌ Error submitting quiz attempt: $e');
      rethrow;
    }
  }

  // ========================================
  // LEADERBOARD OPERATIONS
  // ========================================

  /// Get company leaderboard
  Future<List<Map<String, dynamic>>> getCompanyLeaderboard(
      String companyId) async {
    try {
      final response = await _supabase
          .from('users')
          .select('id, name, points, streak_days, avatar_url, position')
          .eq('company_id', companyId)
          .eq('is_active', true)
          .order('points', ascending: false)
          .limit(50);

      return response;
    } catch (e) {
      print('❌ Error getting leaderboard: $e');
      return [];
    }
  }

  // ========================================
  // NOTIFICATION OPERATIONS
  // ========================================

  /// Create notification
  Future<bool> createNotification({
    required String userId,
    required String companyId,
    required String title,
    required String message,
    String type = 'general',
    String priority = 'medium',
    String? actionUrl,
  }) async {
    try {
      await _supabase.from('notifications').insert({
        'user_id': userId,
        'company_id': companyId,
        'title': title,
        'message': message,
        'type': type,
        'priority': priority,
        'action_url': actionUrl,
      });

      print('✅ Notification created');
      return true;
    } catch (e) {
      print('❌ Error creating notification: $e');
      return false;
    }
  }

  /// Get user notifications
  Future<List<Map<String, dynamic>>> getUserNotifications(String userId) async {
    try {
      final response = await _supabase
          .from('notifications')
          .select()
          .eq('user_id', userId)
          .order('created_at', ascending: false)
          .limit(50);

      return response;
    } catch (e) {
      print('❌ Error getting notifications: $e');
      return [];
    }
  }

  /// Mark notification as read
  Future<bool> markNotificationAsRead(String notificationId) async {
    try {
      await _supabase
          .from('notifications')
          .update({'is_read': true}).eq('id', notificationId);

      return true;
    } catch (e) {
      print('❌ Error marking notification as read: $e');
      return false;
    }
  }

  // ========================================
  // ANALYTICS OPERATIONS
  // ========================================

  /// Track analytics event
  Future<bool> trackEvent({
    required String companyId,
    String? userId,
    required String eventType,
    Map<String, dynamic>? eventData,
    String? sessionId,
    String? userAgent,
  }) async {
    try {
      await _supabase.from('analytics').insert({
        'company_id': companyId,
        'user_id': userId,
        'event_type': eventType,
        'event_data': eventData,
        'session_id': sessionId,
        'user_agent': userAgent,
      });

      return true;
    } catch (e) {
      print('❌ Error tracking event: $e');
      return false;
    }
  }

  // ========================================
  // REAL-TIME SUBSCRIPTIONS
  // ========================================

  /// Subscribe to user updates
  Stream<List<Map<String, dynamic>>> subscribeToUserUpdates(String userId) {
    return _supabase
        .from('users')
        .stream(primaryKey: ['id'])
        .eq('id', userId)
        .map((data) => data);
  }

  /// Subscribe to user notifications
  Stream<List<Map<String, dynamic>>> subscribeToNotifications(String userId) {
    return _supabase
        .from('notifications')
        .stream(primaryKey: ['id'])
        .eq('user_id', userId)
        .order('created_at', ascending: false)
        .map((data) => data);
  }

  /// Subscribe to module assignments
  Stream<List<Map<String, dynamic>>> subscribeToAssignments(String userId) {
    return _supabase
        .from('module_assignments')
        .stream(primaryKey: ['id'])
        .eq('user_id', userId)
        .order('assigned_at', ascending: false)
        .map((data) => data);
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /// Check if user exists
  Future<bool> userExists(String email) async {
    try {
      final response = await _supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .maybeSingle();

      return response != null;
    } catch (e) {
      return false;
    }
  }

  /// Get user's company
  Future<Map<String, dynamic>?> getUserCompany(String userId) async {
    try {
      final user = await getUserById(userId);
      if (user == null || user['company_id'] == null) return null;

      return await getCompanyById(user['company_id']);
    } catch (e) {
      print('❌ Error getting user company: $e');
      return null;
    }
  }

  /// Get user's role
  Future<String?> getUserRole(String userId) async {
    try {
      final user = await getUserById(userId);
      return user?['role'];
    } catch (e) {
      print('❌ Error getting user role: $e');
      return null;
    }
  }

  /// Check if user is admin
  Future<bool> isUserAdmin(String userId) async {
    final role = await getUserRole(userId);
    return role == 'admin' || role == 'super_admin';
  }

  /// Check if user is manager
  Future<bool> isUserManager(String userId) async {
    final role = await getUserRole(userId);
    return role == 'manager' || role == 'admin' || role == 'super_admin';
  }
}
