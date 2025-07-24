import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';

enum ErrorType {
  network,
  authentication,
  permission,
  validation,
  notFound,
  serverError,
  timeout,
  unknown
}

class EnhancedErrorState extends StatelessWidget {
  final ErrorType type;
  final String? customMessage;
  final String? customTitle;
  final VoidCallback? onRetry;
  final VoidCallback? onDismiss;
  final bool showIcon;
  final bool showRetryButton;
  final Widget? customAction;

  const EnhancedErrorState({
    super.key,
    required this.type,
    this.customMessage,
    this.customTitle,
    this.onRetry,
    this.onDismiss,
    this.showIcon = true,
    this.showRetryButton = true,
    this.customAction,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showIcon) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _getErrorColor().withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                _getErrorIcon(),
                size: 48,
                color: _getErrorColor(),
              ),
            ),
            const SizedBox(height: 16),
          ],
          Text(
            customTitle ?? _getDefaultTitle(),
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: isDark
                  ? AppTheme.darkTextPrimaryColor
                  : AppTheme.textPrimaryColor,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            customMessage ?? _getDefaultMessage(),
            style: TextStyle(
              fontSize: 16,
              color: isDark
                  ? AppTheme.darkTextSecondaryColor
                  : AppTheme.textSecondaryColor,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          if (customAction != null) ...[
            customAction!,
          ] else if (showRetryButton && onRetry != null) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (onDismiss != null) ...[
                  OutlinedButton(
                    onPressed: onDismiss,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: isDark
                          ? AppTheme.darkTextSecondaryColor
                          : AppTheme.textSecondaryColor,
                    ),
                    child: const Text('Dismiss'),
                  ),
                  const SizedBox(width: 12),
                ],
                ElevatedButton.icon(
                  onPressed: onRetry,
                  icon: const Icon(Icons.refresh),
                  label: const Text('Try Again'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _getErrorColor(),
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  String _getDefaultTitle() {
    switch (type) {
      case ErrorType.network:
        return 'Connection Problem';
      case ErrorType.authentication:
        return 'Authentication Required';
      case ErrorType.permission:
        return 'Access Denied';
      case ErrorType.validation:
        return 'Invalid Input';
      case ErrorType.notFound:
        return 'Not Found';
      case ErrorType.serverError:
        return 'Server Error';
      case ErrorType.timeout:
        return 'Request Timeout';
      case ErrorType.unknown:
        return 'Something Went Wrong';
    }
  }

  String _getDefaultMessage() {
    switch (type) {
      case ErrorType.network:
        return 'Please check your internet connection and try again.';
      case ErrorType.authentication:
        return 'Please log in to continue using the app.';
      case ErrorType.permission:
        return 'You don\'t have permission to access this resource.';
      case ErrorType.validation:
        return 'Please check your input and try again.';
      case ErrorType.notFound:
        return 'The requested resource could not be found.';
      case ErrorType.serverError:
        return 'Our servers are experiencing issues. Please try again later.';
      case ErrorType.timeout:
        return 'The request took too long to complete. Please try again.';
      case ErrorType.unknown:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  IconData _getErrorIcon() {
    switch (type) {
      case ErrorType.network:
        return Icons.wifi_off;
      case ErrorType.authentication:
        return Icons.lock;
      case ErrorType.permission:
        return Icons.block;
      case ErrorType.validation:
        return Icons.warning;
      case ErrorType.notFound:
        return Icons.search_off;
      case ErrorType.serverError:
        return Icons.server_error;
      case ErrorType.timeout:
        return Icons.access_time;
      case ErrorType.unknown:
        return Icons.error_outline;
    }
  }

  Color _getErrorColor() {
    switch (type) {
      case ErrorType.network:
        return Colors.orange;
      case ErrorType.authentication:
        return AppTheme.primaryColor;
      case ErrorType.permission:
        return AppTheme.errorColor;
      case ErrorType.validation:
        return AppTheme.warningColor;
      case ErrorType.notFound:
        return Colors.grey;
      case ErrorType.serverError:
        return AppTheme.errorColor;
      case ErrorType.timeout:
        return Colors.orange;
      case ErrorType.unknown:
        return AppTheme.errorColor;
    }
  }
}

// Error banner for inline errors
class ErrorBanner extends StatelessWidget {
  final String message;
  final ErrorType type;
  final VoidCallback? onDismiss;
  final bool dismissible;

  const ErrorBanner({
    super.key,
    required this.message,
    this.type = ErrorType.unknown,
    this.onDismiss,
    this.dismissible = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      margin: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: _getErrorColor().withOpacity(0.1),
        border: Border.all(
          color: _getErrorColor().withOpacity(0.3),
          width: 1,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(
            _getErrorIcon(),
            color: _getErrorColor(),
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: TextStyle(
                color: _getErrorColor(),
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          if (dismissible && onDismiss != null) ...[
            const SizedBox(width: 8),
            IconButton(
              onPressed: onDismiss,
              icon: Icon(
                Icons.close,
                color: _getErrorColor(),
                size: 18,
              ),
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(
                minWidth: 24,
                minHeight: 24,
              ),
            ),
          ],
        ],
      ),
    );
  }

  IconData _getErrorIcon() {
    switch (type) {
      case ErrorType.network:
        return Icons.wifi_off;
      case ErrorType.authentication:
        return Icons.lock;
      case ErrorType.permission:
        return Icons.block;
      case ErrorType.validation:
        return Icons.warning;
      case ErrorType.notFound:
        return Icons.search_off;
      case ErrorType.serverError:
        return Icons.error;
      case ErrorType.timeout:
        return Icons.access_time;
      case ErrorType.unknown:
        return Icons.error_outline;
    }
  }

  Color _getErrorColor() {
    switch (type) {
      case ErrorType.network:
        return Colors.orange;
      case ErrorType.authentication:
        return AppTheme.primaryColor;
      case ErrorType.permission:
        return AppTheme.errorColor;
      case ErrorType.validation:
        return AppTheme.warningColor;
      case ErrorType.notFound:
        return Colors.grey;
      case ErrorType.serverError:
        return AppTheme.errorColor;
      case ErrorType.timeout:
        return Colors.orange;
      case ErrorType.unknown:
        return AppTheme.errorColor;
    }
  }
}

// Error handler utility class
class ErrorHandler {
  static ErrorType getErrorType(dynamic error) {
    final errorString = error.toString().toLowerCase();

    if (errorString.contains('network') ||
        errorString.contains('socket') ||
        errorString.contains('connection')) {
      return ErrorType.network;
    }

    if (errorString.contains('auth') ||
        errorString.contains('unauthorized') ||
        errorString.contains('login')) {
      return ErrorType.authentication;
    }

    if (errorString.contains('permission') ||
        errorString.contains('forbidden') ||
        errorString.contains('access denied')) {
      return ErrorType.permission;
    }

    if (errorString.contains('validation') ||
        errorString.contains('invalid') ||
        errorString.contains('format')) {
      return ErrorType.validation;
    }

    if (errorString.contains('not found') || errorString.contains('404')) {
      return ErrorType.notFound;
    }

    if (errorString.contains('server') ||
        errorString.contains('500') ||
        errorString.contains('internal')) {
      return ErrorType.serverError;
    }

    if (errorString.contains('timeout') || errorString.contains('deadline')) {
      return ErrorType.timeout;
    }

    return ErrorType.unknown;
  }

  static String getFriendlyMessage(dynamic error) {
    final type = getErrorType(error);

    switch (type) {
      case ErrorType.network:
        return 'Please check your internet connection and try again.';
      case ErrorType.authentication:
        return 'Please log in to continue.';
      case ErrorType.permission:
        return 'You don\'t have permission to perform this action.';
      case ErrorType.validation:
        return 'Please check your input and try again.';
      case ErrorType.notFound:
        return 'The requested item could not be found.';
      case ErrorType.serverError:
        return 'Our servers are experiencing issues. Please try again later.';
      case ErrorType.timeout:
        return 'The request took too long. Please try again.';
      case ErrorType.unknown:
        return 'Something went wrong. Please try again.';
    }
  }

  static void showErrorSnackbar(BuildContext context, dynamic error) {
    final messenger = ScaffoldMessenger.of(context);
    final type = getErrorType(error);
    final message = getFriendlyMessage(error);

    messenger.showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              _getIconForType(type),
              color: Colors.white,
            ),
            const SizedBox(width: 8),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: _getColorForType(type),
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: 'Dismiss',
          textColor: Colors.white,
          onPressed: () => messenger.hideCurrentSnackBar(),
        ),
      ),
    );
  }

  static IconData _getIconForType(ErrorType type) {
    switch (type) {
      case ErrorType.network:
        return Icons.wifi_off;
      case ErrorType.authentication:
        return Icons.lock;
      case ErrorType.permission:
        return Icons.block;
      case ErrorType.validation:
        return Icons.warning;
      case ErrorType.notFound:
        return Icons.search_off;
      case ErrorType.serverError:
        return Icons.error;
      case ErrorType.timeout:
        return Icons.access_time;
      case ErrorType.unknown:
        return Icons.error_outline;
    }
  }

  static Color _getColorForType(ErrorType type) {
    switch (type) {
      case ErrorType.network:
        return Colors.orange;
      case ErrorType.authentication:
        return AppTheme.primaryColor;
      case ErrorType.permission:
        return AppTheme.errorColor;
      case ErrorType.validation:
        return AppTheme.warningColor;
      case ErrorType.notFound:
        return Colors.grey;
      case ErrorType.serverError:
        return AppTheme.errorColor;
      case ErrorType.timeout:
        return Colors.orange;
      case ErrorType.unknown:
        return AppTheme.errorColor;
    }
  }
}
