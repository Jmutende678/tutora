import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/models/user_model.dart';
import 'package:tutora/screens/leaderboard_screen.dart';
import 'package:tutora/screens/module_details_screen.dart';
import 'package:tutora/screens/module_list_screen.dart';
import 'package:tutora/screens/profile_screen.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/widgets/bottom_nav_bar.dart';
import 'package:tutora/widgets/module_card.dart';
import 'package:tutora/utils/color_extensions.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  late UserModel _user;
  late List<ModuleModel> _modules;

  @override
  void initState() {
    super.initState();
    _user = UserModel.dummyUser();
    _modules = ModuleModel.dummyModules();
  }

  void _onNavItemTapped(int index) {
    if (index == _currentIndex) return;

    if (index == 0) {
      // We're already on home
      setState(() {
        _currentIndex = index;
      });
    } else {
      // Navigate to other screens
      Widget screen;

      switch (index) {
        case 1:
          screen = const ModuleListScreen();
          break;
        case 2:
          screen = const LeaderboardScreen();
          break;
        case 3:
          screen = const ProfileScreen();
          break;
        case 4:
          // Admin dashboard was deleted, show a message instead
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Admin dashboard is currently unavailable'),
              backgroundColor: AppTheme.warningColor,
            ),
          );
          return;
        default:
          return;
      }

      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => screen),
      ).then((_) {
        setState(() {
          _currentIndex = 0; // Reset to home when returning
        });
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final currentDate = DateFormat('EEEE, MMMM d').format(DateTime.now());

    // Get active modules (in progress)
    final activeModules =
        _modules.where((m) => m.status == ModuleStatus.inProgress).toList();
    // Get modules that are not started
    final notStartedModules =
        _modules.where((m) => m.status == ModuleStatus.notStarted).toList();

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome header section
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: isDarkMode ? AppTheme.darkSurfaceColor : Colors.white,
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(20),
                    bottomRight: Radius.circular(20),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withAlphaValue(0.05),
                      offset: const Offset(0, 2),
                      blurRadius: 10,
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Hi, ${_user.name.split(' ')[0]}',
                              style: TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: isDarkMode
                                    ? AppTheme.darkTextPrimaryColor
                                    : AppTheme.textPrimaryColor,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              currentDate,
                              style: TextStyle(
                                fontSize: 16,
                                color: isDarkMode
                                    ? AppTheme.darkTextSecondaryColor
                                    : AppTheme.textSecondaryColor,
                              ),
                            ),
                          ],
                        ),

                        // Points circle
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: isDarkMode
                                ? AppTheme.primaryColor.withAlphaValue(0.2)
                                : AppTheme.primaryColor.withAlphaValue(0.1),
                            border: Border.all(
                              color: AppTheme.primaryColor,
                              width: 2,
                            ),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                _user.points.toString(),
                                style: const TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.primaryColor,
                                ),
                              ),
                              const Text(
                                'POINTS',
                                style: TextStyle(
                                  fontSize: 10,
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

                    // Quick access cards
                    GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 3,
                      crossAxisSpacing: 16,
                      childAspectRatio: 1.1,
                      children: [
                        _buildQuickAccessCard(
                          context,
                          Icons.book_outlined,
                          'Modules',
                          () => _onNavItemTapped(1),
                        ),
                        _buildQuickAccessCard(
                          context,
                          Icons.leaderboard_outlined,
                          'Leaderboard',
                          () => _onNavItemTapped(2),
                        ),
                        _buildQuickAccessCard(
                          context,
                          Icons.person_outline,
                          'Profile',
                          () => _onNavItemTapped(3),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Continue learning section
              if (activeModules.isNotEmpty) ...[
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Continue Learning',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: isDarkMode
                              ? AppTheme.darkTextPrimaryColor
                              : AppTheme.textPrimaryColor,
                        ),
                      ),
                      TextButton(
                        onPressed: () => _onNavItemTapped(1),
                        child: const Text(
                          'See All',
                          style: TextStyle(
                            color: AppTheme.primaryColor,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: ModuleCard(
                    module: activeModules.first,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              ModuleDetailsScreen(module: activeModules.first),
                        ),
                      );
                    },
                  ),
                ),
              ],

              const SizedBox(height: 24),

              // Recommended modules section
              if (notStartedModules.isNotEmpty) ...[
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Text(
                    'Recommended for You',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: isDarkMode
                          ? AppTheme.darkTextPrimaryColor
                          : AppTheme.textPrimaryColor,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  height: 230,
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    scrollDirection: Axis.horizontal,
                    itemCount: notStartedModules.length,
                    itemBuilder: (context, index) {
                      final module = notStartedModules[index];
                      return SizedBox(
                        width: 280,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          child: Card(
                            elevation: 2,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: InkWell(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        ModuleDetailsScreen(module: module),
                                  ),
                                );
                              },
                              borderRadius: BorderRadius.circular(12),
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // Category icon
                                    Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: AppTheme.primaryColor
                                            .withAlphaValue(0.1),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Icon(
                                        _getCategoryIcon(module.category),
                                        color: AppTheme.primaryColor,
                                      ),
                                    ),
                                    const SizedBox(height: 16),

                                    // Title
                                    Text(
                                      module.title,
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: isDarkMode
                                            ? AppTheme.darkTextPrimaryColor
                                            : AppTheme.textPrimaryColor,
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 8),

                                    // Description
                                    Text(
                                      module.description,
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: isDarkMode
                                            ? AppTheme.darkTextSecondaryColor
                                            : AppTheme.textSecondaryColor,
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const Spacer(),

                                    // Time and points
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          '${module.estimatedMinutes} min',
                                          style: TextStyle(
                                            fontSize: 13,
                                            color: isDarkMode
                                                ? AppTheme
                                                    .darkTextSecondaryColor
                                                : AppTheme.textSecondaryColor,
                                          ),
                                        ),
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
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],

              const SizedBox(height: 24),

              // Stats section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Text(
                  'Your Progress',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: isDarkMode
                        ? AppTheme.darkTextPrimaryColor
                        : AppTheme.textPrimaryColor,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        context,
                        Icons.task_alt,
                        '${_user.completedModules}',
                        'Modules\nCompleted',
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildStatCard(
                        context,
                        Icons.local_fire_department,
                        '${_user.currentStreak}',
                        'Day\nStreak',
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 100), // Extra space for bottom nav
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavBar(
        currentIndex: _currentIndex,
        onTap: _onNavItemTapped,
        isManager: _user.isManager,
      ),
    );
  }

  Widget _buildQuickAccessCard(
      BuildContext context, IconData icon, String label, VoidCallback onTap) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        decoration: BoxDecoration(
          color: isDarkMode
              ? Colors.grey.shade800.withAlphaValue(0.3)
              : Colors.grey.shade100,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDarkMode
                    ? AppTheme.primaryColor.withAlphaValue(0.2)
                    : AppTheme.primaryColor.withAlphaValue(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: AppTheme.primaryColor,
                size: 24,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: isDarkMode
                    ? AppTheme.darkTextPrimaryColor
                    : AppTheme.textPrimaryColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(
      BuildContext context, IconData icon, String value, String label) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.darkSurfaceColor : Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlphaValue(0.05),
            offset: const Offset(0, 2),
            blurRadius: 5,
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withAlphaValue(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: AppTheme.primaryColor,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: isDarkMode
                      ? AppTheme.darkTextPrimaryColor
                      : AppTheme.textPrimaryColor,
                ),
              ),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: isDarkMode
                      ? AppTheme.darkTextSecondaryColor
                      : AppTheme.textSecondaryColor,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
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
