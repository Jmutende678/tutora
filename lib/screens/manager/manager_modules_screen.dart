import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class ManagerModulesScreen extends StatefulWidget {
  const ManagerModulesScreen({super.key});

  @override
  State<ManagerModulesScreen> createState() => _ManagerModulesScreenState();
}

class _ManagerModulesScreenState extends State<ManagerModulesScreen> {
  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Modules Management'),
        backgroundColor: isDark ? AppTheme.cardColorDark : Colors.white,
        elevation: 0,
      ),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Modules Management',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Manage your training modules here.',
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
