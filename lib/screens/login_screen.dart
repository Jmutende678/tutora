import 'package:flutter/material.dart';
import 'package:tutora/screens/forgot_password_screen.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/placeholder_logo.dart';
import 'package:tutora/widgets/custom_text_field.dart';
import 'package:tutora/widgets/primary_button.dart';
import 'package:tutora/screens/main_app.dart';

class LoginScreen extends StatefulWidget {
  final String companyCode;

  const LoginScreen({
    super.key,
    required this.companyCode,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isPasswordVisible = false;
  bool _rememberMe = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
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

      // Simulate network delay
      await Future.delayed(const Duration(seconds: 2));

      // In a real app, we would validate credentials with a backend API
      // For demo purposes, we'll check:
      // 1. If the email contains 'admin' to determine admin status
      // 2. If the user email exists in the system to validate the user

      // Check for valid company users (in a real app, this would be a backend API call)
      final validEmails = [
        'admin@example.com',
        'emma@example.com',
        'michael@example.com',
        'sophie@example.com',
        'david@example.com',
      ];

      final userEmail = _emailController.text.toLowerCase();
      final isAdmin = userEmail.contains('admin');
      final isValidUser = validEmails.contains(userEmail);

      setState(() {
        _isLoading = false;
      });

      if (mounted) {
        if (isValidUser) {
          // Valid user - navigate to the main app
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => MainApp(isAdmin: isAdmin),
            ),
          );
        } else {
          // Invalid user - show error
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                  'Invalid email or password. This user is not registered in this company.'),
              backgroundColor: AppTheme.errorColor,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Sign In"),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Company logo and name
                Center(
                  child: Column(
                    children: [
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: PlaceholderLogo.getLogoWidget(),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        "Company: ${widget.companyCode}",
                        style: TextStyle(
                          fontSize: 16,
                          color: isDarkMode
                              ? AppTheme.darkTextSecondaryColor
                              : AppTheme.textSecondaryColor,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Email field
                CustomTextField(
                  label: "Email",
                  hintText: "Enter your email",
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  prefixIcon: Icons.email_outlined,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Please enter your email";
                    } else if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                        .hasMatch(value)) {
                      return "Please enter a valid email";
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Password field
                CustomTextField(
                  label: "Password",
                  hintText: "Enter your password",
                  controller: _passwordController,
                  obscureText: !_isPasswordVisible,
                  prefixIcon: Icons.lock_outlined,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _isPasswordVisible
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      color: Colors.grey,
                    ),
                    onPressed: _togglePasswordVisibility,
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Please enter your password";
                    } else if (value.length < 6) {
                      return "Password must be at least 6 characters";
                    }
                    return null;
                  },
                  onEditingComplete: _login,
                ),
                const SizedBox(height: 16),

                // Remember me & Forgot password
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        SizedBox(
                          height: 24,
                          width: 24,
                          child: Checkbox(
                            value: _rememberMe,
                            onChanged: (value) {
                              setState(() {
                                _rememberMe = value ?? false;
                              });
                            },
                            activeColor: AppTheme.primaryColor,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          "Remember me",
                          style: TextStyle(
                            color: isDarkMode
                                ? AppTheme.darkTextSecondaryColor
                                : AppTheme.textSecondaryColor,
                          ),
                        ),
                      ],
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ForgotPasswordScreen(),
                          ),
                        );
                      },
                      child: const Text(
                        "Forgot Password?",
                        style: TextStyle(
                          color: AppTheme.primaryColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Login button
                PrimaryButton(
                  text: "Sign In",
                  onPressed: _login,
                  isLoading: _isLoading,
                ),

                // Divider
                const SizedBox(height: 36),
                Row(
                  children: [
                    const Expanded(
                      child: Divider(thickness: 1),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        "Company Login Only",
                        style: TextStyle(
                          color: isDarkMode
                              ? AppTheme.darkTextSecondaryColor
                              : AppTheme.textSecondaryColor,
                        ),
                      ),
                    ),
                    const Expanded(
                      child: Divider(thickness: 1),
                    ),
                  ],
                ),

                const SizedBox(height: 24),
                Text(
                  "Need an account? Contact your company administrator.",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: isDarkMode
                        ? AppTheme.darkTextSecondaryColor
                        : AppTheme.textSecondaryColor,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
