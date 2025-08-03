import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tutora/config/supabase_config.dart';
import 'package:tutora/screens/onboarding_screen.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/theme_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Supabase
  try {
    await SupabaseConfig.initialize();

    // Test connection
    final isConnected = await SupabaseConfig.testConnection();
    if (isConnected) {
      print('✅ Supabase connection verified');
    } else {
      print('⚠️ Supabase connection test failed - some features may not work');
    }
  } catch (e) {
    print('❌ Supabase initialization error: $e');
    print('⚠️ Running in offline mode - some features may not work');
  }

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => ThemeProvider(),
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          return MaterialApp(
            title: 'Tutora',
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.themeMode,
            home: const OnboardingScreen(),
            debugShowCheckedModeBanner: false,
          );
        },
      ),
    );
  }
}
