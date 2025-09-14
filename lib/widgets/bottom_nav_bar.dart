import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';

class BottomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;
  final bool isManager;

  const BottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
    this.isManager = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            spreadRadius: 0,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Expanded(
                  child: _buildNavItem(
                      context, 0, Icons.home_outlined, Icons.home, 'Home')),
              Expanded(
                  child: _buildNavItem(
                      context, 1, Icons.book_outlined, Icons.book, 'Modules')),
              Expanded(
                  child: _buildNavItem(context, 2, Icons.leaderboard_outlined,
                      Icons.leaderboard, 'Leaderboard')),
              Expanded(
                  child: _buildNavItem(context, 3, Icons.person_outline,
                      Icons.person, 'Profile')),
              if (isManager)
                Expanded(
                    child: _buildNavItem(
                        context,
                        4,
                        Icons.admin_panel_settings_outlined,
                        Icons.admin_panel_settings,
                        'Admin')),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(BuildContext context, int index, IconData outlinedIcon,
      IconData filledIcon, String label) {
    final bool isSelected = currentIndex == index;
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return InkWell(
      onTap: () => onTap(index),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: isSelected
            ? BoxDecoration(
                color: isDarkMode
                    ? Colors.grey.shade800.withValues(alpha: 0.3)
                    : AppTheme.primaryColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
              )
            : null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isSelected ? filledIcon : outlinedIcon,
              color: isSelected
                  ? AppTheme.primaryColor
                  : isDarkMode
                      ? AppTheme.darkTextSecondaryColor
                      : AppTheme.textSecondaryColor,
              size: 24,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                color: isSelected
                    ? AppTheme.primaryColor
                    : isDarkMode
                        ? AppTheme.darkTextSecondaryColor
                        : AppTheme.textSecondaryColor,
              ),
              textAlign: TextAlign.center,
              overflow: TextOverflow.ellipsis,
              maxLines: 1,
            ),
          ],
        ),
      ),
    );
  }
}
