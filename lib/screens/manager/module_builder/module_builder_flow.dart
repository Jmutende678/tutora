import 'package:flutter/material.dart';
import '../../../theme/app_theme.dart';

class ModuleBuilderFlow extends StatefulWidget {
  const ModuleBuilderFlow({super.key});

  @override
  State<ModuleBuilderFlow> createState() => _ModuleBuilderFlowState();
}

class _ModuleBuilderFlowState extends State<ModuleBuilderFlow> {
  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Module Builder'),
        backgroundColor: isDark ? AppTheme.cardColorDark : Colors.white,
        elevation: 0,
      ),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'AI Module Builder',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Create training modules with AI assistance.',
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
