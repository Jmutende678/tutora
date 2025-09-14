import 'package:flutter/material.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/screens/module_details_screen.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/app_logo.dart';
import 'package:tutora/widgets/module_card.dart';

class ModuleListScreen extends StatefulWidget {
  const ModuleListScreen({super.key});

  @override
  State<ModuleListScreen> createState() => _ModuleListScreenState();
}

class _ModuleListScreenState extends State<ModuleListScreen> {
  late List<ModuleModel> _modules;
  String _selectedFilter = 'All';
  final List<String> _filters = [
    'All',
    'In Progress',
    'Completed',
    'Not Started'
  ];

  @override
  void initState() {
    super.initState();
    _modules = ModuleModel.dummyModules();
  }

  List<ModuleModel> _getFilteredModules() {
    if (_selectedFilter == 'All') {
      return _modules;
    } else if (_selectedFilter == 'In Progress') {
      return _modules
          .where((m) => m.status == ModuleStatus.inProgress)
          .toList();
    } else if (_selectedFilter == 'Completed') {
      return _modules.where((m) => m.status == ModuleStatus.completed).toList();
    } else {
      return _modules
          .where((m) => m.status == ModuleStatus.notStarted)
          .toList();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final filteredModules = _getFilteredModules();

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            AppLogo.getIconOnly(size: 24),
            const SizedBox(width: 8),
            const Text('My Modules'),
          ],
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Filter chips
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _filters.map((filter) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(filter),
                      selected: _selectedFilter == filter,
                      onSelected: (selected) {
                        setState(() {
                          _selectedFilter = filter;
                        });
                      },
                      backgroundColor: isDarkMode
                          ? AppTheme.cardColorDark
                          : Colors.grey.shade100,
                      selectedColor: AppTheme.primaryColor.withValues(alpha: 0.2),
                      checkmarkColor: AppTheme.primaryColor,
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          // Modules list
          Expanded(
            child: filteredModules.isEmpty
                ? Center(
                    child: Text(
                      'No modules found with the selected filter',
                      style: TextStyle(
                        color: isDarkMode
                            ? AppTheme.darkTextSecondaryColor
                            : AppTheme.textSecondaryColor,
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredModules.length,
                    itemBuilder: (context, index) {
                      final module = filteredModules[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: ModuleCard(
                          module: module,
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    ModuleDetailsScreen(module: module),
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
