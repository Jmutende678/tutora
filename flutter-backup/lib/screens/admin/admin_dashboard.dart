import 'package:flutter/material.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  // Mock data
  final List<Map<String, dynamic>> _users = [
    {'name': 'Emma Johnson', 'email': 'emma@example.com', 'isAdmin': false},
    {'name': 'Michael Chen', 'email': 'michael@example.com', 'isAdmin': true},
    {'name': 'Sophie Williams', 'email': 'sophie@example.com', 'isAdmin': false},
  ];
  
  String? _logoData;
  
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Admin Dashboard'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Users'),
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
                    child: Text(user['name'][0]),
                  ),
                  title: Text(user['name']),
                  subtitle: Text(user['email']),
                  trailing: user['isAdmin'] 
                    ? const Chip(label: Text('Admin'))
                    : null,
                );
              },
            ),
            
            // Company Settings Tab
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (_logoData != null)
                    const Icon(Icons.image, size: 100)
                  else
                    const Icon(Icons.business, size: 100, color: Colors.grey),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _logoData = 'mock_logo_data';
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Logo updated!')),
                      );
                    },
                    child: const Text('Upload Logo'),
                  ),
                  if (_logoData != null) ...[
                    const SizedBox(height: 10),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _logoData = null;
                        });
                      },
                      child: const Text('Remove Logo'),
                    ),
                  ],
                ],
              ),
            ),
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
              const SnackBar(content: Text('User added!')),
            );
          },
          child: const Icon(Icons.add),
        ),
      ),
    );
  }
} 