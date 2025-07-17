import 'package:flutter/material.dart';
import 'package:tutora/screens/login_screen.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/app_logo.dart';
import 'package:tutora/widgets/custom_text_field.dart';
import 'package:tutora/widgets/primary_button.dart';
import 'package:tutora/services/firebase_service.dart'; // Added import for FirebaseService

class CompanyCodeScreen extends StatefulWidget {
  const CompanyCodeScreen({super.key});

  @override
  State<CompanyCodeScreen> createState() => _CompanyCodeScreenState();
}

class _CompanyCodeScreenState extends State<CompanyCodeScreen>
    with TickerProviderStateMixin {
  final _companyCodeController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  late AnimationController _animationController;
  late AnimationController _logoAnimationController;
  late Animation<double> _fadeInAnimation;
  late Animation<double> _slideAnimation;
  late Animation<double> _logoScaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _logoAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _fadeInAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.6, curve: Curves.easeOut),
      ),
    );

    _slideAnimation = Tween<double>(begin: 50.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.3, 1.0, curve: Curves.easeOut),
      ),
    );

    _logoScaleAnimation = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(
        parent: _logoAnimationController,
        curve: Curves.elasticOut,
      ),
    );

    _logoAnimationController.forward();
    _animationController.forward();
  }

  @override
  void dispose() {
    _companyCodeController.dispose();
    _animationController.dispose();
    _logoAnimationController.dispose();
    super.dispose();
  }

  void _validateAndContinue() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      try {
        final companyCode = _companyCodeController.text.trim().toUpperCase();

        // Use Firebase service to lookup company
        final firebaseService = FirebaseService();
        final company = await firebaseService.getCompanyByCode(companyCode);

        setState(() {
          _isLoading = false;
        });

        if (!mounted) return;

        if (company != null) {
          // Valid company found, proceed to login
          Navigator.pushReplacement(
            context,
            PageRouteBuilder(
              pageBuilder: (context, animation, secondaryAnimation) =>
                  LoginScreen(
                companyCode: companyCode,
                companyName: company['name'] ?? 'Unknown Company',
              ),
              transitionsBuilder:
                  (context, animation, secondaryAnimation, child) {
                const begin = Offset(1.0, 0.0);
                const end = Offset.zero;
                const curve = Curves.easeInOut;

                var tween = Tween(begin: begin, end: end).chain(
                  CurveTween(curve: curve),
                );

                return SlideTransition(
                  position: animation.drive(tween),
                  child: child,
                );
              },
            ),
          );
        } else {
          // Invalid company code
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Row(
                children: [
                  Icon(Icons.error_outline, color: Colors.white),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                        'Invalid company code. Please check with your administrator.'),
                  ),
                ],
              ),
              backgroundColor: AppTheme.errorColor,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          );
        }
      } catch (e) {
        setState(() {
          _isLoading = false;
        });

        if (!mounted) return;

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error_outline, color: Colors.white),
                const SizedBox(width: 12),
                Expanded(
                  child: Text('Connection error: ${e.toString()}'),
                ),
              ],
            ),
            backgroundColor: AppTheme.errorColor,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isDarkMode
                ? [
                    AppTheme.primaryColor.withValues(alpha: 0.1),
                    AppTheme.scaffoldBackgroundColorDark,
                  ]
                : [
                    AppTheme.primaryColor.withValues(alpha: 0.05),
                    Colors.white,
                  ],
          ),
        ),
        child: SafeArea(
          child: AnimatedBuilder(
            animation: _animationController,
            builder: (context, child) {
              return Transform.translate(
                offset: Offset(0, _slideAnimation.value),
                child: Opacity(
                  opacity: _fadeInAnimation.value,
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const Spacer(),

                          // Animated Logo section
                          Center(
                            child: ScaleTransition(
                              scale: _logoScaleAnimation,
                              child: AppLogo.getLogo(size: 120),
                            ),
                          ),
                          const SizedBox(height: 32),

                          // Welcome text
                          Text(
                            "Welcome to Tutora",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: isDarkMode
                                  ? AppTheme.darkTextPrimaryColor
                                  : AppTheme.textPrimaryColor,
                            ),
                          ),
                          const SizedBox(height: 12),

                          Text(
                            "Your learning journey starts here",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 16,
                              color: isDarkMode
                                  ? AppTheme.darkTextSecondaryColor
                                  : AppTheme.textSecondaryColor,
                            ),
                          ),

                          const SizedBox(height: 48),

                          // Company code input
                          Container(
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: isDarkMode
                                  ? AppTheme.cardColorDark
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.1),
                                  blurRadius: 20,
                                  offset: const Offset(0, 10),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "Company Code",
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: isDarkMode
                                        ? AppTheme.darkTextPrimaryColor
                                        : AppTheme.textPrimaryColor,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                CustomTextField(
                                  label: "",
                                  controller: _companyCodeController,
                                  hintText: "Enter your company code",
                                  prefixIcon: Icons.business,
                                  textCapitalization:
                                      TextCapitalization.characters,
                                  validator: (value) {
                                    if (value == null || value.trim().isEmpty) {
                                      return 'Please enter your company code';
                                    }
                                    if (value.trim().length < 3) {
                                      return 'Company code must be at least 3 characters';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 20),
                                PrimaryButton(
                                  text: "Continue",
                                  onPressed:
                                      _isLoading ? null : _validateAndContinue,
                                  isLoading: _isLoading,
                                ),
                              ],
                            ),
                          ),

                          const Spacer(),

                          // Help text
                          Center(
                            child: Text(
                              "Don't have a company code? Contact your administrator",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 14,
                                color: isDarkMode
                                    ? AppTheme.darkTextSecondaryColor
                                    : AppTheme.textSecondaryColor,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
