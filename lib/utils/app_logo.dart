import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';

class AppLogo {
  // Set this to true after adding your logo to assets
  static const bool _useCustomLogo = true;
  static const String _logoPath = 'assets/images/tutora_logo.png';

  static Widget getLogo({double? size}) {
    final logoSize = size ?? 100.0;

    if (_useCustomLogo) {
      return Image.asset(
        _logoPath,
        width: logoSize,
        height: logoSize,
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) {
          return _getDefaultLogo(logoSize);
        },
      );
    }

    return _getDefaultLogo(logoSize);
  }

  static Widget getSmallLogo({double? size}) {
    final logoSize = size ?? 32.0;

    if (_useCustomLogo) {
      return Image.asset(
        _logoPath,
        width: logoSize,
        height: logoSize,
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) {
          return _getDefaultSmallLogo(logoSize);
        },
      );
    }

    return _getDefaultSmallLogo(logoSize);
  }

  static Widget getIconOnly({double? size, Color? color}) {
    final iconSize = size ?? 24.0;

    if (_useCustomLogo) {
      return SizedBox(
        width: iconSize,
        height: iconSize,
        child: Image.asset(
          _logoPath,
          width: iconSize,
          height: iconSize,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) {
            return Icon(
              Icons.view_in_ar_rounded,
              size: iconSize,
              color: color ?? AppTheme.primaryColor,
            );
          },
        ),
      );
    }

    return Icon(
      Icons.view_in_ar_rounded,
      size: iconSize,
      color: color ?? AppTheme.primaryColor,
    );
  }

  // Default logo designs matching the blue cube theme
  static Widget _getDefaultLogo(double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: const RadialGradient(
          center: Alignment(-0.3, -0.3),
          radius: 1.2,
          colors: [
            Color(0xFF64B5FF), // Light blue center
            Color(0xFF2E9CFF), // Main blue
            Color(0xFF0B7BD8), // Dark blue edge
            Color(0xFF1565C0), // Even darker blue for depth
          ],
          stops: [0.0, 0.4, 0.8, 1.0],
        ),
        borderRadius: BorderRadius.circular(size * 0.22),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2E9CFF).withValues(alpha: 0.4),
            blurRadius: size * 0.15,
            offset: Offset(0, size * 0.08),
          ),
          BoxShadow(
            color: const Color(0xFF0B7BD8).withValues(alpha: 0.2),
            blurRadius: size * 0.05,
            offset: Offset(0, size * 0.02),
          ),
        ],
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Background glow effect
          Container(
            width: size * 0.8,
            height: size * 0.8,
            decoration: BoxDecoration(
              gradient: RadialGradient(
                colors: [
                  Colors.white.withValues(alpha: 0.3),
                  Colors.transparent,
                ],
              ),
              shape: BoxShape.circle,
            ),
          ),
          // Main icon
          Container(
            padding: EdgeInsets.all(size * 0.15),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.school_rounded,
                  size: size * 0.35,
                  color: Colors.white,
                ),
                SizedBox(height: size * 0.05),
                Text(
                  'T',
                  style: TextStyle(
                    fontSize: size * 0.25,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: -1,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static Widget _getDefaultSmallLogo(double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF64B5FF), // Light blue
            Color(0xFF2E9CFF), // Main blue
            Color(0xFF0B7BD8), // Dark blue
          ],
          stops: [0.0, 0.6, 1.0],
        ),
        borderRadius: BorderRadius.circular(size * 0.22),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2E9CFF).withValues(alpha: 0.3),
            blurRadius: size * 0.1,
            offset: Offset(0, size * 0.05),
          ),
        ],
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Subtle inner glow
          Container(
            width: size * 0.7,
            height: size * 0.7,
            decoration: BoxDecoration(
              gradient: RadialGradient(
                colors: [
                  Colors.white.withValues(alpha: 0.2),
                  Colors.transparent,
                ],
              ),
              shape: BoxShape.circle,
            ),
          ),
          // Icon
          Text(
            'T',
            style: TextStyle(
              fontSize: size * 0.55,
              fontWeight: FontWeight.w900,
              color: Colors.white,
              letterSpacing: -1,
            ),
          ),
        ],
      ),
    );
  }

  // Brand text logo
  static Widget getBrandText({double? fontSize, Color? color}) {
    return Text(
      'Tutora',
      style: TextStyle(
        fontSize: fontSize ?? 24,
        fontWeight: FontWeight.w800,
        color: color ?? AppTheme.primaryColor,
        letterSpacing: -0.5,
      ),
    );
  }

  // Combined logo with text
  static Widget getLogoWithText({double? size}) {
    final logoSize = size ?? 32.0;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        getSmallLogo(size: logoSize),
        const SizedBox(width: 8),
        getBrandText(fontSize: logoSize * 0.75),
      ],
    );
  }

  // Special method for generating app icon previews
  static Widget getAppIconPreview(
      {required double size, bool showLabel = true}) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            gradient: const RadialGradient(
              center: Alignment(-0.2, -0.2),
              radius: 1.1,
              colors: [
                Color(0xFF64B5FF), // Light blue center
                Color(0xFF2E9CFF), // Main blue
                Color(0xFF0B7BD8), // Dark blue edge
                Color(0xFF1565C0), // Even darker blue for depth
              ],
              stops: [0.0, 0.4, 0.8, 1.0],
            ),
            borderRadius: BorderRadius.circular(size * 0.22),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF2E9CFF).withValues(alpha: 0.4),
                blurRadius: size * 0.12,
                offset: Offset(0, size * 0.06),
              ),
              BoxShadow(
                color: const Color(0xFF0B7BD8).withValues(alpha: 0.2),
                blurRadius: size * 0.04,
                offset: Offset(0, size * 0.02),
              ),
            ],
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Background glow effect
              Container(
                width: size * 0.75,
                height: size * 0.75,
                decoration: BoxDecoration(
                  gradient: RadialGradient(
                    colors: [
                      Colors.white.withValues(alpha: 0.25),
                      Colors.transparent,
                    ],
                  ),
                  shape: BoxShape.circle,
                ),
              ),
              // Main design elements
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Education icon
                  Icon(
                    Icons.auto_stories_rounded,
                    size: size * 0.32,
                    color: Colors.white,
                  ),
                  SizedBox(height: size * 0.02),
                  // Tutora "T" branding
                  Container(
                    padding: EdgeInsets.symmetric(
                      horizontal: size * 0.08,
                      vertical: size * 0.02,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(size * 0.05),
                    ),
                    child: Text(
                      'T',
                      style: TextStyle(
                        fontSize: size * 0.2,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: -1,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        if (showLabel) ...[
          const SizedBox(height: 8),
          Text(
            '${size.toInt()}x${size.toInt()}',
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.grey,
            ),
          ),
        ],
      ],
    );
  }

  // Generate all standard app icon sizes
  static Widget getIconSizeGrid() {
    const iconSizes = [
      512.0, // App Store
      1024.0, // App Store (high-res)
      180.0, // iPhone App iOS 14+
      120.0, // iPhone App iOS 7-13
      152.0, // iPad Pro
      144.0, // Android xxxhdpi
      96.0, // Android xxhdpi
      72.0, // Android xhdpi
      48.0, // Android mdpi
    ];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          const Text(
            'Tutora App Icons',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Color(0xFF2E9CFF),
            ),
          ),
          const SizedBox(height: 20),
          Wrap(
            spacing: 20,
            runSpacing: 20,
            alignment: WrapAlignment.center,
            children: iconSizes.map((size) {
              final displaySize = size > 200 ? size * 0.3 : size * 0.8;
              return getAppIconPreview(size: displaySize);
            }).toList(),
          ),
        ],
      ),
    );
  }
}
