import 'package:flutter/material.dart';
import 'package:tutora/screens/forgot_password_screen.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/app_logo.dart';
import 'package:tutora/widgets/custom_text_field.dart';
import 'package:tutora/widgets/primary_button.dart';
import 'package:tutora/screens/main_app.dart';
import 'package:tutora/services/supabase_service.dart';

class LoginScreen extends StatefulWidget {
  final String companyCode;
  final String? companyName;

  const LoginScreen({
    super.key,
    required this.companyCode,
    this.companyName,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with TickerProviderStateMixin {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isPasswordVisible = false;
  bool _rememberMe = false;
  bool _isLoading = false;

  late AnimationController _animationController;
  late AnimationController _companyBadgeController;
  late Animation<double> _fadeInAnimation;
  late Animation<double> _slideAnimation;
  late Animation<double> _badgeScaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _companyBadgeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    _fadeInAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.8, curve: Curves.easeOut),
      ),
    );

    _slideAnimation = Tween<double>(begin: 40.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.2, 1.0, curve: Curves.easeOut),
      ),
    );

    _badgeScaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _companyBadgeController,
        curve: Curves.elasticOut,
      ),
    );

    _companyBadgeController.forward();
    _animationController.forward();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _animationController.dispose();
    _companyBadgeController.dispose();
    super.dispose();
  }

  void _togglePasswordVisibility() {
    setState(() {
      _isPasswordVisible = !_isPasswordVisible;
    });
  }

  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      try {
        // Use real Supabase authentication
        final supabaseService = SupabaseService();
        final response = await supabaseService.signInWithEmailAndPassword(
          _emailController.text.trim(),
          _passwordController.text.trim(),
        );

        setState(() {
          _isLoading = false;
        });

        if (mounted && response != null && response.user != null) {
          // Get user role and permissions
          final userData = await supabaseService.getUserById(response.user!.id);
          final isAdmin =
              userData?['role'] == 'admin' || userData?['role'] == 'manager';

          // Navigate to main app
          Navigator.pushReplacement(
            context,
            PageRouteBuilder(
              pageBuilder: (context, animation, secondaryAnimation) =>
                  MainApp(isAdmin: isAdmin),
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
          // Authentication failed
          if (mounted) {
            _showErrorSnackBar(
                'Invalid email or password. Please check your credentials.');
          }
        }
      } catch (e) {
        setState(() {
          _isLoading = false;
        });

        if (mounted) {
          String errorMessage = 'Login failed. Please try again.';

          if (e.toString().contains('Invalid login credentials')) {
            errorMessage =
                'Invalid email or password. Please check your credentials.';
          } else if (e.toString().contains('Email not confirmed')) {
            errorMessage = 'Please check your email and confirm your account.';
          } else if (e.toString().contains('network')) {
            errorMessage = 'Network error. Please check your connection.';
          }

          _showErrorSnackBar(errorMessage);
        }

        print('❌ Login error: $e');
      }
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.error_outline, color: Colors.white),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: AppTheme.errorColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isDarkMode
                ? [
                    AppTheme.primaryColor.withValues(alpha: 0.15),
                    AppTheme.scaffoldBackgroundColorDark,
                  ]
                : [
                    AppTheme.primaryColor.withValues(alpha: 0.08),
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
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: ConstrainedBox(
                      constraints: BoxConstraints(
                        minHeight: screenHeight -
                            MediaQuery.of(context).padding.top -
                            MediaQuery.of(context).padding.bottom,
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24.0),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Top spacing
                              SizedBox(height: screenHeight * 0.08),

                              // Logo and company info
                              Center(
                                child: Column(
                                  children: [
                                    AppLogo.getLogo(size: 80),
                                    const SizedBox(height: 20),

                                    // Company badge
                                    ScaleTransition(
                                      scale: _badgeScaleAnimation,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 20, vertical: 12),
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: [
                                              AppTheme.primaryColor
                                                  .withValues(alpha: 0.15),
                                              AppTheme.primaryColor
                                                  .withValues(alpha: 0.08),
                                            ],
                                            begin: Alignment.topLeft,
                                            end: Alignment.bottomRight,
                                          ),
                                          borderRadius:
                                              BorderRadius.circular(24),
                                          border: Border.all(
                                            color: AppTheme.primaryColor
                                                .withValues(alpha: 0.2),
                                            width: 1,
                                          ),
                                        ),
                                        child: Column(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            if (widget.companyName != null) ...[
                                              Text(
                                                widget.companyName!,
                                                style: const TextStyle(
                                                  fontSize: 18,
                                                  fontWeight: FontWeight.w600,
                                                  color: AppTheme.primaryColor,
                                                ),
                                                textAlign: TextAlign.center,
                                              ),
                                              const SizedBox(height: 4),
                                            ],
                                            Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                      horizontal: 12,
                                                      vertical: 4),
                                              decoration: BoxDecoration(
                                                color: AppTheme.primaryColor
                                                    .withValues(alpha: 0.1),
                                                borderRadius:
                                                    BorderRadius.circular(12),
                                              ),
                                              child: Text(
                                                widget.companyCode,
                                                style: const TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w600,
                                                  color: AppTheme.primaryColor,
                                                  fontFamily: 'monospace',
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),

                                    const SizedBox(height: 32),

                                    // Welcome text
                                    Text(
                                      'Welcome back',
                                      style: TextStyle(
                                        fontSize: 28,
                                        fontWeight: FontWeight.bold,
                                        color: isDarkMode
                                            ? AppTheme.darkTextPrimaryColor
                                            : AppTheme.textPrimaryColor,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Sign in to continue your learning journey',
                                      style: TextStyle(
                                        fontSize: 16,
                                        color: isDarkMode
                                            ? AppTheme.darkTextSecondaryColor
                                            : AppTheme.textSecondaryColor,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(height: 40),

                              // Login form container
                              Container(
                                padding: const EdgeInsets.all(28),
                                decoration: BoxDecoration(
                                  color: isDarkMode
                                      ? AppTheme.cardColorDark
                                      : Colors.white,
                                  borderRadius: BorderRadius.circular(24),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(
                                          alpha: isDarkMode ? 0.3 : 0.1),
                                      blurRadius: 24,
                                      offset: const Offset(0, 12),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  children: [
                                    // Email field
                                    CustomTextField(
                                      label: "Email Address",
                                      hintText: "Enter your email",
                                      controller: _emailController,
                                      prefixIcon: Icons.email_outlined,
                                      keyboardType: TextInputType.emailAddress,
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return "Please enter your email";
                                        }
                                        if (!RegExp(
                                                r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                                            .hasMatch(value)) {
                                          return "Please enter a valid email";
                                        }
                                        return null;
                                      },
                                    ),
                                    const SizedBox(height: 20),

                                    // Password field
                                    CustomTextField(
                                      label: "Password",
                                      hintText: "Enter your password",
                                      controller: _passwordController,
                                      prefixIcon: Icons.lock_outline,
                                      obscureText: !_isPasswordVisible,
                                      suffixIcon: IconButton(
                                        icon: Icon(
                                          _isPasswordVisible
                                              ? Icons.visibility_rounded
                                              : Icons.visibility_off_rounded,
                                          color: isDarkMode
                                              ? AppTheme.darkTextSecondaryColor
                                              : AppTheme.textSecondaryColor,
                                        ),
                                        onPressed: _togglePasswordVisibility,
                                      ),
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return "Please enter your password";
                                        }
                                        if (value.length < 6) {
                                          return "Password must be at least 6 characters";
                                        }
                                        return null;
                                      },
                                    ),
                                    const SizedBox(height: 20),

                                    // Remember me and Forgot password
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Flexible(
                                          child: Row(
                                            children: [
                                              SizedBox(
                                                height: 20,
                                                width: 20,
                                                child: Checkbox(
                                                  value: _rememberMe,
                                                  onChanged: (value) {
                                                    setState(() {
                                                      _rememberMe =
                                                          value ?? false;
                                                    });
                                                  },
                                                  activeColor:
                                                      AppTheme.primaryColor,
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            4),
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(width: 8),
                                              Flexible(
                                                child: Text(
                                                  "Remember me",
                                                  style: TextStyle(
                                                    fontSize: 14,
                                                    color: isDarkMode
                                                        ? AppTheme
                                                            .darkTextSecondaryColor
                                                        : AppTheme
                                                            .textSecondaryColor,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        TextButton(
                                          onPressed: () {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder: (context) =>
                                                    const ForgotPasswordScreen(),
                                              ),
                                            );
                                          },
                                          child: const Text(
                                            "Forgot Password?",
                                            style: TextStyle(
                                              color: AppTheme.primaryColor,
                                              fontWeight: FontWeight.w600,
                                              fontSize: 14,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 28),

                                    // Login button
                                    PrimaryButton(
                                      text: "Sign In",
                                      onPressed: _isLoading ? null : _login,
                                      isLoading: _isLoading,
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(height: 32),

                              // Demo credentials info
                              Container(
                                padding: const EdgeInsets.all(20),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryColor
                                      .withValues(alpha: 0.08),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: AppTheme.primaryColor
                                        .withValues(alpha: 0.2),
                                  ),
                                ),
                                child: Column(
                                  children: [
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.info_outline_rounded,
                                          color: AppTheme.primaryColor,
                                          size: 20,
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          "Demo Account",
                                          style: TextStyle(
                                            fontWeight: FontWeight.w600,
                                            color: AppTheme.primaryColor,
                                            fontSize: 16,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 12),
                                    Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(
                                        color: isDarkMode
                                            ? Colors.white
                                                .withValues(alpha: 0.05)
                                            : Colors.white
                                                .withValues(alpha: 0.7),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Column(
                                        children: [
                                          Row(
                                            children: [
                                              Icon(
                                                Icons.email_outlined,
                                                size: 16,
                                                color: AppTheme.primaryColor,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                "admin@example.com",
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w500,
                                                  color: isDarkMode
                                                      ? AppTheme
                                                          .darkTextSecondaryColor
                                                      : AppTheme
                                                          .textSecondaryColor,
                                                  fontFamily: 'monospace',
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 8),
                                          Row(
                                            children: [
                                              Icon(
                                                Icons.lock_outline,
                                                size: 16,
                                                color: AppTheme.primaryColor,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                "any password",
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  color: isDarkMode
                                                      ? AppTheme
                                                          .darkTextSecondaryColor
                                                      : AppTheme
                                                          .textSecondaryColor,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              // Bottom spacing
                              SizedBox(height: screenHeight * 0.08),
                            ],
                          ),
                        ),
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
