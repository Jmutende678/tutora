import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:tutora/widgets/custom_text_field.dart';
import 'package:tutora/widgets/enhanced_primary_button.dart';
import 'package:tutora/widgets/enhanced_loading_state.dart';
import 'package:tutora/widgets/enhanced_error_state.dart';
import 'package:tutora/services/supabase_service.dart'; // NEW: Supabase service
// FIREBASE BACKUP - Commented but preserved for future migration
// import 'package:tutora/services/firebase_service.dart';
import 'package:tutora/screens/login_screen.dart';

class CompanyCodeScreen extends StatefulWidget {
  const CompanyCodeScreen({super.key});

  @override
  State<CompanyCodeScreen> createState() => _CompanyCodeScreenState();
}

class _CompanyCodeScreenState extends State<CompanyCodeScreen> {
  final TextEditingController _companyCodeController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;
  Map<String, dynamic>? _companyData;

  @override
  void dispose() {
    _companyCodeController.dispose();
    super.dispose();
  }

  Future<void> _validateCompanyCode() async {
    if (_companyCodeController.text.trim().isEmpty) {
      setState(() {
        _errorMessage = 'Please enter your company code';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final companyCode = _companyCodeController.text.trim().toUpperCase();

      // 🚀 SUPABASE SERVICE (Active)
      final supabaseService = SupabaseService();
      final company = await supabaseService.getCompanyByCode(companyCode);

      // 🔥 FIREBASE BACKUP CODE (Commented but preserved)
      /*
      final firebaseService = FirebaseService();
      final company = await firebaseService.getCompanyByCode(companyCode);
      */

      if (company != null) {
        setState(() {
          _companyData = company;
          _isLoading = false;
        });

        // Show success and navigate to login
        _showSuccessDialog(company);
      } else {
        setState(() {
          _errorMessage = 'Company code not found. Please check and try again.';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage =
            'Connection error. Please check your internet and try again.';
        _isLoading = false;
      });

      print('❌ Company lookup error: $e');
    }
  }

  void _showSuccessDialog(Map<String, dynamic> company) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green, size: 28),
              SizedBox(width: 12),
              Text('Company Found!'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Welcome to ${company['name']}',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text(
                'Plan: ${company['plan']?.toString().toUpperCase()}',
                style: TextStyle(color: Colors.grey[600]),
              ),
              SizedBox(height: 8),
              Text(
                'You can now log in with your company email and password.',
                style: TextStyle(color: Colors.grey[700]),
              ),
            ],
          ),
          actions: [
            EnhancedPrimaryButton(
              text: 'Continue to Login',
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(
                    builder: (context) => LoginScreen(
                      companyCode: company['companyCode'] ?? '',
                      companyName: company['name'],
                    ),
                  ),
                );
              },
              variant: ButtonVariant.primary,
              size: ButtonSize.medium,
              isFullWidth: false,
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Text(
                'Enter Company Code',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              SizedBox(height: 8),
              Text(
                'Your company administrator will provide you with a unique company code to access training modules.',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600],
                  height: 1.5,
                ),
              ),
              SizedBox(height: 32),

              // Company Code Input
              Container(
                child: TextFormField(
                  controller: _companyCodeController,
                  textCapitalization: TextCapitalization.characters,
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r'[A-Z0-9-]')),
                  ],
                  onFieldSubmitted: (_) => _validateCompanyCode(),
                  decoration: InputDecoration(
                    labelText: 'Company Code',
                    hintText: 'e.g., TUT-2024-ABC123',
                    prefixIcon: Icon(Icons.business),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.blue, width: 2),
                    ),
                  ),
                ),
              ),

              // Error Message
              if (_errorMessage != null) ...[
                SizedBox(height: 16),
                EnhancedErrorState(
                  type: ErrorType.validation,
                  customMessage: _errorMessage,
                  onDismiss: () {
                    setState(() {
                      _errorMessage = null;
                    });
                  },
                  showRetryButton: false,
                ),
              ],

              SizedBox(height: 24),

              // Validate Button
              if (_isLoading)
                EnhancedLoadingState(
                  type: LoadingType.processing,
                  customMessage: 'Validating company code...',
                )
              else
                EnhancedPrimaryButton(
                  text: 'Validate Code',
                  onPressed: _validateCompanyCode,
                  variant: ButtonVariant.primary,
                  size: ButtonSize.large,
                  leadingIcon: Icons.verified_user,
                ),

              Spacer(),

              // Help Section
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blue.shade200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.help_outline, color: Colors.blue.shade700),
                        SizedBox(width: 8),
                        Text(
                          'Need Help?',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.blue.shade700,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    Text(
                      '• Company codes are provided by your administrator\n'
                      '• Format: TUT-YEAR-XXXXXX (e.g., TUT-2024-ABC123)\n'
                      '• Contact your HR department if you don\'t have one',
                      style: TextStyle(
                        color: Colors.blue.shade600,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
