import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/utils/app_logo.dart';
import 'package:tutora/screens/admin/ai_module_builder_screen.dart';

class ModuleManagementScreen extends StatefulWidget {
  const ModuleManagementScreen({super.key});

  @override
  State<ModuleManagementScreen> createState() => _ModuleManagementScreenState();
}

class _ModuleManagementScreenState extends State<ModuleManagementScreen>
    with TickerProviderStateMixin {
  int _selectedTabIndex = 0;
  List<ModuleModel> _modules = [];
  bool _isLoading = false;
  String _searchQuery = '';
  String _selectedCategory = 'All';
  ModuleStatus? _selectedStatus;

  // Create Module Form Controllers
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _categoryController = TextEditingController();
  final _pointsController = TextEditingController();
  final _durationController = TextEditingController();

  // Image upload state

  // Categories
  final List<String> _categories = [
    'All',
    'Safety',
    'Service',
    'Compliance',
    'Soft Skills',
    'Productivity',
    'Technology'
  ];

  @override
  void initState() {
    super.initState();
    _loadModules();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _categoryController.dispose();
    _pointsController.dispose();
    _durationController.dispose();
    super.dispose();
  }

  Future<void> _loadModules() async {
    if (mounted) {
      setState(() {
        _isLoading = true;
      });
    }

    await Future.delayed(const Duration(seconds: 1));

    if (mounted) {
      setState(() {
        _modules = ModuleModel.dummyModules();
        _isLoading = false;
      });
    }
  }

  List<ModuleModel> get _filteredModules {
    return _modules.where((module) {
      final matchesSearch = module.title
              .toLowerCase()
              .contains(_searchQuery.toLowerCase()) ||
          module.description
              .toLowerCase()
              .contains(_searchQuery.toLowerCase()) ||
          module.category.toLowerCase().contains(_searchQuery.toLowerCase());

      final matchesCategory =
          _selectedCategory == 'All' || module.category == _selectedCategory;

      final matchesStatus =
          _selectedStatus == null || module.status == _selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            AppLogo.getIconOnly(size: 24),
            const SizedBox(width: 12),
            const Text('Module Management'),
          ],
        ),
        centerTitle: false,
        actions: [
          // AI Module Builder Button
          Container(
            margin: const EdgeInsets.only(right: 8),
            child: TextButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const AIModuleBuilderScreen(),
                  ),
                );
              },
              icon: Icon(Icons.auto_awesome, size: 20),
              label: const Text('AI Builder'),
              style: TextButton.styleFrom(
                foregroundColor: Colors.purple,
                backgroundColor: Colors.purple.withValues(alpha: 0.1),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
            ),
          ),
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _loadModules,
          ),
          IconButton(
            icon: Icon(Icons.upload_file),
            onPressed: _showBulkUploadDialog,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Enhanced Tab selector with stats
                _buildTabSelector(),

                // Tab content
                Expanded(
                  child: _selectedTabIndex == 0
                      ? _buildModulesListTab()
                      : _buildCreateModuleTab(),
                ),
              ],
            ),
      floatingActionButton: _selectedTabIndex == 0
          ? FloatingActionButton.extended(
              onPressed: () {
                setState(() {
                  _selectedTabIndex = 1;
                });
              },
              icon: Icon(Icons.add),
              label: const Text('New Module'),
              backgroundColor: AppTheme.primaryColor,
            )
          : null,
    );
  }

  Widget _buildTabSelector() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, 2),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        children: [
          // Tab buttons
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: _buildTabButton(
                      0, 'Modules', Icons.folder, '${_modules.length} Total'),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildTabButton(
                      1, 'Create', Icons.add_circle, 'Manual Builder'),
                ),
              ],
            ),
          ),

          // Quick stats (only show on modules tab)
          if (_selectedTabIndex == 0) _buildQuickStats(),
        ],
      ),
    );
  }

  Widget _buildTabButton(
      int index, String title, IconData icon, String subtitle) {
    final isSelected = _selectedTabIndex == index;
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedTabIndex = index;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor
              : (isDarkMode ? Colors.grey[800] : Colors.grey[100]),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : AppTheme.primaryColor,
              size: 24,
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isSelected
                    ? Colors.white
                    : (isDarkMode
                        ? AppTheme.darkTextPrimaryColor
                        : AppTheme.textPrimaryColor),
              ),
            ),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 12,
                color: isSelected
                    ? Colors.white.withValues(alpha: 0.8)
                    : (isDarkMode
                        ? AppTheme.darkTextSecondaryColor
                        : AppTheme.textSecondaryColor),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickStats() {
    final completedModules =
        _modules.where((m) => m.status == ModuleStatus.completed).length;
    final inProgressModules =
        _modules.where((m) => m.status == ModuleStatus.inProgress).length;
    final notStartedModules =
        _modules.where((m) => m.status == ModuleStatus.notStarted).length;

    return Container(
      padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
      child: Row(
        children: [
          Expanded(
              child:
                  _buildStatChip('Completed', completedModules, Colors.green)),
          const SizedBox(width: 8),
          Expanded(
              child: _buildStatChip(
                  'In Progress', inProgressModules, Colors.orange)),
          const SizedBox(width: 8),
          Expanded(
              child: _buildStatChip(
                  'Not Started', notStartedModules, Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildStatChip(String label, int count, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          FittedBox(
            child: Text(
              count.toString(),
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ),
          const SizedBox(height: 1),
          FittedBox(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 8,
                color: color,
              ),
              textAlign: TextAlign.center,
              overflow: TextOverflow.ellipsis,
              maxLines: 1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModulesListTab() {
    return Column(
      children: [
        // Search and filters
        _buildSearchAndFilters(),

        // Modules list
        Expanded(
          child: _filteredModules.isEmpty
              ? _buildEmptyState()
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _filteredModules.length,
                  itemBuilder: (context, index) {
                    return _buildEnhancedModuleCard(_filteredModules[index]);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildSearchAndFilters() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, 2),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        children: [
          // Search bar
          TextField(
            onChanged: (value) {
              setState(() {
                _searchQuery = value;
              });
            },
            decoration: InputDecoration(
              hintText: 'Search modules...',
              prefixIcon: Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              filled: true,
              fillColor: isDarkMode ? Colors.grey[800] : Colors.grey[100],
            ),
          ),

          const SizedBox(height: 16),

          // Filters
          Row(
            children: [
              // Category filter
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: _selectedCategory,
                  decoration: InputDecoration(
                    labelText: 'Category',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  items: _categories.map((category) {
                    return DropdownMenuItem(
                      value: category,
                      child: Text(
                        category,
                        overflow: TextOverflow.ellipsis,
                      ),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedCategory = value!;
                    });
                  },
                ),
              ),

              const SizedBox(width: 12),

              // Status filter
              Expanded(
                child: DropdownButtonFormField<ModuleStatus?>(
                  value: _selectedStatus,
                  decoration: InputDecoration(
                    labelText: 'Status',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  items: const [
                    DropdownMenuItem(
                        value: null,
                        child: Text('All Status',
                            overflow: TextOverflow.ellipsis)),
                    DropdownMenuItem(
                        value: ModuleStatus.notStarted,
                        child: Text('Not Started',
                            overflow: TextOverflow.ellipsis)),
                    DropdownMenuItem(
                        value: ModuleStatus.inProgress,
                        child: Text('In Progress',
                            overflow: TextOverflow.ellipsis)),
                    DropdownMenuItem(
                        value: ModuleStatus.completed,
                        child:
                            Text('Completed', overflow: TextOverflow.ellipsis)),
                  ],
                  onChanged: (value) {
                    setState(() {
                      _selectedStatus = value;
                    });
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEnhancedModuleCard(ModuleModel module) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, 2),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Module image header
          ClipRRect(
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(16),
              topRight: Radius.circular(16),
            ),
            child: Stack(
              children: [
                SizedBox(
                  height: 120,
                  width: double.infinity,
                  child: _buildPlaceholderImage(),
                ),

                // Overlay with actions
                Positioned(
                  top: 8,
                  right: 8,
                  child: Row(
                    children: [
                      _buildActionButton(
                        Icons.edit,
                        () => _editModule(module),
                        Colors.blue,
                      ),
                      const SizedBox(width: 8),
                      _buildActionButton(
                        Icons.delete,
                        () => _deleteModule(module),
                        Colors.red,
                      ),
                    ],
                  ),
                ),

                // Status badge
                Positioned(
                  top: 8,
                  left: 8,
                  child: _buildStatusBadge(module.status),
                ),
              ],
            ),
          ),

          // Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title and difficulty
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(
                        module.title,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: isDarkMode
                              ? AppTheme.darkTextPrimaryColor
                              : AppTheme.textPrimaryColor,
                        ),
                      ),
                    ),
                    _buildDifficultyBadge(module.difficulty),
                  ],
                ),

                const SizedBox(height: 8),

                // Description
                Text(
                  module.description,
                  style: TextStyle(
                    fontSize: 14,
                    color: isDarkMode
                        ? AppTheme.darkTextSecondaryColor
                        : AppTheme.textSecondaryColor,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),

                const SizedBox(height: 16),

                // Details row
                Row(
                  children: [
                    _buildDetailItem(Icons.category, module.category),
                    _buildDetailItem(
                        Icons.timer, '${module.estimatedMinutes}m'),
                    _buildDetailItem(Icons.star, '${module.pointsValue} pts'),
                    const Spacer(),

                    // Actions
                    IconButton(
                      icon: Icon(Icons.visibility),
                      onPressed: () => _previewModule(module),
                      iconSize: 20,
                    ),
                    IconButton(
                      icon: Icon(Icons.copy),
                      onPressed: () => _duplicateModule(module),
                      iconSize: 20,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailItem(IconData icon, String text) {
    return Container(
      margin: const EdgeInsets.only(right: 12),
      child: Row(
        children: [
          Icon(icon, size: 14, color: Colors.grey),
          const SizedBox(width: 4),
          Text(
            text,
            style: const TextStyle(fontSize: 12, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
      IconData icon, VoidCallback onPressed, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(8),
      ),
      child: IconButton(
        icon: Icon(icon, color: Colors.white, size: 18),
        onPressed: onPressed,
        constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
        padding: EdgeInsets.zero,
      ),
    );
  }

  Widget _buildStatusBadge(ModuleStatus status) {
    Color color;
    String text;

    switch (status) {
      case ModuleStatus.completed:
        color = Colors.green;
        text = 'Complete';
        break;
      case ModuleStatus.inProgress:
        color = Colors.orange;
        text = 'Active';
        break;
      case ModuleStatus.notStarted:
        color = Colors.grey;
        text = 'Draft';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildDifficultyBadge(DifficultyLevel difficulty) {
    Color color;
    String text;

    switch (difficulty) {
      case DifficultyLevel.beginner:
        color = Colors.green;
        text = 'Beginner';
        break;
      case DifficultyLevel.intermediate:
        color = Colors.orange;
        text = 'Intermediate';
        break;
      case DifficultyLevel.advanced:
        color = Colors.red;
        text = 'Advanced';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildPlaceholderImage() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primaryColor.withValues(alpha: 0.8),
            AppTheme.primaryLightColor.withValues(alpha: 0.8),
          ],
        ),
      ),
      child: const Center(
        child: Icon(
          Icons.school,
          size: 32,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.school_outlined,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'No modules found',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Create your first module to get started',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[500],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              setState(() {
                _selectedTabIndex = 1;
              });
            },
            icon: Icon(Icons.add),
            label: const Text('Create Module'),
          ),
        ],
      ),
    );
  }

  // Create Module Tab
  Widget _buildCreateModuleTab() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.construction,
              size: 64,
              color: isDarkMode ? Colors.white54 : Colors.grey,
            ),
            const SizedBox(height: 16),
            Text(
              'Module Creation',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: isDarkMode ? Colors.white : Colors.black,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Coming Soon',
              style: TextStyle(
                fontSize: 16,
                color: isDarkMode ? Colors.white70 : Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Action methods
  void _editModule(ModuleModel module) {
    // Pre-fill form with module data
    _titleController.text = module.title;
    _descriptionController.text = module.description;
    _categoryController.text = module.category;
    _pointsController.text = module.pointsValue.toString();
    _durationController.text = module.estimatedMinutes.toString();

    setState(() {
      _selectedTabIndex = 1;
    });
  }

  void _deleteModule(ModuleModel module) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Module'),
        content: Text(
            'Are you sure you want to delete "${module.title}"? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _modules.removeWhere((m) => m.id == module.id);
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('${module.title} deleted successfully')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _previewModule(ModuleModel module) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        child: Container(
          padding: const EdgeInsets.all(20),
          constraints: const BoxConstraints(maxWidth: 400, maxHeight: 600),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Module Preview',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              if (module.imageUrl != null)
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    module.imageUrl!,
                    height: 150,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
              const SizedBox(height: 16),
              Text(
                module.title,
                style:
                    const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(module.description),
              const SizedBox(height: 16),
              Row(
                children: [
                  Chip(label: Text(module.category)),
                  const SizedBox(width: 8),
                  Chip(label: Text('${module.estimatedMinutes}m')),
                  const SizedBox(width: 8),
                  Chip(label: Text('${module.pointsValue} pts')),
                ],
              ),
              const Spacer(),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Close'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        _editModule(module);
                      },
                      child: const Text('Edit'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _duplicateModule(ModuleModel module) {
    final duplicatedModule = ModuleModel(
      id: 'module_${DateTime.now().millisecondsSinceEpoch}',
      title: '${module.title} (Copy)',
      description: module.description,
      imageUrl: module.imageUrl,
      estimatedMinutes: module.estimatedMinutes,
      pointsValue: module.pointsValue,
      category: module.category,
      status: ModuleStatus.notStarted,
      progress: 0.0,
      difficulty: module.difficulty,
      duration: module.duration,
      isCompleted: false,
    );

    setState(() {
      _modules.add(duplicatedModule);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${module.title} duplicated successfully')),
    );
  }

  void _showBulkUploadDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Bulk Upload'),
        content: const Text('Import multiple modules from CSV or Excel file.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                    content: Text('Bulk upload feature coming soon!')),
              );
            },
            child: const Text('Upload File'),
          ),
        ],
      ),
    );
  }
}
