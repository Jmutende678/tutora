import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/app_logo.dart';

class IconPreviewScreen extends StatelessWidget {
  const IconPreviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.scaffoldBackgroundColorLight,
      appBar: AppBar(
        title: const Text('Tutora App Icons'),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: AppTheme.textPrimaryColor,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppTheme.primaryColor.withValues(alpha: 0.1),
                    AppTheme.accentColor.withValues(alpha: 0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppTheme.primaryColor.withValues(alpha: 0.2),
                ),
              ),
              child: Column(
                children: [
                  AppLogo.getLogo(size: 80),
                  const SizedBox(height: 16),
                  const Text(
                    'New Gradient App Icons',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Beautiful gradient icons ready for all platforms',
                    style: TextStyle(
                      fontSize: 16,
                      color: AppTheme.textSecondaryColor,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Icon Grid
            AppLogo.getIconSizeGrid(),

            const SizedBox(height: 32),

            // Instructions
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
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
                      Icon(Icons.info_outline, color: Colors.blue.shade700),
                      const SizedBox(width: 8),
                      Text(
                        'How to Update App Icons',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue.shade700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    '1. Screenshot each icon size above\n'
                    '2. Save them as PNG files\n'
                    '3. Replace the files in:\n'
                    '   • assets/images/tutora_logo.png\n'
                    '   • Android: android/app/src/main/res/mipmap-*/\n'
                    '   • iOS: ios/Runner/Assets.xcassets/AppIcon.appiconset/\n'
                    '4. Run: flutter packages pub run flutter_launcher_icons\n'
                    '5. Rebuild your app',
                    style: TextStyle(
                      fontSize: 14,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Action buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(Icons.arrow_back),
                    label: const Text('Back to App'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      // Show a dialog with step-by-step instructions
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          title: const Text('Icon Update Steps'),
                          content: const SingleChildScrollView(
                            child: Text('To update your app icons:\n\n'
                                '1. Take screenshots of the icons above\n'
                                '2. Use the flutter_launcher_icons package\n'
                                '3. Run the generate command\n'
                                '4. Rebuild your app\n\n'
                                'The icons are already configured in pubspec.yaml!'),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Got it!'),
                            ),
                          ],
                        ),
                      );
                    },
                    icon: Icon(Icons.help_outline),
                    label: const Text('Help'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
