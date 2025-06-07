import 'package:flutter/material.dart';
import 'package:tutora/models/user_model.dart';
import 'package:tutora/theme/app_theme.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  bool _isLoading = true;
  late List<UserModel> _leaderboardUsers;
  String _selectedTimeFrame = 'Weekly';
  int _currentUserRank = 0;
  
  @override
  void initState() {
    super.initState();
    _loadLeaderboardData();
  }
  
  Future<void> _loadLeaderboardData() async {
    // In a real app, we would fetch this data from the backend
    await Future.delayed(const Duration(seconds: 1));
    
    // Sample data for UI demonstration
    _leaderboardUsers = [
      UserModel(
        id: '1',
        name: 'Emma Johnson',
        email: 'emma@example.com',
        points: 750,
        position: 'HR Specialist',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
      ),
      UserModel(
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        points: 720,
        position: 'Sales Manager',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
      ),
      UserModel(
        id: '3',
        name: 'Current User', // This would be the logged-in user
        email: 'current@example.com',
        points: 680,
        position: 'Marketing Specialist',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
      ),
      UserModel(
        id: '4',
        name: 'David Wilson',
        email: 'david@example.com',
        points: 650,
        position: 'Customer Success',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
      ),
      UserModel(
        id: '5',
        name: 'Sophia Martinez',
        email: 'sophia@example.com',
        points: 620,
        position: 'Product Manager',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
      ),
      UserModel(
        id: '6',
        name: 'James Taylor',
        email: 'james@example.com',
        points: 580,
        position: 'Sales Representative',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/6.jpg',
      ),
      UserModel(
        id: '7',
        name: 'Olivia Brown',
        email: 'olivia@example.com',
        points: 540,
        position: 'Customer Support',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/7.jpg',
      ),
      UserModel(
        id: '8',
        name: 'Ethan Davis',
        email: 'ethan@example.com',
        points: 510,
        position: 'Software Developer',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/8.jpg',
      ),
      UserModel(
        id: '9',
        name: 'Ava Garcia',
        email: 'ava@example.com',
        points: 480,
        position: 'UX Designer',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/9.jpg',
      ),
      UserModel(
        id: '10',
        name: 'Noah Rodriguez',
        email: 'noah@example.com',
        points: 450,
        position: 'IT Specialist',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/10.jpg',
      ),
    ];
    
    // Find current user's rank
    _currentUserRank = _leaderboardUsers.indexWhere((user) => user.id == '3') + 1;
    
    setState(() {
      _isLoading = false;
    });
  }
  
  void _changeTimeFrame(String timeFrame) {
    setState(() {
      _selectedTimeFrame = timeFrame;
      _isLoading = true;
    });
    
    _loadLeaderboardData();
  }
  
  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Leaderboard'),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Time frame selector
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SegmentedButton<String>(
                    segments: const [
                      ButtonSegment<String>(
                        value: 'Weekly',
                        label: Text('Weekly'),
                      ),
                      ButtonSegment<String>(
                        value: 'Monthly',
                        label: Text('Monthly'),
                      ),
                      ButtonSegment<String>(
                        value: 'All Time',
                        label: Text('All Time'),
                      ),
                    ],
                    selected: {_selectedTimeFrame},
                    onSelectionChanged: (Set<String> selection) {
                      _changeTimeFrame(selection.first);
                    },
                    style: ButtonStyle(
                      backgroundColor: WidgetStateProperty.resolveWith<Color?>(
                        (Set<WidgetState> states) {
                          if (states.contains(WidgetState.selected)) {
                            return AppTheme.primaryColor;
                          }
                          return null;
                        },
                      ),
                    ),
                  ),
                ),
                
                // Top 3 users
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.1),
                    borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(30),
                      bottomRight: Radius.circular(30),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      _buildTopUser(_leaderboardUsers[1], 2, 180),
                      _buildTopUser(_leaderboardUsers[0], 1, 220),
                      _buildTopUser(_leaderboardUsers[2], 3, 160),
                    ],
                  ),
                ),
                
                // Current user's rank
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDarkMode
                          ? AppTheme.darkSurfaceColor
                          : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          offset: const Offset(0, 2),
                          blurRadius: 10,
                        ),
                      ],
                      border: Border.all(
                        color: AppTheme.primaryColor,
                        width: 2,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: const BoxDecoration(
                            color: AppTheme.primaryColor,
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: Text(
                              _currentUserRank.toString(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        CircleAvatar(
                          radius: 24,
                          backgroundImage: NetworkImage(
                            _leaderboardUsers[_currentUserRank - 1].profileImageUrl ?? '',
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'You',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  color: isDarkMode
                                      ? AppTheme.darkTextPrimaryColor
                                      : AppTheme.textPrimaryColor,
                                ),
                              ),
                              Text(
                                _leaderboardUsers[_currentUserRank - 1].position ?? '',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: isDarkMode
                                      ? AppTheme.darkTextSecondaryColor
                                      : AppTheme.textSecondaryColor,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.star,
                                color: Color(0xFFFFD700),
                                size: 20,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                _leaderboardUsers[_currentUserRank - 1].points.toString(),
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: AppTheme.primaryColor,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Other users
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _leaderboardUsers.length - 3, // Excluding top 3
                    itemBuilder: (context, index) {
                      final actualIndex = index + 3; // Start from the 4th user
                      final user = _leaderboardUsers[actualIndex];
                      
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: isDarkMode
                                ? AppTheme.darkSurfaceColor
                                : Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.05),
                                offset: const Offset(0, 2),
                                blurRadius: 5,
                              ),
                            ],
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 36,
                                height: 36,
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryColor.withOpacity(0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: Center(
                                  child: Text(
                                    (actualIndex + 1).toString(),
                                    style: const TextStyle(
                                      color: AppTheme.primaryColor,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              CircleAvatar(
                                radius: 20,
                                backgroundImage: NetworkImage(user.profileImageUrl ?? ''),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      user.name,
                                      style: TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 16,
                                        color: isDarkMode
                                            ? AppTheme.darkTextPrimaryColor
                                            : AppTheme.textPrimaryColor,
                                      ),
                                    ),
                                    Text(
                                      user.position ?? '',
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: isDarkMode
                                            ? AppTheme.darkTextSecondaryColor
                                            : AppTheme.textSecondaryColor,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.star,
                                      color: Color(0xFFFFD700),
                                      size: 16,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      user.points.toString(),
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                        color: AppTheme.primaryColor,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
    );
  }
  
  Widget _buildTopUser(UserModel user, int rank, double height) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Column(
      children: [
        Container(
          width: 70,
          height: 70,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: rank == 1
                  ? const Color(0xFFFFD700) // Gold
                  : rank == 2
                      ? const Color(0xFFC0C0C0) // Silver
                      : const Color(0xFFCD7F32), // Bronze
              width: 3,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(3.0),
            child: CircleAvatar(
              backgroundImage: NetworkImage(user.profileImageUrl ?? ''),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: rank == 1
                ? const Color(0xFFFFD700).withOpacity(0.2) // Gold
                : rank == 2
                    ? const Color(0xFFC0C0C0).withOpacity(0.2) // Silver
                    : const Color(0xFFCD7F32).withOpacity(0.2), // Bronze
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              rank.toString(),
              style: TextStyle(
                color: rank == 1
                    ? const Color(0xFFFFD700) // Gold
                    : rank == 2
                        ? const Color(0xFFC0C0C0) // Silver
                        : const Color(0xFFCD7F32), // Bronze
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          width: 90,
          child: Text(
            user.name,
            textAlign: TextAlign.center,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 14,
              color: isDarkMode
                  ? AppTheme.darkTextPrimaryColor
                  : AppTheme.textPrimaryColor,
            ),
          ),
        ),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(
            horizontal: 10,
            vertical: 4,
          ),
          decoration: BoxDecoration(
            color: rank == 1
                ? const Color(0xFFFFD700).withOpacity(0.2) // Gold
                : rank == 2
                    ? const Color(0xFFC0C0C0).withOpacity(0.2) // Silver
                    : const Color(0xFFCD7F32).withOpacity(0.2), // Bronze
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.star,
                color: Color(0xFFFFD700),
                size: 14,
              ),
              const SizedBox(width: 2),
              Text(
                user.points.toString(),
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: rank == 1
                      ? const Color(0xFFD4AF37) // Gold
                      : rank == 2
                          ? const Color(0xFFA7A7AD) // Silver
                          : const Color(0xFFAD8A56), // Bronze
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Container(
          width: 60,
          height: height,
          decoration: BoxDecoration(
            color: rank == 1
                ? const Color(0xFFFFD700) // Gold
                : rank == 2
                    ? const Color(0xFFC0C0C0) // Silver
                    : const Color(0xFFCD7F32), // Bronze
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(8),
              topRight: Radius.circular(8),
            ),
          ),
        ),
      ],
    );
  }
} 