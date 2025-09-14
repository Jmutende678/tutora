import 'package:flutter/material.dart';

/// Extension to handle the transition from withOpacity to withValues
extension ColorOpacityExtension on Color {
  /// Replacement for withOpacity to avoid the deprecated warning
  Color withAlphaValue(double opacity) {
    // Convert the double opacity (0.0-1.0) to int alpha (0-255)
    final int alpha = (opacity * 255).round().clamp(0, 255);
    return withAlpha(alpha);
  }
} 