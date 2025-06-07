import 'package:flutter/material.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/theme/app_theme.dart';

class ModuleCard extends StatelessWidget {
  final ModuleModel module;
  final VoidCallback onTap;
  final bool isCompact;
  
  const ModuleCard({
    super.key,
    required this.module,
    required this.onTap,
    this.isCompact = false,
  });

  Color _getStatusColor() {
    switch (module.status) {
      case ModuleStatus.notStarted:
        return AppTheme.notStartedColor;
      case ModuleStatus.inProgress:
        return AppTheme.inProgressColor;
      case ModuleStatus.completed:
        return AppTheme.completedColor;
    }
  }

  String _getStatusText() {
    switch (module.status) {
      case ModuleStatus.notStarted:
        return 'Not Started';
      case ModuleStatus.inProgress:
        return 'In Progress';
      case ModuleStatus.completed:
        return 'Completed';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: isCompact ? _buildCompactCard(context) : _buildFullCard(context),
      ),
    );
  }

  Widget _buildFullCard(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with title and status
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Module icon or image
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: _getStatusColor().withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Icon(
                    _getCategoryIcon(),
                    color: _getStatusColor(),
                    size: 32,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              
              // Title and status
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      module.title,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: isDarkMode 
                            ? AppTheme.darkTextPrimaryColor 
                            : AppTheme.textPrimaryColor,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                    
                    // Category and time row
                    Row(
                      children: [
                        _buildChip(module.category, Icons.category_outlined),
                        const SizedBox(width: 8),
                        _buildChip('${module.estimatedMinutes} min', Icons.timer_outlined),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Description
          Text(
            module.description,
            style: TextStyle(
              fontSize: 14,
              color: isDarkMode 
                  ? AppTheme.darkTextSecondaryColor 
                  : AppTheme.textSecondaryColor,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          
          const SizedBox(height: 16),
          
          // Points and progress
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Points badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.star_rounded,
                      color: AppTheme.primaryColor,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${module.pointsValue} pts',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                  ],
                ),
              ),
              
              // Status badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _getStatusColor().withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Icon(
                      _getStatusIcon(),
                      color: _getStatusColor(),
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _getStatusText(),
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: _getStatusColor(),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          
          // Progress bar (only show for in progress modules)
          if (module.status == ModuleStatus.inProgress) ...[
            const SizedBox(height: 16),
            LinearProgressIndicator(
              value: module.progress,
              backgroundColor: isDarkMode 
                  ? Colors.grey.shade800 
                  : Colors.grey.shade200,
              valueColor: AlwaysStoppedAnimation<Color>(_getStatusColor()),
              borderRadius: BorderRadius.circular(4),
            ),
            const SizedBox(height: 8),
            Text(
              '${(module.progress * 100).toInt()}% Complete',
              style: TextStyle(
                fontSize: 13,
                color: isDarkMode 
                    ? AppTheme.darkTextSecondaryColor 
                    : AppTheme.textSecondaryColor,
              ),
              textAlign: TextAlign.right,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildCompactCard(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: Row(
        children: [
          // Module icon
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: _getStatusColor().withOpacity(0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: Icon(
                _getCategoryIcon(),
                color: _getStatusColor(),
                size: 28,
              ),
            ),
          ),
          const SizedBox(width: 12),
          
          // Title and status
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  module.title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: isDarkMode 
                        ? AppTheme.darkTextPrimaryColor 
                        : AppTheme.textPrimaryColor,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                
                // Category and time
                Text(
                  '${module.category} · ${module.estimatedMinutes} min',
                  style: TextStyle(
                    fontSize: 13,
                    color: isDarkMode 
                        ? AppTheme.darkTextSecondaryColor 
                        : AppTheme.textSecondaryColor,
                  ),
                ),
                
                // Progress bar (only for in progress)
                if (module.status == ModuleStatus.inProgress) ...[
                  const SizedBox(height: 8),
                  LinearProgressIndicator(
                    value: module.progress,
                    backgroundColor: isDarkMode 
                        ? Colors.grey.shade800 
                        : Colors.grey.shade200,
                    valueColor: AlwaysStoppedAnimation<Color>(_getStatusColor()),
                    borderRadius: BorderRadius.circular(4),
                    minHeight: 4,
                  ),
                ],
              ],
            ),
          ),
          
          const SizedBox(width: 8),
          
          // Status indicator
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: _getStatusColor().withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  _getStatusIcon(),
                  color: _getStatusColor(),
                  size: 14,
                ),
                const SizedBox(width: 4),
                Text(
                  _getStatusText(),
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: _getStatusColor(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChip(String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: Colors.grey.shade600,
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey.shade600,
            ),
          ),
        ],
      ),
    );
  }

  IconData _getStatusIcon() {
    switch (module.status) {
      case ModuleStatus.notStarted:
        return Icons.play_circle_outline;
      case ModuleStatus.inProgress:
        return Icons.directions_run;
      case ModuleStatus.completed:
        return Icons.check_circle_outline;
    }
  }

  IconData _getCategoryIcon() {
    switch (module.category.toLowerCase()) {
      case 'safety':
        return Icons.health_and_safety_outlined;
      case 'service':
        return Icons.support_agent_outlined;
      case 'compliance':
        return Icons.gavel_outlined;
      case 'soft skills':
        return Icons.people_outlined;
      case 'productivity':
        return Icons.trending_up_outlined;
      default:
        return Icons.menu_book_outlined;
    }
  }
} 