import 'package:flutter/material.dart';

class AppTheme {
  // Primary colors
  static const Color primaryColor = Color(0xFF2196F3);
  static const Color primaryLightColor = Color(0xFF64B5F6);
  static const Color primaryDarkColor = Color(0xFF1976D2);
  static const Color secondaryColor = Color(0xFF4CAF50);
  
  // Error colors
  static const Color errorColor = Color(0xFFD32F2F);
  
  // Text colors - Light mode
  static const Color textPrimaryColor = Color(0xFF212121);
  static const Color textSecondaryColor = Color(0xFF757575);
  
  // Text colors - Dark mode
  static const Color darkTextPrimaryColor = Color(0xFFF5F5F5);
  static const Color darkTextSecondaryColor = Color(0xFFBDBDBD);
  
  // Background colors
  static const Color scaffoldBackgroundColorLight = Color(0xFFF5F5F5);
  static const Color scaffoldBackgroundColorDark = Color(0xFF121212);
  
  // Card colors
  static const Color cardColorLight = Colors.white;
  static const Color cardColorDark = Color(0xFF1E1E1E);
  static const Color darkSurfaceColor = Color(0xFF1E1E1E);
  
  // Module status colors
  static const Color notStartedColor = Color(0xFF9E9E9E);
  static const Color inProgressColor = primaryColor;
  static const Color completedColor = successColor;
  
  // Status colors
  static const Color successColor = Color(0xFF4CAF50);
  static const Color warningColor = Color(0xFFFFC107);
  static const Color infoColor = Color(0xFF2196F3);
  
  // Divider colors
  static const Color dividerColorLight = Color(0xFFE0E0E0);
  static const Color dividerColorDark = Color(0xFF424242);

  // Light theme
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primaryColor,
      brightness: Brightness.light,
    ),
    scaffoldBackgroundColor: scaffoldBackgroundColorLight,
    cardColor: cardColorLight,
    dividerColor: dividerColorLight,
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        color: textPrimaryColor,
        fontSize: 26,
        fontWeight: FontWeight.bold,
      ),
      displayMedium: TextStyle(
        color: textPrimaryColor,
        fontSize: 22,
        fontWeight: FontWeight.bold,
      ),
      displaySmall: TextStyle(
        color: textPrimaryColor,
        fontSize: 18,
        fontWeight: FontWeight.w600,
      ),
      bodyLarge: TextStyle(
        color: textPrimaryColor,
        fontSize: 16,
      ),
      bodyMedium: TextStyle(
        color: textSecondaryColor,
        fontSize: 14,
      ),
      bodySmall: TextStyle(
        color: textSecondaryColor,
        fontSize: 12,
      ),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: primaryColor,
      foregroundColor: Colors.white,
      elevation: 0,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    checkboxTheme: CheckboxThemeData(
      fillColor: WidgetStateProperty.resolveWith<Color>((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryColor;
        }
        return Colors.transparent;
      }),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
      ),
    ),
  );

  // Dark theme
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primaryColor,
      brightness: Brightness.dark,
    ),
    scaffoldBackgroundColor: scaffoldBackgroundColorDark,
    cardColor: cardColorDark,
    dividerColor: dividerColorDark,
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        color: darkTextPrimaryColor,
        fontSize: 26,
        fontWeight: FontWeight.bold,
      ),
      displayMedium: TextStyle(
        color: darkTextPrimaryColor,
        fontSize: 22,
        fontWeight: FontWeight.bold,
      ),
      displaySmall: TextStyle(
        color: darkTextPrimaryColor,
        fontSize: 18,
        fontWeight: FontWeight.w600,
      ),
      bodyLarge: TextStyle(
        color: darkTextPrimaryColor,
        fontSize: 16,
      ),
      bodyMedium: TextStyle(
        color: darkTextSecondaryColor,
        fontSize: 14,
      ),
      bodySmall: TextStyle(
        color: darkTextSecondaryColor,
        fontSize: 12,
      ),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: primaryDarkColor,
      foregroundColor: Colors.white,
      elevation: 0,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    checkboxTheme: CheckboxThemeData(
      fillColor: WidgetStateProperty.resolveWith<Color>((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryColor;
        }
        return Colors.grey.shade800;
      }),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
      ),
    ),
  );
} 