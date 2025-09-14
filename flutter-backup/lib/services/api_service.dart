import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  // 🚀 Our working production backend URL
  static const String baseUrl =
      'https://tutora-gmp4esqho-johns-projects-eb6ca0cb.vercel.app';

  // Test connection to our API
  Future<bool> testConnection() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/public-test'),
        headers: {
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['success'] == true;
      }
      return false;
    } catch (e) {
      print('❌ API Connection Error: $e');
      return false;
    }
  }

  // Process file with AI (video or document)
  Future<Map<String, dynamic>> processFileWithAI({
    required File file,
    required String fileType, // 'video' or 'document'
  }) async {
    try {
      print('🚀 Starting AI processing for: ${file.path}');

      // Create multipart request
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/ai/process-content'),
      );

      // Add the file
      var fileBytes = await file.readAsBytes();
      var fileName = file.path.split('/').last;

      request.files.add(
        http.MultipartFile.fromBytes(
          'file',
          fileBytes,
          filename: fileName,
        ),
      );

      // Add file type
      request.fields['fileType'] = fileType;

      print('📤 Sending file to AI processing...');

      // Send request with timeout
      var streamedResponse = await request.send().timeout(
            const Duration(minutes: 5), // AI processing can take time
          );

      var response = await http.Response.fromStream(streamedResponse);

      print('📥 AI Response Status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        if (data['success'] == true) {
          print('✅ AI Processing Successful!');
          return {
            'success': true,
            'title': data['title'] ?? 'AI Generated Module',
            'summary': data['summary'] ?? '',
            'transcript': data['transcript'] ?? '',
            'keyPoints': data['keyPoints'] ?? [],
            'quizQuestions': data['quizQuestions'] ?? [],
            'moduleStructure': data['moduleStructure'] ?? {},
          };
        } else {
          throw Exception(data['error'] ?? 'AI processing failed');
        }
      } else {
        final errorData = json.decode(response.body);
        throw Exception(
            errorData['error'] ?? 'Server error: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ AI Processing Error: $e');
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }

  // Create Stripe checkout session
  Future<Map<String, dynamic>> createCheckoutSession({
    required String planId,
    required String billingCycle,
    required int userCount,
    required String successUrl,
    required String cancelUrl,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/api/stripe/create-checkout-session'),
            headers: {
              'Content-Type': 'application/json',
            },
            body: json.encode({
              'planId': planId,
              'billingCycle': billingCycle,
              'userCount': userCount,
              'successUrl': successUrl,
              'cancelUrl': cancelUrl,
            }),
          )
          .timeout(const Duration(seconds: 30));

      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {
          'success': true,
          'url': data['url'],
          'sessionId': data['sessionId'],
        };
      } else {
        throw Exception(data['error'] ?? 'Failed to create checkout session');
      }
    } catch (e) {
      print('❌ Stripe Checkout Error: $e');
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }

  // Test Stripe connection
  Future<Map<String, dynamic>> testStripeConnection() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/stripe/test'),
        headers: {
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      return json.decode(response.body);
    } catch (e) {
      print('❌ Stripe Test Error: $e');
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }
}
