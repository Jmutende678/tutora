import 'package:flutter/material.dart';
import 'package:tutora/models/user_model.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/app_logo.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen>
    with TickerProviderStateMixin {
  bool _isLoading = true;
  late List<UserModel> _leaderboardUsers;
  String _selectedTimeFrame = 'This Week';
  final int _currentUserRank = 4;
  late AnimationController _animationController;
  late AnimationController _rankAnimationController;
  late Animation<double> _fadeInAnimation;
  late Animation<double> _slideUpAnimation;
  late Animation<double> _rankScaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _rankAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _fadeInAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.7, curve: Curves.easeOut),
      ),
    );

    _slideUpAnimation = Tween<double>(begin: 30.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.3, 1.0, curve: Curves.easeOut),
      ),
    );

    _rankScaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _rankAnimationController,
        curve: Curves.elasticOut,
      ),
    );

    _loadLeaderboardData();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _rankAnimationController.dispose();
    super.dispose();
  }

  Future<void> _loadLeaderboardData() async {
    await Future.delayed(const Duration(seconds: 1));

    if (!mounted) return;

    _leaderboardUsers = [
      UserModel(
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        points: 3450,
        position: 'Senior Sales Manager',
        profileImageUrl: null,
      ),
      UserModel(
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        points: 2890,
        position: 'Marketing Director',
        profileImageUrl: null,
      ),
      UserModel(
        id: '3',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        points: 2720,
        position: 'Product Manager',
        profileImageUrl: null,
      ),
      UserModel(
        id: '4',
        name: 'You', // Current user
        email: 'current@example.com',
        points: 2150,
        position: 'Learning Specialist',
        profileImageUrl: null,
      ),
      UserModel(
        id: '5',
        name: 'David Martinez',
        email: 'david@example.com',
        points: 1980,
        position: 'Customer Success',
        profileImageUrl: null,
      ),
      UserModel(
        id: '6',
        name: 'Sophia Brown',
        email: 'sophia@example.com',
        points: 1850,
        position: 'HR Specialist',
        profileImageUrl: null,
      ),
    ];

    if (mounted) {
      setState(() {
        _isLoading = false;
      });

      _animationController.forward();
      Future.delayed(const Duration(milliseconds: 500), () {
        if (mounted) {
          _rankAnimationController.forward();
        }
      });
    }
  }

  void _changeTimeFrame(String timeFrame) {
    if (mounted) {
      setState(() {
        _selectedTimeFrame = timeFrame;
        _isLoading = true;
      });

      _loadLeaderboardData();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDarkMode
          ? AppTheme.scaffoldBackgroundColorDark
          : AppTheme.scaffoldBackgroundColorLight,
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : AnimatedBuilder(
              animation: _animationController,
              builder: (context, child) {
                return Transform.translate(
                  offset: Offset(0, _slideUpAnimation.value),
                  child: Opacity(
                    opacity: _fadeInAnimation.value,
                    child: CustomScrollView(
                      slivers: [
                        // App Bar with gradient
                        SliverAppBar(
                          expandedHeight: 200,
                          pinned: true,
                          flexibleSpace: FlexibleSpaceBar(
                            background: Container(
                              decoration: BoxDecoration(
                                color: isDarkMode
                                    ? AppTheme.cardColorDark
                                    : Colors.white,
                              ),
                              child: Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    AppLogo.getSmallLogo(size: 48),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Leaderboard',
                                      style: TextStyle(
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                        color: isDarkMode
                                            ? AppTheme.darkTextPrimaryColor
                                            : AppTheme.textPrimaryColor,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          backgroundColor: isDarkMode
                              ? AppTheme.cardColorDark
                              : Colors.white,
                          elevation: 0,
                        ),

                        // Time frame selector
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  _buildTimeFrameChip('This Week'),
                                  const SizedBox(width: 8),
                                  _buildTimeFrameChip('This Month'),
                                  const SizedBox(width: 8),
                                  _buildTimeFrameChip('All Time'),
                                ],
                              ),
                            ),
                          ),
                        ),

                        // Current User Rank Card - Inspired by Flutter Flow
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: ScaleTransition(
                              scale: _rankScaleAnimation,
                              child: Container(
                                margin: const EdgeInsets.only(bottom: 24),
                                padding: const EdgeInsets.all(20),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      AppTheme.primaryColor
                                          .withValues(alpha: 0.1),
                                      AppTheme.primaryColor
                                          .withValues(alpha: 0.05),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: AppTheme.primaryColor
                                        .withValues(alpha: 0.3),
                                    width: 2,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppTheme.primaryColor
                                          .withValues(alpha: 0.1),
                                      blurRadius: 20,
                                      offset: const Offset(0, 10),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Your Current Rank',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                        color: isDarkMode
                                            ? AppTheme.darkTextSecondaryColor
                                            : AppTheme.textSecondaryColor,
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                    Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 16, vertical: 8),
                                          decoration: BoxDecoration(
                                            color: Colors.amber,
                                            borderRadius:
                                                BorderRadius.circular(25),
                                            boxShadow: [
                                              BoxShadow(
                                                color: Colors.amber
                                                    .withValues(alpha: 0.3),
                                                blurRadius: 8,
                                                offset: const Offset(0, 4),
                                              ),
                                            ],
                                          ),
                                          child: Text(
                                            '#$_currentUserRank',
                                            style: const TextStyle(
                                              fontSize: 28,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Icon(
                                          Icons.emoji_events,
                                          color: Colors.amber,
                                          size: 32,
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      '2,150 points',
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
                                      '350 points to Top 3',
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: isDarkMode
                                            ? AppTheme.darkTextSecondaryColor
                                            : AppTheme.textSecondaryColor,
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    // Progress bar
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(10),
                                      child: LinearProgressIndicator(
                                        value: 0.72,
                                        backgroundColor: isDarkMode
                                            ? Colors.grey[700]
                                            : Colors.grey[200],
                                        valueColor:
                                            const AlwaysStoppedAnimation<Color>(
                                                Colors.amber),
                                        minHeight: 8,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),

                        // Top Performers Section
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Top Performers',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: isDarkMode
                                        ? AppTheme.darkTextPrimaryColor
                                        : AppTheme.textPrimaryColor,
                                  ),
                                ),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    Text(
                                      _selectedTimeFrame,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                        color: AppTheme.primaryColor,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                              ],
                            ),
                          ),
                        ),

                        // Leaderboard List
                        SliverList(
                          delegate: SliverChildBuilderDelegate(
                            (context, index) {
                              final user = _leaderboardUsers[index];
                              final rank = index + 1;
                              final isCurrentUser = user.name == 'You';

                              return Padding(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 4),
                                child: Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: isCurrentUser
                                        ? AppTheme.primaryColor
                                            .withValues(alpha: 0.1)
                                        : (isDarkMode
                                            ? AppTheme.cardColorDark
                                            : Colors.white),
                                    borderRadius: BorderRadius.circular(16),
                                    border: isCurrentUser
                                        ? Border.all(
                                            color: AppTheme.primaryColor
                                                .withValues(alpha: 0.3))
                                        : null,
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black
                                            .withValues(alpha: 0.05),
                                        blurRadius: 10,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: Row(
                                    children: [
                                      // Rank badge
                                      Container(
                                        width: 32,
                                        height: 32,
                                        decoration: BoxDecoration(
                                          color: _getRankColor(rank),
                                          shape: BoxShape.circle,
                                          boxShadow: [
                                            BoxShadow(
                                              color: _getRankColor(rank)
                                                  .withValues(alpha: 0.3),
                                              blurRadius: 6,
                                              offset: const Offset(0, 2),
                                            ),
                                          ],
                                        ),
                                        child: Center(
                                          child: rank <= 3
                                              ? Icon(
                                                  _getRankIcon(rank),
                                                  color: Colors.white,
                                                  size: 16,
                                                )
                                              : Text(
                                                  rank.toString(),
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 12,
                                                  ),
                                                ),
                                        ),
                                      ),
                                      const SizedBox(width: 10),

                                      // Profile image
                                      CircleAvatar(
                                        radius: 18,
                                        backgroundColor: AppTheme.primaryColor
                                            .withValues(alpha: 0.1),
                                        child: Icon(
                                          Icons.person,
                                          color: AppTheme.primaryColor,
                                          size: 18,
                                        ),
                                      ),
                                      const SizedBox(width: 8),

                                      // User info
                                      Expanded(
                                        child: Padding(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 4),
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Text(
                                                user.name,
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.bold,
                                                  color: isDarkMode
                                                      ? AppTheme
                                                          .darkTextPrimaryColor
                                                      : AppTheme
                                                          .textPrimaryColor,
                                                ),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                              if (user.position != null &&
                                                  user.position!
                                                      .isNotEmpty) ...[
                                                const SizedBox(height: 1),
                                                Text(
                                                  user.position!,
                                                  style: TextStyle(
                                                    fontSize: 9,
                                                    color: isDarkMode
                                                        ? AppTheme
                                                            .darkTextSecondaryColor
                                                        : AppTheme
                                                            .textSecondaryColor,
                                                  ),
                                                  maxLines: 1,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                              ],
                                            ],
                                          ),
                                        ),
                                      ),

                                      // Points
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: AppTheme.primaryColor
                                              .withValues(alpha: 0.1),
                                          borderRadius:
                                              BorderRadius.circular(12),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(
                                              Icons.star,
                                              color: Colors.amber,
                                              size: 12,
                                            ),
                                            const SizedBox(width: 2),
                                            Text(
                                              '${user.points}',
                                              style: const TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.bold,
                                                color: AppTheme.primaryColor,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                            childCount: _leaderboardUsers.length,
                          ),
                        ),

                        // Bottom spacing
                        const SliverToBoxAdapter(
                          child: SizedBox(height: 100),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  Widget _buildTimeFrameChip(String timeFrame) {
    final isSelected = _selectedTimeFrame == timeFrame;
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: () => _changeTimeFrame(timeFrame),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor
              : (isDarkMode ? AppTheme.cardColorDark : Colors.white),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 5,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Text(
          timeFrame,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: isSelected
                ? Colors.white
                : (isDarkMode
                    ? AppTheme.darkTextPrimaryColor
                    : AppTheme.textPrimaryColor),
          ),
        ),
      ),
    );
  }

  Color _getRankColor(int rank) {
    switch (rank) {
      case 1:
        return const Color(0xFFFFD700); // Gold
      case 2:
        return const Color(0xFFC0C0C0); // Silver
      case 3:
        return const Color(0xFFCD7F32); // Bronze
      default:
        return AppTheme.primaryColor;
    }
  }

  IconData _getRankIcon(int rank) {
    switch (rank) {
      case 1:
        return Icons.looks_one;
      case 2:
        return Icons.looks_two;
      case 3:
        return Icons.looks_3;
      default:
        return Icons.star;
    }
  }
}
