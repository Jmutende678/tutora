import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';

enum ButtonVariant { primary, secondary, danger, success, outline, ghost }

enum ButtonSize { small, medium, large }

class EnhancedPrimaryButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? leadingIcon;
  final IconData? trailingIcon;
  final ButtonVariant variant;
  final ButtonSize size;
  final bool hasGlow;
  final bool hasHapticFeedback;

  const EnhancedPrimaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.isFullWidth = true,
    this.leadingIcon,
    this.trailingIcon,
    this.variant = ButtonVariant.primary,
    this.size = ButtonSize.medium,
    this.hasGlow = false,
    this.hasHapticFeedback = true,
  });

  @override
  State<EnhancedPrimaryButton> createState() => _EnhancedPrimaryButtonState();
}

class _EnhancedPrimaryButtonState extends State<EnhancedPrimaryButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _glowAnimation;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

    _glowAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleTapDown(TapDownDetails details) {
    if (widget.onPressed != null && !widget.isLoading) {
      setState(() => _isPressed = true);
      _controller.forward();

      if (widget.hasHapticFeedback) {
        // Add haptic feedback
        // HapticFeedback.lightImpact();
      }
    }
  }

  void _handleTapUp(TapUpDetails details) {
    _handleTapEnd();
  }

  void _handleTapCancel() {
    _handleTapEnd();
  }

  void _handleTapEnd() {
    if (mounted) {
      setState(() => _isPressed = false);
      _controller.reverse();
    }
  }

  ButtonStyle _getButtonStyle() {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    // Size configurations
    EdgeInsets padding;
    double height;
    double fontSize;
    double iconSize;

    switch (widget.size) {
      case ButtonSize.small:
        padding = const EdgeInsets.symmetric(horizontal: 16, vertical: 8);
        height = 36;
        fontSize = 14;
        iconSize = 16;
        break;
      case ButtonSize.medium:
        padding = const EdgeInsets.symmetric(horizontal: 20, vertical: 12);
        height = 48;
        fontSize = 16;
        iconSize = 20;
        break;
      case ButtonSize.large:
        padding = const EdgeInsets.symmetric(horizontal: 24, vertical: 16);
        height = 56;
        fontSize = 18;
        iconSize = 24;
        break;
    }

    // Color configurations based on variant
    Color backgroundColor;
    Color foregroundColor;
    Color? borderColor;
    List<BoxShadow>? shadows;

    switch (widget.variant) {
      case ButtonVariant.primary:
        backgroundColor = AppTheme.primaryColor;
        foregroundColor = Colors.white;
        if (widget.hasGlow) {
          shadows = [
            BoxShadow(
              color: AppTheme.primaryColor.withOpacity(0.4),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ];
        }
        break;
      case ButtonVariant.secondary:
        backgroundColor =
            isDark ? AppTheme.cardColorDark : AppTheme.cardColorLight;
        foregroundColor =
            isDark ? AppTheme.darkTextPrimaryColor : AppTheme.textPrimaryColor;
        borderColor =
            isDark ? AppTheme.borderColorDark : AppTheme.borderColorLight;
        break;
      case ButtonVariant.danger:
        backgroundColor = AppTheme.errorColor;
        foregroundColor = Colors.white;
        if (widget.hasGlow) {
          shadows = [
            BoxShadow(
              color: AppTheme.errorColor.withOpacity(0.4),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ];
        }
        break;
      case ButtonVariant.success:
        backgroundColor = AppTheme.successColor;
        foregroundColor = Colors.white;
        if (widget.hasGlow) {
          shadows = [
            BoxShadow(
              color: AppTheme.successColor.withOpacity(0.4),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ];
        }
        break;
      case ButtonVariant.outline:
        backgroundColor = Colors.transparent;
        foregroundColor = AppTheme.primaryColor;
        borderColor = AppTheme.primaryColor;
        break;
      case ButtonVariant.ghost:
        backgroundColor = Colors.transparent;
        foregroundColor =
            isDark ? AppTheme.darkTextPrimaryColor : AppTheme.textPrimaryColor;
        break;
    }

    return ElevatedButton.styleFrom(
      backgroundColor: backgroundColor,
      foregroundColor: foregroundColor,
      padding: padding,
      minimumSize: Size(widget.isFullWidth ? double.infinity : 0, height),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: borderColor != null
            ? BorderSide(color: borderColor, width: 1.5)
            : BorderSide.none,
      ),
      elevation: widget.variant == ButtonVariant.primary ? 2 : 0,
      shadowColor: shadows?.isNotEmpty == true ? shadows!.first.color : null,
      textStyle: TextStyle(
        fontSize: fontSize,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.5,
      ),
    );
  }

  Widget _buildButtonContent() {
    if (widget.isLoading) {
      return SizedBox(
        height: widget.size == ButtonSize.small
            ? 16
            : widget.size == ButtonSize.medium
                ? 20
                : 24,
        width: widget.size == ButtonSize.small
            ? 16
            : widget.size == ButtonSize.medium
                ? 20
                : 24,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(
            widget.variant == ButtonVariant.primary ||
                    widget.variant == ButtonVariant.danger ||
                    widget.variant == ButtonVariant.success
                ? Colors.white
                : AppTheme.primaryColor,
          ),
        ),
      );
    }

    List<Widget> children = [];

    if (widget.leadingIcon != null) {
      children.add(Icon(
        widget.leadingIcon,
        size: widget.size == ButtonSize.small
            ? 16
            : widget.size == ButtonSize.medium
                ? 20
                : 24,
      ));
      children.add(const SizedBox(width: 8));
    }

    children.add(
      Flexible(
        child: Text(
          widget.text,
          style: TextStyle(
            fontSize: widget.size == ButtonSize.small
                ? 14
                : widget.size == ButtonSize.medium
                    ? 16
                    : 18,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
          overflow: TextOverflow.ellipsis,
          textAlign: TextAlign.center,
        ),
      ),
    );

    if (widget.trailingIcon != null) {
      children.add(const SizedBox(width: 8));
      children.add(Icon(
        widget.trailingIcon,
        size: widget.size == ButtonSize.small
            ? 16
            : widget.size == ButtonSize.medium
                ? 20
                : 24,
      ));
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: children,
    );
  }

  @override
  Widget build(BuildContext context) {
    Widget button = AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Container(
            width: widget.isFullWidth ? double.infinity : null,
            decoration: widget.hasGlow
                ? BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: _getGlowColor()
                            .withOpacity(_glowAnimation.value * 0.3),
                        blurRadius: 12 + (_glowAnimation.value * 8),
                        offset: const Offset(0, 4),
                      ),
                    ],
                  )
                : null,
            child: ElevatedButton(
              onPressed: widget.isLoading ? null : widget.onPressed,
              style: _getButtonStyle(),
              child: _buildButtonContent(),
            ),
          ),
        );
      },
    );

    return GestureDetector(
      onTapDown: _handleTapDown,
      onTapUp: _handleTapUp,
      onTapCancel: _handleTapCancel,
      child: button,
    );
  }

  Color _getGlowColor() {
    switch (widget.variant) {
      case ButtonVariant.primary:
        return AppTheme.primaryColor;
      case ButtonVariant.danger:
        return AppTheme.errorColor;
      case ButtonVariant.success:
        return AppTheme.successColor;
      default:
        return AppTheme.primaryColor;
    }
  }
}

// Quick access variants
class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? icon;

  const PrimaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.isFullWidth = true,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return EnhancedPrimaryButton(
      text: text,
      onPressed: onPressed,
      isLoading: isLoading,
      isFullWidth: isFullWidth,
      leadingIcon: icon,
      variant: ButtonVariant.primary,
      hasGlow: true,
    );
  }
}

class SecondaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? icon;

  const SecondaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.isFullWidth = true,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return EnhancedPrimaryButton(
      text: text,
      onPressed: onPressed,
      isLoading: isLoading,
      isFullWidth: isFullWidth,
      leadingIcon: icon,
      variant: ButtonVariant.secondary,
    );
  }
}

class DangerButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? icon;

  const DangerButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.isFullWidth = true,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return EnhancedPrimaryButton(
      text: text,
      onPressed: onPressed,
      isLoading: isLoading,
      isFullWidth: isFullWidth,
      leadingIcon: icon,
      variant: ButtonVariant.danger,
      hasGlow: true,
    );
  }
}
