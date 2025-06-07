import 'package:flutter/material.dart';
import 'package:tutora/screens/login_screen.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/placeholder_logo.dart';
import 'package:tutora/widgets/custom_text_field.dart';
import 'package:tutora/widgets/primary_button.dart';

class CompanyCodeScreen extends StatefulWidget {
  const CompanyCodeScreen({super.key});

  @override
  State<CompanyCodeScreen> createState() => _CompanyCodeScreenState();
}

class _CompanyCodeScreenState extends State<CompanyCodeScreen> with SingleTickerProviderStateMixin {
  final _companyCodeController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  late AnimationController _animationController;
  late Animation<double> _fadeInAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeInAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeIn,
      ),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _companyCodeController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  void _validateAndContinue() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });
      
      // Store the context before the async operation
      final BuildContext currentContext = context;
      
      // Simulate API call to validate company code
      Future.delayed(const Duration(seconds: 1), () {
        final companyCode = _companyCodeController.text.trim().toUpperCase();
        
        // In a real app, this would be an API call to validate the company code
        // For demo purposes, we'll just check against a list of valid codes
        final validCompanyCodes = ['ACME', 'TUTORA', 'DEMO', 'TEST'];
        
        setState(() {
          _isLoading = false;
        });
        
        if (validCompanyCodes.contains(companyCode)) {
          // Valid company code - proceed to login
          Navigator.pushReplacement(
            currentContext,
            MaterialPageRoute(
              builder: (context) => LoginScreen(
                companyCode: companyCode,
              ),
            ),
          );
        } else {
          // Invalid company code - show error
          ScaffoldMessenger.of(currentContext).showSnackBar(
            const SnackBar(
              content: Text('Invalid company code. Please try again or contact support.'),
              backgroundColor: AppTheme.errorColor,
            ),
          );
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      body: SafeArea(
        child: FadeTransition(
          opacity: _fadeInAnimation,
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Logo section
                  Center(
                    child: Container(
                      width: 150,
                      height: 150,
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: PlaceholderLogo.getLogoWidget(),
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Welcome text
                  Text(
                    "Welcome to Tutora",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: isDarkMode 
                          ? AppTheme.darkTextPrimaryColor 
                          : AppTheme.textPrimaryColor,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    "Enter your company code to continue",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      color: isDarkMode 
                          ? AppTheme.darkTextSecondaryColor 
                          : AppTheme.textSecondaryColor,
                    ),
                  ),
                  SizedBox(height: screenSize.height * 0.08),
                  
                  // Company code input
                  CustomTextField(
                    label: "Company Code",
                    hintText: "Enter your company code",
                    controller: _companyCodeController,
                    prefixIcon: Icons.business,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Please enter a company code";
                      } else if (value.length < 4) {
                        return "Company code is too short";
                      }
                      return null;
                    },
                    onEditingComplete: _validateAndContinue,
                  ),
                  const SizedBox(height: 24),
                  
                  // Continue button
                  PrimaryButton(
                    text: "Continue",
                    onPressed: _validateAndContinue,
                    isLoading: _isLoading,
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Help link
                  Center(
                    child: TextButton(
                      onPressed: () {
                        // Show help dialog
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text("Need Help?"),
                            content: const Text(
                              "Contact your administrator to get your company code. "
                              "This code is used to access your organization's training materials.",
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text("OK"),
                              ),
                            ],
                          ),
                        );
                      },
                      child: const Text(
                        "Need help?",
                        style: TextStyle(
                          color: AppTheme.primaryColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
} 