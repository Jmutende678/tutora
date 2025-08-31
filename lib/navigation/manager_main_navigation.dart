import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/reference_theme.dart';
import '../screens/manager/manager_dashboard_screen.dart';
import '../screens/manager/manager_modules_screen.dart';
import '../screens/manager/manager_users_screen.dart';
import '../screens/manager/manager_analytics_screen.dart';
import '../screens/manager/manager_settings_screen.dart';
import '../screens/manager/module_builder/module_builder_flow.dart';

class ManagerMainNavigationScreen extends StatefulWidget {
  const ManagerMainNavigationScreen({super.key});

  @override
  State<ManagerMainNavigationScreen> createState() =>
      _ManagerMainNavigationScreenState();
}

class _ManagerMainNavigationScreenState
    extends State<ManagerMainNavigationScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const ManagerDashboardScreen(),
    const ModuleBuilderFlow(),
    const ManagerModulesScreen(),
    const ManagerUsersScreen(),
    const ManagerAnalyticsScreen(),
    const ManagerSettingsScreen(),
  ];

  final List<NavigationItem> _navItems = [
    NavigationItem(
      icon: Icons.dashboard_outlined,
      activeIcon: Icons.dashboard,
      label: 'Dashboard',
    ),
    NavigationItem(
      icon: Icons.auto_awesome_outlined,
      activeIcon: Icons.auto_awesome,
      label: 'AI Builder',
    ),
    NavigationItem(
      icon: Icons.library_books_outlined,
      activeIcon: Icons.library_books,
      label: 'Modules',
    ),
    NavigationItem(
      icon: Icons.people_outline,
      activeIcon: Icons.people,
      label: 'Users',
    ),
    NavigationItem(
      icon: Icons.analytics_outlined,
      activeIcon: Icons.analytics,
      label: 'Analytics',
    ),
    NavigationItem(
      icon: Icons.settings_outlined,
      activeIcon: Icons.settings,
      label: 'Settings',
    ),
  ];

  void _onItemTapped(int index) {
    if (_selectedIndex != index) {
      HapticFeedback.lightImpact();
      setState(() {
        _selectedIndex = index;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: isDark
              ? ReferenceTheme.cardBackgroundDark
              : ReferenceTheme.backgroundLight,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(
                horizontal: ReferenceTheme.md, vertical: ReferenceTheme.sm),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: _navItems.asMap().entries.map((entry) {
                final index = entry.key;
                final item = entry.value;
                final isSelected = _selectedIndex == index;

                return Expanded(
                  child: GestureDetector(
                    onTap: () => _onItemTapped(index),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: ReferenceTheme.xs,
                        vertical: ReferenceTheme.sm,
                      ),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? ReferenceTheme.primaryBlue.withValues(alpha: 0.1)
                            : Colors.transparent,
                        borderRadius:
                            BorderRadius.circular(ReferenceTheme.radiusSmall),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            isSelected ? item.activeIcon : item.icon,
                            color: isSelected
                                ? ReferenceTheme.primaryBlue
                                : ReferenceTheme.textSecondary,
                            size: 24,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            item.label,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: isSelected
                                  ? FontWeight.w600
                                  : FontWeight.w400,
                              color: isSelected
                                  ? ReferenceTheme.primaryBlue
                                  : ReferenceTheme.textSecondary,
                            ),
                            textAlign: TextAlign.center,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ),
      ),
    );
  }
}

class NavigationItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;

  NavigationItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
  });
}
