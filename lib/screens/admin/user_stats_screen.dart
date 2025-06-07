import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/models/user_model.dart';

class UserStatsScreen extends StatefulWidget {
  const UserStatsScreen({super.key});

  @override
  State<UserStatsScreen> createState() => _UserStatsScreenState();
}

class _UserStatsScreenState extends State<UserStatsScreen> {
  bool _isLoading = true;
  String _searchQuery = '';
  String _selectedFilter = 'All Users';
  
  late List<UserModel> _users;
  late List<UserModel> _filteredUsers;
  
  final List<String> _filters = [
    'All Users',
    'Active Today',
    'Most Points',
    'Least Progress',
    'New Users',
  ];
  
  @override
  void initState() {
    super.initState();
    _loadUserData();
  }
  
  Future<void> _loadUserData() async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    // In a real app, this would be fetched from a backend
    _users = [
      UserModel(
        id: '1',
        name: 'Emma Johnson',
        email: 'emma@example.com',
        points: 750,
        position: 'HR Specialist',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 120)),
        modulesCompleted: 12,
        quizzesCompleted: 12,
        lastActive: DateTime.now().subtract(const Duration(hours: 2)),
      ),
      UserModel(
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        points: 720,
        position: 'Sales Manager',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 90)),
        modulesCompleted: 11,
        quizzesCompleted: 11,
        lastActive: DateTime.now().subtract(const Duration(minutes: 45)),
      ),
      UserModel(
        id: '3',
        name: 'Sophie Williams',
        email: 'sophie@example.com',
        points: 680,
        position: 'Marketing Specialist',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 60)),
        modulesCompleted: 10,
        quizzesCompleted: 10,
        lastActive: DateTime.now().subtract(const Duration(minutes: 10)),
      ),
      UserModel(
        id: '4',
        name: 'David Wilson',
        email: 'david@example.com',
        points: 650,
        position: 'Customer Success',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 75)),
        modulesCompleted: 9,
        quizzesCompleted: 9,
        lastActive: DateTime.now().subtract(const Duration(hours: 5)),
      ),
      UserModel(
        id: '5',
        name: 'Sophia Martinez',
        email: 'sophia@example.com',
        points: 620,
        position: 'Product Manager',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 45)),
        modulesCompleted: 8,
        quizzesCompleted: 8,
        lastActive: DateTime.now().subtract(const Duration(hours: 1)),
      ),
      UserModel(
        id: '6',
        name: 'James Taylor',
        email: 'james@example.com',
        points: 580,
        position: 'Sales Representative',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/6.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 30)),
        modulesCompleted: 7,
        quizzesCompleted: 7,
        lastActive: DateTime.now().subtract(const Duration(days: 2)),
      ),
      UserModel(
        id: '7',
        name: 'Olivia Brown',
        email: 'olivia@example.com',
        points: 540,
        position: 'Customer Support',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/7.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 20)),
        modulesCompleted: 6,
        quizzesCompleted: 6,
        lastActive: DateTime.now().subtract(const Duration(hours: 12)),
      ),
      UserModel(
        id: '8',
        name: 'Ethan Davis',
        email: 'ethan@example.com',
        points: 510,
        position: 'Software Developer',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/8.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 15)),
        modulesCompleted: 5,
        quizzesCompleted: 5,
        lastActive: DateTime.now().subtract(const Duration(days: 1)),
      ),
      UserModel(
        id: '9',
        name: 'Ava Garcia',
        email: 'ava@example.com',
        points: 480,
        position: 'UX Designer',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/9.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 10)),
        modulesCompleted: 4,
        quizzesCompleted: 4,
        lastActive: DateTime.now().subtract(const Duration(hours: 6)),
      ),
      UserModel(
        id: '10',
        name: 'Noah Rodriguez',
        email: 'noah@example.com',
        points: 450,
        position: 'IT Specialist',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/10.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 5)),
        modulesCompleted: 3,
        quizzesCompleted: 3,
        lastActive: DateTime.now().subtract(const Duration(minutes: 30)),
      ),
    ];
    
    _filteredUsers = List.from(_users);
    
    setState(() {
      _isLoading = false;
    });
  }
  
  void _filterUsers() {
    if (_searchQuery.isEmpty && _selectedFilter == 'All Users') {
      _filteredUsers = List.from(_users);
      return;
    }
    
    // Apply search query filter
    List<UserModel> result = _users.where((user) {
      final nameMatch = user.name.toLowerCase().contains(_searchQuery.toLowerCase());
      final emailMatch = user.email.toLowerCase().contains(_searchQuery.toLowerCase());
      final positionMatch = (user.position ?? '').toLowerCase().contains(_searchQuery.toLowerCase());
      return nameMatch || emailMatch || positionMatch;
    }).toList();
    
    // Apply additional filters
    if (_selectedFilter != 'All Users') {
      switch (_selectedFilter) {
        case 'Active Today':
          result = result.where((user) => 
            user.lastActive != null && 
            user.lastActive!.isAfter(DateTime.now().subtract(const Duration(hours: 24)))
          ).toList();
          break;
        case 'Most Points':
          result.sort((a, b) => b.points.compareTo(a.points));
          break;
        case 'Least Progress':
          result.sort((a, b) => (a.modulesCompleted ?? 0).compareTo(b.modulesCompleted ?? 0));
          break;
        case 'New Users':
          result.sort((a, b) => b.joinDate!.compareTo(a.joinDate!));
          break;
      }
    }
    
    setState(() {
      _filteredUsers = result;
    });
  }
  
  String _formatLastActive(DateTime? lastActive) {
    if (lastActive == null) return 'Never';
    
    final now = DateTime.now();
    final difference = now.difference(lastActive);
    
    if (difference.inMinutes < 60) {
      return '${difference.inMinutes} min ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hours ago';
    } else {
      return '${difference.inDays} days ago';
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('User Statistics'),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Search and filter controls
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      // Search field
                      TextField(
                        onChanged: (value) {
                          setState(() {
                            _searchQuery = value;
                          });
                          _filterUsers();
                        },
                        decoration: InputDecoration(
                          hintText: 'Search users...',
                          prefixIcon: const Icon(Icons.search),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          contentPadding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Filter chips
                      SizedBox(
                        height: 40,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: _filters.length,
                          itemBuilder: (context, index) {
                            final filter = _filters[index];
                            final isSelected = filter == _selectedFilter;
                            
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: FilterChip(
                                label: Text(filter),
                                selected: isSelected,
                                onSelected: (selected) {
                                  setState(() {
                                    _selectedFilter = filter;
                                  });
                                  _filterUsers();
                                },
                                backgroundColor: isDarkMode
                                    ? AppTheme.darkSurfaceColor
                                    : Colors.white,
                                selectedColor: AppTheme.primaryColor.withOpacity(0.2),
                                checkmarkColor: AppTheme.primaryColor,
                                labelStyle: TextStyle(
                                  color: isSelected
                                      ? AppTheme.primaryColor
                                      : isDarkMode
                                          ? AppTheme.darkTextPrimaryColor
                                          : AppTheme.textPrimaryColor,
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      
                      const SizedBox(height: 8),
                      
                      // Results count
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Showing ${_filteredUsers.length} users',
                          style: TextStyle(
                            fontSize: 14,
                            color: isDarkMode
                                ? AppTheme.darkTextSecondaryColor
                                : AppTheme.textSecondaryColor,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                
                // User statistics summary
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildStatItem(
                        context,
                        '${_users.length}',
                        'Total Users',
                        Icons.people,
                      ),
                      _buildStatItem(
                        context,
                        '${_users.where((u) => u.lastActive != null && u.lastActive!.isAfter(DateTime.now().subtract(const Duration(hours: 24)))).length}',
                        'Active Today',
                        Icons.person_outline,
                      ),
                      _buildStatItem(
                        context,
                        (_users.map((u) => u.modulesCompleted ?? 0).reduce((a, b) => a + b) / _users.length).toStringAsFixed(1),
                        'Avg. Modules',
                        Icons.folder_outlined,
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // User list
                Expanded(
                  child: _filteredUsers.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.search_off,
                                size: 64,
                                color: isDarkMode
                                    ? AppTheme.darkTextSecondaryColor
                                    : AppTheme.textSecondaryColor,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'No users found',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: isDarkMode
                                      ? AppTheme.darkTextPrimaryColor
                                      : AppTheme.textPrimaryColor,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Try adjusting your search or filters',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: isDarkMode
                                      ? AppTheme.darkTextSecondaryColor
                                      : AppTheme.textSecondaryColor,
                                ),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _filteredUsers.length,
                          itemBuilder: (context, index) {
                            final user = _filteredUsers[index];
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: Container(
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
                                child: ExpansionTile(
                                  leading: CircleAvatar(
                                    backgroundImage: NetworkImage(user.profileImageUrl ?? ''),
                                  ),
                                  title: Text(
                                    user.name,
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: isDarkMode
                                          ? AppTheme.darkTextPrimaryColor
                                          : AppTheme.textPrimaryColor,
                                    ),
                                  ),
                                  subtitle: Text(
                                    '${user.position} • Last active: ${_formatLastActive(user.lastActive)}',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isDarkMode
                                          ? AppTheme.darkTextSecondaryColor
                                          : AppTheme.textSecondaryColor,
                                    ),
                                  ),
                                  trailing: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: AppTheme.primaryColor.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
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
                                  childrenPadding: const EdgeInsets.all(16),
                                  children: [
                                    Row(
                                      children: [
                                        _buildUserStatCard(
                                          context,
                                          'Modules',
                                          '${user.modulesCompleted ?? 0}/15',
                                          Icons.folder,
                                          AppTheme.primaryColor,
                                        ),
                                        const SizedBox(width: 12),
                                        _buildUserStatCard(
                                          context,
                                          'Quizzes',
                                          '${user.quizzesCompleted ?? 0}/15',
                                          Icons.quiz,
                                          Colors.orange,
                                        ),
                                        const SizedBox(width: 12),
                                        _buildUserStatCard(
                                          context,
                                          'Joined',
                                          '${user.joinDate?.day}/${user.joinDate?.month}/${user.joinDate?.year}',
                                          Icons.calendar_today,
                                          Colors.green,
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    // Module progress
                                    Row(
                                      children: [
                                        const Text(
                                          'Overall Progress:',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Expanded(
                                          child: LinearProgressIndicator(
                                            value: (user.modulesCompleted ?? 0) / 15,
                                            backgroundColor: isDarkMode
                                                ? Colors.grey.shade800
                                                : Colors.grey.shade200,
                                            valueColor: AlwaysStoppedAnimation<Color>(
                                              (user.modulesCompleted ?? 0) < 5
                                                  ? Colors.red
                                                  : (user.modulesCompleted ?? 0) < 10
                                                      ? Colors.orange
                                                      : Colors.green,
                                            ),
                                            borderRadius: BorderRadius.circular(4),
                                            minHeight: 8,
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Text(
                                          '${((user.modulesCompleted ?? 0) / 15 * 100).toInt()}%',
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    // User actions
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.end,
                                      children: [
                                        OutlinedButton.icon(
                                          onPressed: () {},
                                          icon: const Icon(Icons.mail_outline),
                                          label: const Text('Message'),
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor: AppTheme.primaryColor,
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        OutlinedButton.icon(
                                          onPressed: () {},
                                          icon: const Icon(Icons.analytics_outlined),
                                          label: const Text('Detailed Stats'),
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor: AppTheme.primaryColor,
                                          ),
                                        ),
                                      ],
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
  
  Widget _buildStatItem(
    BuildContext context,
    String value,
    String label,
    IconData icon,
  ) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: isDarkMode
                ? AppTheme.darkSurfaceColor
                : Colors.white,
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
          value,
          style: TextStyle(
            fontSize: 18,
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
    );
  }
  
  Widget _buildUserStatCard(
    BuildContext context,
    String label,
    String value,
    IconData icon,
    Color color,
  ) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  icon,
                  color: color,
                  size: 16,
                ),
                const SizedBox(width: 4),
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
            const SizedBox(height: 4),
            Text(
              value,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
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
} 