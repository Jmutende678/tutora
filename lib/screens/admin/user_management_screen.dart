import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/models/user_model.dart';

class UserManagementScreen extends StatefulWidget {
  const UserManagementScreen({super.key});

  @override
  State<UserManagementScreen> createState() => _UserManagementScreenState();
}

class _UserManagementScreenState extends State<UserManagementScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = true;
  bool _isAddingUser = false;
  String _searchQuery = '';
  
  // Form controllers
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _positionController = TextEditingController();
  bool _isManager = false;
  
  // Mock user data
  late List<UserModel> _users;
  late List<UserModel> _filteredUsers;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadUsers();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _positionController.dispose();
    super.dispose();
  }

  Future<void> _loadUsers() async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    // In a real app, this would fetch from a backend
    _users = [
      UserModel(
        id: '1',
        name: 'Emma Johnson',
        email: 'emma@example.com',
        points: 750,
        position: 'HR Specialist',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 120)),
        isManager: false,
      ),
      UserModel(
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        points: 720,
        position: 'Sales Manager',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 90)),
        isManager: true,
      ),
      UserModel(
        id: '3',
        name: 'Sophie Williams',
        email: 'sophie@example.com',
        points: 680,
        position: 'Marketing Specialist',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
        joinDate: DateTime.now().subtract(const Duration(days: 60)),
        isManager: false,
      ),
    ];
    
    _filteredUsers = List.from(_users);
    
    setState(() {
      _isLoading = false;
    });
  }

  void _filterUsers() {
    if (_searchQuery.isEmpty) {
      _filteredUsers = List.from(_users);
      return;
    }
    
    setState(() {
      _filteredUsers = _users.where((user) {
        final nameMatch = user.name.toLowerCase().contains(_searchQuery.toLowerCase());
        final emailMatch = user.email.toLowerCase().contains(_searchQuery.toLowerCase());
        final positionMatch = (user.position ?? '').toLowerCase().contains(_searchQuery.toLowerCase());
        return nameMatch || emailMatch || positionMatch;
      }).toList();
    });
  }

  void _addUser() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isAddingUser = true;
      });
      
      // Simulate network delay
      Future.delayed(const Duration(seconds: 1), () {
        // Create new user with random ID
        final newUser = UserModel(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          name: _nameController.text,
          email: _emailController.text,
          position: _positionController.text,
          points: 0,
          isManager: _isManager,
          joinDate: DateTime.now(),
          profileImageUrl: 'https://randomuser.me/api/portraits/${_isManager ? 'men' : 'women'}/${_users.length + 1}.jpg',
        );
        
        setState(() {
          _users.add(newUser);
          _filterUsers();
          _isAddingUser = false;
          
          // Clear form
          _nameController.clear();
          _emailController.clear();
          _positionController.clear();
          _isManager = false;
        });
        
        // Switch to users list tab
        _tabController.animateTo(0);
        
        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('User added successfully'),
            backgroundColor: AppTheme.successColor,
          ),
        );
      });
    }
  }

  void _removeUser(UserModel user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove User'),
        content: Text('Are you sure you want to remove ${user.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              
              setState(() {
                _users.removeWhere((u) => u.id == user.id);
                _filterUsers();
              });
              
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('User removed successfully'),
                  backgroundColor: AppTheme.errorColor,
                ),
              );
            },
            style: TextButton.styleFrom(foregroundColor: AppTheme.errorColor),
            child: const Text('Remove'),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime? date) {
    if (date == null) return 'N/A';
    return '${date.day}/${date.month}/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('User Management'),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Users'),
            Tab(text: 'Add User'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildUsersTab(isDarkMode),
                _buildAddUserTab(isDarkMode),
              ],
            ),
    );
  }

  Widget _buildUsersTab(bool isDarkMode) {
    return Column(
      children: [
        // Search bar
        Padding(
          padding: const EdgeInsets.all(16),
          child: TextField(
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
        ),
        
        // User count
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Showing ${_filteredUsers.length} of ${_users.length} users',
                style: TextStyle(
                  fontSize: 14,
                  color: isDarkMode
                      ? AppTheme.darkTextSecondaryColor
                      : AppTheme.textSecondaryColor,
                ),
              ),
              TextButton.icon(
                onPressed: () {
                  _tabController.animateTo(1);
                },
                icon: const Icon(Icons.add),
                label: const Text('Add User'),
                style: TextButton.styleFrom(
                  foregroundColor: AppTheme.primaryColor,
                ),
              ),
            ],
          ),
        ),
        
        // Users list
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
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _filteredUsers.length,
                  itemBuilder: (context, index) {
                    final user = _filteredUsers[index];
                    return Card(
                      elevation: 2,
                      margin: const EdgeInsets.only(bottom: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // User avatar
                            CircleAvatar(
                              radius: 30,
                              backgroundImage: NetworkImage(user.profileImageUrl ?? ''),
                            ),
                            const SizedBox(width: 16),
                            
                            // User details
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          user.name,
                                          style: const TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                      if (user.isManager)
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 2,
                                          ),
                                          decoration: BoxDecoration(
                                            color: AppTheme.primaryColor.withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: const Text(
                                            'Admin',
                                            style: TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.w600,
                                              color: AppTheme.primaryColor,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    user.email,
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: isDarkMode
                                          ? AppTheme.darkTextSecondaryColor
                                          : AppTheme.textSecondaryColor,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    user.position ?? 'No position',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: isDarkMode
                                          ? AppTheme.darkTextSecondaryColor
                                          : AppTheme.textSecondaryColor,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.calendar_today,
                                        size: 14,
                                        color: isDarkMode
                                            ? AppTheme.darkTextSecondaryColor
                                            : AppTheme.textSecondaryColor,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Joined: ${_formatDate(user.joinDate)}',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: isDarkMode
                                              ? AppTheme.darkTextSecondaryColor
                                              : AppTheme.textSecondaryColor,
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      const Icon(
                                        Icons.star,
                                        size: 14,
                                        color: Colors.amber,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${user.points} points',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: isDarkMode
                                              ? AppTheme.darkTextSecondaryColor
                                              : AppTheme.textSecondaryColor,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  
                                  // Action buttons
                                  Row(
                                    children: [
                                      Expanded(
                                        child: OutlinedButton.icon(
                                          onPressed: () {
                                            // In a real app, this would open a form to edit the user
                                          },
                                          icon: const Icon(Icons.edit, size: 16),
                                          label: const Text('Edit'),
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor: AppTheme.primaryColor,
                                            padding: const EdgeInsets.symmetric(vertical: 8),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: OutlinedButton.icon(
                                          onPressed: () => _removeUser(user),
                                          icon: const Icon(Icons.delete, size: 16),
                                          label: const Text('Remove'),
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor: AppTheme.errorColor,
                                            padding: const EdgeInsets.symmetric(vertical: 8),
                                          ),
                                        ),
                                      ),
                                    ],
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
    );
  }

  Widget _buildAddUserTab(bool isDarkMode) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Add New User',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: isDarkMode
                    ? AppTheme.darkTextPrimaryColor
                    : AppTheme.textPrimaryColor,
              ),
            ),
            const SizedBox(height: 24),
            
            // User form
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'User Information',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: isDarkMode
                            ? AppTheme.darkTextPrimaryColor
                            : AppTheme.textPrimaryColor,
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Name field
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Full Name',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.person),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a name';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    
                    // Email field
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email Address',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.email),
                      ),
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter an email';
                        }
                        if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                          return 'Please enter a valid email';
                        }
                        
                        // Check if email already exists
                        if (_users.any((user) => user.email.toLowerCase() == value.toLowerCase())) {
                          return 'This email is already in use';
                        }
                        
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    
                    // Position field
                    TextFormField(
                      controller: _positionController,
                      decoration: const InputDecoration(
                        labelText: 'Position',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.work),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a position';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 24),
                    
                    // Admin switch
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Admin Privileges',
                          style: TextStyle(
                            fontSize: 16,
                            color: isDarkMode
                                ? AppTheme.darkTextPrimaryColor
                                : AppTheme.textPrimaryColor,
                          ),
                        ),
                        Switch(
                          value: _isManager,
                          onChanged: (value) {
                            setState(() {
                              _isManager = value;
                            });
                          },
                          activeColor: AppTheme.primaryColor,
                        ),
                      ],
                    ),
                    
                    // Admin description
                    Text(
                      'Admins can manage users, upload videos, and create modules and quizzes.',
                      style: TextStyle(
                        fontSize: 14,
                        fontStyle: FontStyle.italic,
                        color: isDarkMode
                            ? AppTheme.darkTextSecondaryColor
                            : AppTheme.textSecondaryColor,
                      ),
                    ),
                    const SizedBox(height: 32),
                    
                    // Submit button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _isAddingUser ? null : _addUser,
                        icon: _isAddingUser
                            ? Container(
                                width: 24,
                                height: 24,
                                padding: const EdgeInsets.all(2.0),
                                child: const CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 3,
                                ),
                              )
                            : const Icon(Icons.person_add),
                        label: Text(_isAddingUser ? 'Adding...' : 'Add User'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Help text
                    Text(
                      'An email will be sent to the user with instructions to set their password.',
                      style: TextStyle(
                        fontSize: 14,
                        color: isDarkMode
                            ? AppTheme.darkTextSecondaryColor
                            : AppTheme.textSecondaryColor,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
} 