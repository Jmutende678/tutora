import 'package:flutter/material.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/theme/app_theme.dart';

class ModuleCard extends StatelessWidget {
  final ModuleModel module;
  final VoidCallback onTap;

  const ModuleCard({
    super.key,
    required this.module,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      height: 240, // Increased from 200 to 240
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: GestureDetector(
          onTap: onTap,
          child: Column(
            children: [
              // Image section - 140px (more space for image)
              Container(
                height: 140,
                width: double.infinity,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      _getCategoryColor(module.category).withValues(alpha: 0.3),
                      _getCategoryColor(module.category).withValues(alpha: 0.1),
                    ],
                  ),
                ),
                child: Stack(
                  children: [
                    ClipRRect(
                      child: Image.network(
                        _getCategoryImageUrl(module.category),
                        width: double.infinity,
                        height: 140,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: _getCategoryColor(module.category)
                                .withValues(alpha: 0.2),
                            child: Icon(
                              _getCategoryIcon(module.category),
                              size: 30,
                              color: _getCategoryColor(module.category),
                            ),
                          );
                        },
                      ),
                    ),
                    Container(
                      height: 140,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.3),
                          ],
                        ),
                      ),
                    ),
                    if (module.status != ModuleStatus.notStarted)
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: _getStatusColor(module.status),
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.2),
                                blurRadius: 2,
                                offset: const Offset(0, 1),
                              ),
                            ],
                          ),
                          child: Text(
                            _getStatusText(module.status),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),

              // Progress bar section - Full width between image and content
              if (module.status == ModuleStatus.inProgress &&
                  module.progress > 0)
                Container(
                  height: 6, // Height for the progress bar
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: isDarkMode ? Colors.grey[700] : Colors.grey[300],
                  ),
                  child: FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: module.progress,
                    child: Container(
                      decoration: BoxDecoration(
                        color: _getCategoryColor(module.category),
                      ),
                    ),
                  ),
                ),

              // Content section - Flexible to fit remaining space
              Expanded(
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Title section
                      Flexible(
                        flex: 2,
                        child: Text(
                          module.title,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: isDarkMode ? Colors.white : Colors.grey[800],
                            height: 1.1,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),

                      const SizedBox(height: 4),

                      // Description section
                      Flexible(
                        flex: 2,
                        child: Text(
                          module.description,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 11,
                            color: isDarkMode
                                ? Colors.grey[400]
                                : Colors.grey[600],
                            height: 1.2,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),

                      const SizedBox(height: 4),

                      // Status section
                      if (module.status == ModuleStatus.inProgress &&
                          module.progress > 0)
                        // Show progress percentage
                        Text(
                          '${(module.progress * 100).toInt()}% Complete',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: _getCategoryColor(module.category),
                          ),
                          textAlign: TextAlign.center,
                        )
                      else
                        // Show status for other states
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              _getStatusIcon(module.status),
                              size: 12,
                              color: _getStatusColor(module.status),
                            ),
                            const SizedBox(width: 4),
                            Flexible(
                              child: Text(
                                _getStatusText(module.status),
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w600,
                                  color: _getStatusColor(module.status),
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getCategoryImageUrl(String category) {
    switch (category.toLowerCase()) {
      case 'safety':
        return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop';
      case 'service':
        return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop';
      case 'compliance':
        return 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop';
      case 'leadership':
        return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop';
      case 'technology':
        return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1553028826-f4804a6dfd3f?w=400&h=250&fit=crop';
    }
  }

  Color _getCategoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'safety':
        return const Color(0xFFE53E3E);
      case 'service':
        return const Color(0xFF38A169);
      case 'compliance':
        return const Color(0xFF3182CE);
      case 'leadership':
        return const Color(0xFF805AD5);
      case 'technology':
        return const Color(0xFFD69E2E);
      default:
        return AppTheme.primaryColor;
    }
  }

  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'safety':
        return Icons.security;
      case 'service':
        return Icons.support_agent;
      case 'compliance':
        return Icons.rule;
      case 'leadership':
        return Icons.groups;
      case 'technology':
        return Icons.computer;
      default:
        return Icons.school;
    }
  }

  Color _getStatusColor(ModuleStatus status) {
    switch (status) {
      case ModuleStatus.completed:
        return const Color(0xFF38A169);
      case ModuleStatus.inProgress:
        return const Color(0xFFD69E2E);
      case ModuleStatus.notStarted:
        return const Color(0xFF718096);
    }
  }

  IconData _getStatusIcon(ModuleStatus status) {
    switch (status) {
      case ModuleStatus.completed:
        return Icons.check_circle;
      case ModuleStatus.inProgress:
        return Icons.play_circle;
      case ModuleStatus.notStarted:
        return Icons.circle_outlined;
    }
  }

  String _getStatusText(ModuleStatus status) {
    switch (status) {
      case ModuleStatus.completed:
        return 'Completed';
      case ModuleStatus.inProgress:
        return 'In Progress';
      case ModuleStatus.notStarted:
        return 'Not Started';
    }
  }
}
