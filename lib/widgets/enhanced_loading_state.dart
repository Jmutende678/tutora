import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';

enum LoadingType {
  data,
  processing,
  uploading,
  downloading,
  authenticating,
  saving,
  generating
}

class EnhancedLoadingState extends StatefulWidget {
  final LoadingType type;
  final String? customMessage;
  final double? progress;
  final bool cancellable;
  final VoidCallback? onCancel;
  final bool showPercentage;
  final Color? accentColor;
  final double size;

  const EnhancedLoadingState({
    super.key,
    this.type = LoadingType.data,
    this.customMessage,
    this.progress,
    this.cancellable = false,
    this.onCancel,
    this.showPercentage = false,
    this.accentColor,
    this.size = 48.0,
  });

  @override
  State<EnhancedLoadingState> createState() => _EnhancedLoadingStateState();
}

class _EnhancedLoadingStateState extends State<EnhancedLoadingState>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _rotationController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();

    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _rotationController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    _pulseAnimation = Tween<double>(
      begin: 0.8,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));

    _rotationAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _rotationController,
      curve: Curves.linear,
    ));

    _pulseController.repeat(reverse: true);
    _rotationController.repeat();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _rotationController.dispose();
    super.dispose();
  }

  String _getDefaultMessage() {
    switch (widget.type) {
      case LoadingType.data:
        return 'Loading data...';
      case LoadingType.processing:
        return 'Processing...';
      case LoadingType.uploading:
        return 'Uploading file...';
      case LoadingType.downloading:
        return 'Downloading...';
      case LoadingType.authenticating:
        return 'Authenticating...';
      case LoadingType.saving:
        return 'Saving changes...';
      case LoadingType.generating:
        return 'Generating content...';
    }
  }

  IconData _getLoadingIcon() {
    switch (widget.type) {
      case LoadingType.data:
        return Icons.refresh;
      case LoadingType.processing:
        return Icons.settings;
      case LoadingType.uploading:
        return Icons.cloud_upload;
      case LoadingType.downloading:
        return Icons.cloud_download;
      case LoadingType.authenticating:
        return Icons.security;
      case LoadingType.saving:
        return Icons.save;
      case LoadingType.generating:
        return Icons.auto_awesome;
    }
  }

  Color _getAccentColor() {
    if (widget.accentColor != null) {
      return widget.accentColor!;
    }

    switch (widget.type) {
      case LoadingType.data:
        return AppTheme.primaryColor;
      case LoadingType.processing:
        return AppTheme.warningColor;
      case LoadingType.uploading:
        return AppTheme.infoColor;
      case LoadingType.downloading:
        return AppTheme.successColor;
      case LoadingType.authenticating:
        return AppTheme.primaryColor;
      case LoadingType.saving:
        return AppTheme.successColor;
      case LoadingType.generating:
        return Colors.purple;
    }
  }

  Widget _buildProgressIndicator() {
    final color = _getAccentColor();

    if (widget.progress != null) {
      // Determinate progress
      return SizedBox(
        height: widget.size,
        width: widget.size,
        child: Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              height: widget.size,
              width: widget.size,
              child: CircularProgressIndicator(
                value: widget.progress! / 100,
                strokeWidth: 4,
                backgroundColor: color.withOpacity(0.2),
                valueColor: AlwaysStoppedAnimation<Color>(color),
              ),
            ),
            if (widget.showPercentage)
              Text(
                '${widget.progress!.toInt()}%',
                style: TextStyle(
                  fontSize: widget.size * 0.25,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
          ],
        ),
      );
    } else {
      // Indeterminate progress with custom animation
      return AnimatedBuilder(
        animation: _rotationController,
        builder: (context, child) {
          return Transform.rotate(
            angle: _rotationAnimation.value * 2 * 3.14159,
            child: Container(
              height: widget.size,
              width: widget.size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: SweepGradient(
                  colors: [
                    color.withOpacity(0.1),
                    color,
                    color.withOpacity(0.1),
                  ],
                  stops: const [0.0, 0.5, 1.0],
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(4.0),
                child: Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Theme.of(context).scaffoldBackgroundColor,
                  ),
                  child: Icon(
                    _getLoadingIcon(),
                    color: color,
                    size: widget.size * 0.4,
                  ),
                ),
              ),
            ),
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return AnimatedBuilder(
      animation: _pulseAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: widget.progress == null ? _pulseAnimation.value : 1.0,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildProgressIndicator(),
              const SizedBox(height: 16),
              Text(
                widget.customMessage ?? _getDefaultMessage(),
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: isDark
                      ? AppTheme.darkTextSecondaryColor
                      : AppTheme.textSecondaryColor,
                ),
                textAlign: TextAlign.center,
              ),
              if (widget.progress != null && !widget.showPercentage) ...[
                const SizedBox(height: 8),
                Text(
                  '${widget.progress!.toInt()}% complete',
                  style: TextStyle(
                    fontSize: 14,
                    color: _getAccentColor(),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
              if (widget.cancellable && widget.onCancel != null) ...[
                const SizedBox(height: 16),
                TextButton(
                  onPressed: widget.onCancel,
                  style: TextButton.styleFrom(
                    foregroundColor: AppTheme.errorColor,
                  ),
                  child: const Text('Cancel'),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}

// Overlay loading state for full-screen operations
class LoadingOverlay extends StatelessWidget {
  final Widget child;
  final bool isLoading;
  final LoadingType type;
  final String? message;
  final double? progress;
  final bool cancellable;
  final VoidCallback? onCancel;

  const LoadingOverlay({
    super.key,
    required this.child,
    required this.isLoading,
    this.type = LoadingType.data,
    this.message,
    this.progress,
    this.cancellable = false,
    this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Container(
            color: Colors.black.withOpacity(0.7),
            child: Center(
              child: Container(
                padding: const EdgeInsets.all(32),
                margin: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: EnhancedLoadingState(
                  type: type,
                  customMessage: message,
                  progress: progress,
                  cancellable: cancellable,
                  onCancel: onCancel,
                  showPercentage: progress != null,
                ),
              ),
            ),
          ),
      ],
    );
  }
}

// Inline loading state for smaller components
class InlineLoadingState extends StatelessWidget {
  final LoadingType type;
  final String? message;
  final double size;
  final Color? color;

  const InlineLoadingState({
    super.key,
    this.type = LoadingType.data,
    this.message,
    this.size = 16.0,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? AppTheme.primaryColor;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          height: size,
          width: size,
          child: CircularProgressIndicator(
            strokeWidth: 2,
            valueColor: AlwaysStoppedAnimation<Color>(effectiveColor),
          ),
        ),
        if (message != null) ...[
          const SizedBox(width: 8),
          Text(
            message!,
            style: TextStyle(
              fontSize: size * 0.8,
              color: effectiveColor,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ],
    );
  }
}

// Shimmer loading for content placeholders
class ShimmerLoading extends StatefulWidget {
  final Widget child;
  final bool isLoading;
  final Color? baseColor;
  final Color? highlightColor;

  const ShimmerLoading({
    super.key,
    required this.child,
    required this.isLoading,
    this.baseColor,
    this.highlightColor,
  });

  @override
  State<ShimmerLoading> createState() => _ShimmerLoadingState();
}

class _ShimmerLoadingState extends State<ShimmerLoading>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _animation = Tween<double>(
      begin: -1.0,
      end: 2.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    if (widget.isLoading) {
      _controller.repeat();
    }
  }

  @override
  void didUpdateWidget(ShimmerLoading oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isLoading) {
      _controller.repeat();
    } else {
      _controller.stop();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.isLoading) {
      return widget.child;
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final baseColor =
        widget.baseColor ?? (isDark ? Colors.grey[800]! : Colors.grey[300]!);
    final highlightColor = widget.highlightColor ??
        (isDark ? Colors.grey[700]! : Colors.grey[100]!);

    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                baseColor,
                highlightColor,
                baseColor,
              ],
              stops: [
                _animation.value - 0.3,
                _animation.value,
                _animation.value + 0.3,
              ],
            ),
          ),
          child: widget.child,
        );
      },
    );
  }
}
