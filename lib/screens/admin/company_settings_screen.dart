import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/app_logo.dart';

class CompanySettingsScreen extends StatefulWidget {
  const CompanySettingsScreen({super.key});

  @override
  State<CompanySettingsScreen> createState() => _CompanySettingsScreenState();
}

class _CompanySettingsScreenState extends State<CompanySettingsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _companyNameController = TextEditingController();
  final _companyCodeController = TextEditingController();

  bool _isLoading = false;
  bool _isUploading = false;

  // In a real app, these would be loaded from storage or a backend
  String? _companyLogoBase64;
  String _companyName = "Tutora, Inc.";
  String _companyCode = "TUTORA";

  @override
  void initState() {
    super.initState();
    _loadCompanyData();
  }

  @override
  void dispose() {
    _companyNameController.dispose();
    _companyCodeController.dispose();
    super.dispose();
  }

  Future<void> _loadCompanyData() async {
    setState(() {
      _isLoading = true;
    });

    // Simulate API call to load company data
    await Future.delayed(const Duration(seconds: 1));

    // In a real app, this would be loaded from a backend
    _companyLogoBase64 = null; // No custom logo initially
    _companyNameController.text = _companyName;
    _companyCodeController.text = _companyCode;

    setState(() {
      _isLoading = false;
    });
  }

  Future<void> _uploadLogo() async {
    // Show a mock file picker
    setState(() {
      _isUploading = true;
    });

    try {
      // In a real app, we would open a file picker here
      // For now, just simulate a delay and use a placeholder image
      await Future.delayed(const Duration(seconds: 1));

      // Create a mock base64 image - using a 1x1 transparent PNG as placeholder
      const mockBase64 =
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

      if (mounted) {
        setState(() {
          _companyLogoBase64 = mockBase64;
          _isUploading = false;
        });

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Logo uploaded successfully!'),
            backgroundColor: AppTheme.successColor,
          ),
        );
      }
    } catch (e) {
      // Handle error
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error uploading logo: $e'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    } finally {
      // If dialog was dismissed or error occurred
      if (mounted) {
        setState(() {
          _isUploading = false;
        });
      }
    }
  }

  Future<void> removeLogo() async {
    // In a real app, this would delete the logo from storage
    setState(() {
      _isUploading = true;
    });

    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));

    setState(() {
      _companyLogoBase64 = null;
      _isUploading = false;
    });

    // Show success message
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Logo removed successfully!'),
          backgroundColor: AppTheme.successColor,
        ),
      );
    }
  }

  Future<void> saveCompanySettings() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      // Simulate API call to save company settings
      await Future.delayed(const Duration(seconds: 1));

      // In a real app, this would update the company details in a backend
      _companyName = _companyNameController.text;
      _companyCode = _companyCodeController.text.toUpperCase();

      setState(() {
        _isLoading = false;
      });

      // Show success message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Company settings saved successfully!'),
            backgroundColor: AppTheme.successColor,
          ),
        );
      }
    }
  }

  Widget buildLogoWidget() {
    if (_companyLogoBase64 != null) {
      return Image.memory(
        base64Decode(_companyLogoBase64!),
        width: 150,
        height: 150,
        fit: BoxFit.contain,
      );
    } else {
      return AppLogo.getLogo(size: 120);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Company Settings'),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Company logo section
                    Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Company Logo',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: isDarkMode
                                    ? AppTheme.darkTextPrimaryColor
                                    : AppTheme.textPrimaryColor,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                // Logo preview
                                Container(
                                  width: 150,
                                  height: 150,
                                  decoration: BoxDecoration(
                                    color: isDarkMode
                                        ? Colors.grey.shade800
                                        : Colors.grey.shade200,
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: isDarkMode
                                          ? Colors.grey.shade700
                                          : Colors.grey.shade300,
                                    ),
                                  ),
                                  child: buildLogoWidget(),
                                ),
                                const SizedBox(width: 24),

                                // Upload buttons
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Company logo appears on the login screen and throughout the app.',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: isDarkMode
                                              ? AppTheme.darkTextSecondaryColor
                                              : AppTheme.textSecondaryColor,
                                        ),
                                      ),
                                      const SizedBox(height: 16),
                                      ElevatedButton.icon(
                                        onPressed:
                                            _isUploading ? null : _uploadLogo,
                                        icon: _isUploading
                                            ? Container(
                                                width: 24,
                                                height: 24,
                                                padding:
                                                    const EdgeInsets.all(2.0),
                                                child:
                                                    const CircularProgressIndicator(
                                                  color: Colors.white,
                                                  strokeWidth: 3,
                                                ),
                                              )
                                            : Icon(Icons.upload),
                                        label: Text(_isUploading
                                            ? 'Uploading...'
                                            : 'Upload Logo'),
                                        style: ElevatedButton.styleFrom(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 12, horizontal: 16),
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      if (_companyLogoBase64 != null)
                                        OutlinedButton.icon(
                                          onPressed:
                                              _isUploading ? null : removeLogo,
                                          icon: Icon(Icons.delete),
                                          label: const Text('Remove Logo'),
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor:
                                                AppTheme.errorColor,
                                            padding: const EdgeInsets.symmetric(
                                                vertical: 12, horizontal: 16),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Recommended size: 200 x 200 pixels, PNG format with transparency.',
                              style: TextStyle(
                                fontSize: 12,
                                fontStyle: FontStyle.italic,
                                color: isDarkMode
                                    ? AppTheme.darkTextSecondaryColor
                                    : AppTheme.textSecondaryColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Company details section
                    Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Company Details',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: isDarkMode
                                    ? AppTheme.darkTextPrimaryColor
                                    : AppTheme.textPrimaryColor,
                              ),
                            ),
                            const SizedBox(height: 16),

                            // Company name field
                            TextFormField(
                              controller: _companyNameController,
                              decoration: const InputDecoration(
                                labelText: 'Company Name',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.business),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter company name';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),

                            // Company code field
                            TextFormField(
                              controller: _companyCodeController,
                              decoration: const InputDecoration(
                                labelText: 'Company Code',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.code),
                                helperText:
                                    'Used by employees to access your training platform',
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter company code';
                                }
                                if (value.length < 3) {
                                  return 'Company code must be at least 3 characters';
                                }
                                return null;
                              },
                              textCapitalization: TextCapitalization.characters,
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Save button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : saveCompanySettings,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          child: _isLoading
                              ? const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 3,
                                  ),
                                )
                              : const Text(
                                  'Save Settings',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
