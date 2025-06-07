import 'package:flutter/material.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/screens/quiz_screen.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/widgets/primary_button.dart';

class ModuleDetailsScreen extends StatelessWidget {
  final ModuleModel module;
  
  const ModuleDetailsScreen({
    super.key,
    required this.module,
  });

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App bar with module icon/image
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                color: _getModuleColor().withOpacity(0.1),
                child: Center(
                  child: Icon(
                    _getCategoryIcon(),
                    size: 80,
                    color: _getModuleColor(),
                  ),
                ),
              ),
              title: Text(
                module.title,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              titlePadding: const EdgeInsets.only(left: 72, bottom: 16, right: 16),
              expandedTitleScale: 1.0,
            ),
          ),
          
          // Module content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Status badge
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: _getModuleColor().withOpacity(0.1),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              _getStatusIcon(),
                              color: _getModuleColor(),
                              size: 16,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              _getStatusText(),
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: _getModuleColor(),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.timer_outlined,
                              color: AppTheme.primaryColor,
                              size: 16,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              '${module.estimatedMinutes} minutes',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.primaryColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Description
                  Text(
                    'Description',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isDarkMode
                          ? AppTheme.darkTextPrimaryColor
                          : AppTheme.textPrimaryColor,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    module.description,
                    style: TextStyle(
                      fontSize: 16,
                      color: isDarkMode
                          ? AppTheme.darkTextSecondaryColor
                          : AppTheme.textSecondaryColor,
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Module content sections
                  Text(
                    'Module Content',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isDarkMode
                          ? AppTheme.darkTextPrimaryColor
                          : AppTheme.textPrimaryColor,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Creating mock sections for demonstration
                  ..._buildModuleSections(context),
                  
                  const SizedBox(height: 24),
                  
                  // Points value
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDarkMode
                          ? Colors.grey.shade800.withOpacity(0.3)
                          : Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.star_rounded,
                            color: AppTheme.primaryColor,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Points for completion',
                              style: TextStyle(
                                fontSize: 14,
                                color: isDarkMode
                                    ? AppTheme.darkTextSecondaryColor
                                    : AppTheme.textSecondaryColor,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${module.pointsValue} points',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: isDarkMode
                                    ? AppTheme.darkTextPrimaryColor
                                    : AppTheme.textPrimaryColor,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Start/Continue button
                  PrimaryButton(
                    text: _getActionButtonText(),
                    icon: _getActionButtonIcon(),
                    onPressed: () {
                      // Navigate to quiz or first section
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => QuizScreen(module: module),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  List<Widget> _buildModuleSections(BuildContext context) {
    // This is just dummy data, in a real app these would come from the module data
    final sectionTitles = [
      'Introduction',
      'Key Concepts',
      'Best Practices',
      'Case Studies',
      'Assessment Quiz',
    ];
    
    final sectionIcons = [
      Icons.play_circle_outline,
      Icons.lightbulb_outline,
      Icons.check_circle_outline,
      Icons.cases_outlined,
      Icons.quiz_outlined,
    ];
    
    final sectionCompletions = [
      true,
      module.status == ModuleStatus.inProgress || module.status == ModuleStatus.completed,
      module.status == ModuleStatus.inProgress && module.progress > 0.5,
      module.status == ModuleStatus.completed,
      module.status == ModuleStatus.completed,
    ];
    
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return List.generate(sectionTitles.length, (index) {
      final isCompleted = sectionCompletions[index];
      
      return Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: isDarkMode ? AppTheme.darkSurfaceColor : Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              offset: const Offset(0, 2),
              blurRadius: 5,
            ),
          ],
        ),
        child: ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: isCompleted
                  ? AppTheme.completedColor.withOpacity(0.1)
                  : isDarkMode
                      ? Colors.grey.shade800.withOpacity(0.5)
                      : Colors.grey.shade100,
              shape: BoxShape.circle,
            ),
            child: Icon(
              sectionIcons[index],
              color: isCompleted ? AppTheme.completedColor : Colors.grey,
              size: 24,
            ),
          ),
          title: Text(
            sectionTitles[index],
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: isDarkMode
                  ? AppTheme.darkTextPrimaryColor
                  : AppTheme.textPrimaryColor,
            ),
          ),
          subtitle: Text(
            isCompleted ? 'Completed' : 'Not started',
            style: TextStyle(
              fontSize: 12,
              color: isCompleted
                  ? AppTheme.completedColor
                  : isDarkMode
                      ? AppTheme.darkTextSecondaryColor
                      : AppTheme.textSecondaryColor,
            ),
          ),
          trailing: Icon(
            isCompleted ? Icons.check_circle : Icons.arrow_forward_ios,
            color: isCompleted ? AppTheme.completedColor : Colors.grey,
            size: isCompleted ? 20 : 16,
          ),
          onTap: () {
            // Navigate to section content or quiz
            if (index == sectionTitles.length - 1) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => QuizScreen(module: module),
                ),
              );
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Opening ${sectionTitles[index]}'),
                  duration: const Duration(seconds: 1),
                ),
              );
            }
          },
        ),
      );
    });
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
  
  Color _getModuleColor() {
    switch (module.status) {
      case ModuleStatus.notStarted:
        return AppTheme.notStartedColor;
      case ModuleStatus.inProgress:
        return AppTheme.inProgressColor;
      case ModuleStatus.completed:
        return AppTheme.completedColor;
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
  
  String _getActionButtonText() {
    switch (module.status) {
      case ModuleStatus.notStarted:
        return 'Start Module';
      case ModuleStatus.inProgress:
        return 'Continue Module';
      case ModuleStatus.completed:
        return 'Review Module';
    }
  }
  
  IconData _getActionButtonIcon() {
    switch (module.status) {
      case ModuleStatus.notStarted:
        return Icons.play_arrow;
      case ModuleStatus.inProgress:
        return Icons.play_arrow;
      case ModuleStatus.completed:
        return Icons.refresh;
    }
  }
} 