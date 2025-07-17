import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:tutora/firebase_options.dart';
import 'package:tutora/screens/onboarding_screen.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/theme_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 🔥 Firebase is now ENABLED for production
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    print('✅ Firebase initialized successfully');
  } catch (e) {
    print('❌ Firebase initialization error: $e');
    // In production, you may want to show an error screen instead of continuing
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
