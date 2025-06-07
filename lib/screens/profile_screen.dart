import 'package:flutter/material.dart';
import 'package:tutora/models/user_model.dart';
import 'package:tutora/theme/app_theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late UserModel _user;
  final bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _user = UserModel.dummyUser();
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Profile header with avatar
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color:
                          isDarkMode ? AppTheme.darkSurfaceColor : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          offset: const Offset(0, 2),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        // Profile image
                        CircleAvatar(
                          radius: 50,
                          backgroundColor: AppTheme.primaryColor,
                          child: _user.profileImageUrl != null
                              ? ClipRRect(
                                  borderRadius: BorderRadius.circular(50),
                                  child: Image.network(
                                    _user.profileImageUrl!,
                                    width: 100,
                                    height: 100,
                                    fit: BoxFit.cover,
                                  ),
                                )
                              : Text(
                                  _user.name[0],
                                  style: const TextStyle(
                                    fontSize: 40,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                        ),
                        const SizedBox(height: 16),

                        // Name and position
                        Text(
                          _user.name,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: isDarkMode
                                ? AppTheme.darkTextPrimaryColor
                                : AppTheme.textPrimaryColor,
                          ),
                        ),
                        if (_user.position != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            _user.position!,
                            style: TextStyle(
                              fontSize: 16,
                              color: isDarkMode
                                  ? AppTheme.darkTextSecondaryColor
                                  : AppTheme.textSecondaryColor,
                            ),
                          ),
                        ],

                        const SizedBox(height: 16),

                        // Points and badges
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 8,
                              ),
                              decoration: BoxDecoration(
                                color: AppTheme.primaryColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.star,
                                    color: AppTheme.primaryColor,
                                    size: 18,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${_user.points} Points',
                                    style: const TextStyle(
                                      color: AppTheme.primaryColor,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 8,
                              ),
                              decoration: BoxDecoration(
                                color: AppTheme.secondaryColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.local_fire_department,
                                    color: AppTheme.secondaryColor,
                                    size: 18,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${_user.currentStreak} Day Streak',
                                    style: const TextStyle(
                                      color: AppTheme.secondaryColor,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // User details section
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color:
                          isDarkMode ? AppTheme.darkSurfaceColor : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          offset: const Offset(0, 2),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildDetailItem(context, 'Email', _user.email),
                        if (_user.companyCode != null)
                          _buildDetailItem(
                              context, 'Company Code', _user.companyCode!),
                        if (_user.joinDate != null)
                          _buildDetailItem(
                              context, 'Joined', _formatDate(_user.joinDate!)),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Statistics section
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color:
                          isDarkMode ? AppTheme.darkSurfaceColor : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          offset: const Offset(0, 2),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Learning Statistics',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: isDarkMode
                                ? AppTheme.darkTextPrimaryColor
                                : AppTheme.textPrimaryColor,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: _buildStatisticItem(
                                context,
                                Icons.book,
                                '${_user.modulesCompleted ?? 0}',
                                'Modules\nCompleted',
                              ),
                            ),
                            Expanded(
                              child: _buildStatisticItem(
                                context,
                                Icons.quiz,
                                '${_user.quizzesCompleted ?? 0}',
                                'Quizzes\nCompleted',
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Sign out button
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () {
                        // In a real app, this would sign the user out
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content:
                                Text('Sign out functionality would go here'),
                          ),
                        );
                      },
                      icon: const Icon(Icons.logout),
                      label: const Text('Sign Out'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        foregroundColor: AppTheme.errorColor,
                        side: const BorderSide(color: AppTheme.errorColor),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }

  Widget _buildDetailItem(BuildContext context, String label, String value) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: isDarkMode
                    ? AppTheme.darkTextSecondaryColor
                    : AppTheme.textSecondaryColor,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                color: isDarkMode
                    ? AppTheme.darkTextPrimaryColor
                    : AppTheme.textPrimaryColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatisticItem(
      BuildContext context, IconData icon, String value, String label) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Column(
      children: [
        Icon(
          icon,
          color: AppTheme.primaryColor,
          size: 28,
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: isDarkMode
                ? AppTheme.darkTextPrimaryColor
                : AppTheme.textPrimaryColor,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12,
            color: isDarkMode
                ? AppTheme.darkTextSecondaryColor
                : AppTheme.textSecondaryColor,
          ),
        ),
      ],
    );
  }
}
