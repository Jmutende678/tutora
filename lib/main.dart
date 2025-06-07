import 'package:flutter/material.dart';
import 'package:tutora/screens/admin/company_settings_screen.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/color_extensions.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tutora',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  // Mock data
  final List<Map<String, dynamic>> _users = [
    {'name': 'Emma Johnson', 'email': 'emma@example.com', 'isAdmin': false},
    {'name': 'Michael Chen', 'email': 'michael@example.com', 'isAdmin': true},
    {'name': 'Sophie Williams', 'email': 'sophie@example.com', 'isAdmin': false},
  ];
  
  final List<ModuleModel> _modules = ModuleModel.dummyModules();
  
  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Tutora Admin'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Users'),
              Tab(text: 'Modules'),
              Tab(text: 'Company Settings'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Users Management Tab
            ListView.builder(
              itemCount: _users.length,
              itemBuilder: (context, index) {
                final user = _users[index];
                return ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Colors.primaries[index % Colors.primaries.length],
                    child: Text(
                      user['name'][0],
                      style: const TextStyle(color: Colors.white),
                    ),
                  ),
                  title: Text(user['name']),
                  subtitle: Text(user['email']),
                  trailing: user['isAdmin'] 
                    ? Chip(
                        label: const Text('Admin'),
                        backgroundColor: isDarkMode
                          ? AppTheme.primaryDarkColor.withAlphaValue(0.2)
                          : AppTheme.primaryLightColor.withAlphaValue(0.2),
                        labelStyle: TextStyle(
                          color: isDarkMode
                            ? AppTheme.primaryLightColor
                            : AppTheme.primaryDarkColor,
                        ),
                      )
                    : null,
                );
              },
            ),
            
            // Modules Tab
            ListView.builder(
              itemCount: _modules.length,
              padding: const EdgeInsets.all(16),
              itemBuilder: (context, index) {
                final module = _modules[index];
                
                // Get color based on module status
                Color statusColor;
                String statusText;
                
                switch (module.status) {
                  case ModuleStatus.notStarted:
                    statusColor = AppTheme.notStartedColor;
                    statusText = 'Not Started';
                    break;
                  case ModuleStatus.inProgress:
                    statusColor = AppTheme.inProgressColor;
                    statusText = 'In Progress';
                    break;
                  case ModuleStatus.completed:
                    statusColor = AppTheme.completedColor;
                    statusText = 'Completed';
                    break;
                }
                
                return Card(
                  elevation: 2,
                  margin: const EdgeInsets.only(bottom: 16),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                module.title,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: statusColor.withAlphaValue(0.1),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                statusText,
                                style: TextStyle(
                                  color: statusColor,
                                  fontWeight: FontWeight.w500,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          module.description,
                          style: TextStyle(
                            color: isDarkMode
                                ? AppTheme.darkTextSecondaryColor
                                : AppTheme.textSecondaryColor,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Icon(
                              Icons.timer_outlined,
                              size: 16,
                              color: isDarkMode
                                  ? AppTheme.darkTextSecondaryColor
                                  : AppTheme.textSecondaryColor,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${module.estimatedMinutes} minutes',
                              style: TextStyle(
                                fontSize: 12,
                                color: isDarkMode
                                    ? AppTheme.darkTextSecondaryColor
                                    : AppTheme.textSecondaryColor,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Icon(
                              Icons.star_outline,
                              size: 16,
                              color: isDarkMode
                                  ? AppTheme.darkTextSecondaryColor
                                  : AppTheme.textSecondaryColor,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${module.pointsValue} points',
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
                  ),
                );
              },
            ),
            
            // Company Settings Tab (use the full implementation)
            const CompanySettingsScreen(),
          ],
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            // Add new user
            final newIndex = _users.length + 1;
            setState(() {
              _users.add({
                'name': 'New User $newIndex',
                'email': 'user$newIndex@example.com',
                'isAdmin': false,
              });
            });
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('User added!'),
                backgroundColor: AppTheme.successColor,
              ),
            );
          },
          child: const Icon(Icons.add),
        ),
      ),
    );
  }
} 