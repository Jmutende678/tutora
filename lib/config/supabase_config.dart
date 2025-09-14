import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  // 🚀 PRODUCTION SUPABASE CONFIGURATION
  static const String supabaseUrl = 'https://sphkmvjfufrjbojfahar.supabase.co';
  static const String supabaseAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTY1NDAsImV4cCI6MjA2ODc3MjU0MH0.vdWWqD_XdpPBcT-TfVC5jHL1qTR9Evf4Sc7CP31mp7w';

  // Initialize Supabase
  static Future<void> initialize() async {
    try {
      await Supabase.initialize(
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        debug: false, // Set to false for production
      );
      print('✅ Supabase initialized successfully');
    } catch (e) {
      print('❌ Supabase initialization error: $e');
      rethrow;
    }
  }

  // Get Supabase client
  static SupabaseClient get client => Supabase.instance.client;

  // Helper methods
  static bool get isInitialized => Supabase.instance.client != null;

  static Future<bool> testConnection() async {
    try {
      final response = await client.from('companies').select('count').limit(1);
      return response != null;
    } catch (e) {
      print('❌ Supabase connection test failed: $e');
      return false;
    }
  }
}
