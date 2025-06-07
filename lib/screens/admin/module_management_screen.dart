import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/models/module_model.dart';

class ModuleManagementScreen extends StatefulWidget {
  const ModuleManagementScreen({super.key});

  @override
  State<ModuleManagementScreen> createState() => _ModuleManagementScreenState();
}

class _ModuleManagementScreenState extends State<ModuleManagementScreen> {
  bool _isLoading = true;
  late List<ModuleModel> _modules;
  int _selectedTabIndex = 0;
  
  // Form controllers
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  String? _selectedDifficulty;
  String? _selectedCategory;
  
  final List<String> _difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  final List<String> _categories = [
    'Customer Service',
    'Sales',
    'Technical Skills',
    'Leadership',
    'Compliance',
    'Product Knowledge'
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
    super.dispose();
  }
  
  Future<void> _loadModules() async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    // In a real app, this would be fetched from a backend
    _modules = ModuleModel.dummyModules();
    
    setState(() {
      _isLoading = false;
    });
  }
  
  Future<void> _createModule() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });
      
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Create a new module
      final newModule = ModuleModel(
        id: 'module${_modules.length + 1}',
        title: _titleController.text,
        description: _descriptionController.text,
        imageUrl: 'https://source.unsplash.com/random/300x200/?business',
        estimatedMinutes: 30,
        pointsValue: 100,
        category: _selectedCategory ?? 'General',
        status: ModuleStatus.notStarted,
        progress: 0.0,
        difficulty: _selectedDifficulty == 'Beginner' 
            ? DifficultyLevel.beginner 
            : (_selectedDifficulty == 'Intermediate' 
                ? DifficultyLevel.intermediate 
                : DifficultyLevel.advanced),
        duration: 30,
        isCompleted: false,
      );
      
      // Add it to the list
      setState(() {
        _modules.add(newModule);
        _isLoading = false;
        _selectedTabIndex = 0; // Switch back to the modules list tab
        
        // Reset form
        _titleController.clear();
        _descriptionController.clear();
        _selectedDifficulty = null;
        _selectedCategory = null;
      });
      
      // Show success message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Module created successfully!'),
            backgroundColor: AppTheme.successColor,
          ),
        );
      }
    }
  }
  
  void _deleteModule(ModuleModel module) {
    setState(() {
      _modules.removeWhere((m) => m.id == module.id);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Module deleted successfully!'),
        backgroundColor: AppTheme.errorColor,
      ),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Module Management'),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Tab selector
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SegmentedButton<int>(
                    segments: const [
                      ButtonSegment<int>(
                        value: 0,
                        label: Text('Modules'),
                        icon: Icon(Icons.folder),
                      ),
                      ButtonSegment<int>(
                        value: 1,
                        label: Text('Create Module'),
                        icon: Icon(Icons.add),
                      ),
                    ],
                    selected: {_selectedTabIndex},
                    onSelectionChanged: (Set<int> selection) {
                      setState(() {
                        _selectedTabIndex = selection.first;
                      });
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
                
                // Tab content
                Expanded(
                  child: _selectedTabIndex == 0
                      ? _buildModulesListTab()
                      : _buildCreateModuleTab(),
                ),
              ],
            ),
    );
  }
  
  Widget _buildModulesListTab() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    // Module statistics
    final totalModules = _modules.length;
    final completedByAllUsers = _modules.where((m) => m.isCompleted).length;
    final avgModuleCompletion = _modules.isEmpty
        ? 0.0
        : _modules.map((m) => m.progress).reduce((a, b) => a + b) / _modules.length;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Modules stats
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatColumn(
                  context,
                  'Total Modules',
                  totalModules.toString(),
                  Icons.folder_outlined,
                ),
                _buildStatColumn(
                  context,
                  'Completed',
                  '$completedByAllUsers/$totalModules',
                  Icons.check_circle_outline,
                ),
                _buildStatColumn(
                  context,
                  'Avg. Progress',
                  '${avgModuleCompletion.toStringAsFixed(0)}%',
                  Icons.trending_up,
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 24),
          
          Text(
            'All Modules',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: isDarkMode
                  ? AppTheme.darkTextPrimaryColor
                  : AppTheme.textPrimaryColor,
            ),
          ),
          const SizedBox(height: 16),
          
          // Modules list
          ...List.generate(
            _modules.length,
            (index) => _buildModuleItem(context, _modules[index], index),
          ),
        ],
      ),
    );
  }
  
  Widget _buildModuleItem(BuildContext context, ModuleModel module, int index) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    final difficultyText = module.difficulty == DifficultyLevel.beginner 
        ? 'Beginner'
        : (module.difficulty == DifficultyLevel.intermediate 
            ? 'Intermediate' 
            : 'Advanced');
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Container(
        decoration: BoxDecoration(
          color: isDarkMode ? AppTheme.darkSurfaceColor : Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              offset: const Offset(0, 2),
              blurRadius: 5,
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Module image
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(12),
                    topRight: Radius.circular(12),
                  ),
                  child: Image.network(
                    module.imageUrl ?? 'https://via.placeholder.com/300x200?text=No+Image',
                    height: 120,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getDifficultyColor(difficultyText).withOpacity(0.9),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      difficultyText,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            
            // Module details
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
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
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          module.category,
                          style: const TextStyle(
                            color: AppTheme.primaryColor,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
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
                  
                  // Module stats
                  Row(
                    children: [
                      const Icon(
                        Icons.timer,
                        size: 16,
                        color: AppTheme.textSecondaryColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${module.duration} min',
                        style: TextStyle(
                          fontSize: 14,
                          color: isDarkMode
                              ? AppTheme.darkTextSecondaryColor
                              : AppTheme.textSecondaryColor,
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Icon(
                        Icons.star,
                        size: 16,
                        color: Color(0xFFFFD700),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${module.pointsValue} points',
                        style: TextStyle(
                          fontSize: 14,
                          color: isDarkMode
                              ? AppTheme.darkTextSecondaryColor
                              : AppTheme.textSecondaryColor,
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Icon(
                        Icons.people,
                        size: 16,
                        color: AppTheme.textSecondaryColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${10 + (index * 5)} users',
                        style: TextStyle(
                          fontSize: 14,
                          color: isDarkMode
                              ? AppTheme.darkTextSecondaryColor
                              : AppTheme.textSecondaryColor,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  // Module actions
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            // TODO: Navigate to module edit screen
                          },
                          icon: const Icon(Icons.edit),
                          label: const Text('Edit'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppTheme.primaryColor,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _deleteModule(module),
                          icon: const Icon(Icons.delete),
                          label: const Text('Delete'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppTheme.errorColor,
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
  }
  
  Widget _buildCreateModuleTab() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Create New Module',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: isDarkMode
                  ? AppTheme.darkTextPrimaryColor
                  : AppTheme.textPrimaryColor,
            ),
          ),
          const SizedBox(height: 24),
          
          // Module form
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: isDarkMode ? AppTheme.darkSurfaceColor : Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  offset: const Offset(0, 2),
                  blurRadius: 10,
                ),
              ],
            ),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Image upload
                  Container(
                    height: 150,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: isDarkMode
                          ? Colors.grey.shade800
                          : Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isDarkMode
                            ? Colors.grey.shade700
                            : Colors.grey.shade300,
                        width: 2,
                        style: BorderStyle.solid,
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.image,
                          size: 48,
                          color: AppTheme.primaryColor,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Upload module cover image',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: isDarkMode
                                ? AppTheme.darkTextPrimaryColor
                                : AppTheme.textPrimaryColor,
                          ),
                        ),
                        const SizedBox(height: 8),
                        ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                          ),
                          child: const Text('Browse Image'),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Title field
                  TextFormField(
                    controller: _titleController,
                    decoration: const InputDecoration(
                      labelText: 'Module Title',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a title';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  
                  // Description field
                  TextFormField(
                    controller: _descriptionController,
                    decoration: const InputDecoration(
                      labelText: 'Description',
                      border: OutlineInputBorder(),
                      alignLabelWithHint: true,
                    ),
                    maxLines: 3,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a description';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  
                  // Category dropdown
                  DropdownButtonFormField<String>(
                    decoration: const InputDecoration(
                      labelText: 'Category',
                      border: OutlineInputBorder(),
                    ),
                    value: _selectedCategory,
                    items: _categories.map((category) {
                      return DropdownMenuItem<String>(
                        value: category,
                        child: Text(category),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedCategory = value;
                      });
                    },
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please select a category';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  
                  // Difficulty dropdown
                  DropdownButtonFormField<String>(
                    decoration: const InputDecoration(
                      labelText: 'Difficulty',
                      border: OutlineInputBorder(),
                    ),
                    value: _selectedDifficulty,
                    items: _difficulties.map((difficulty) {
                      return DropdownMenuItem<String>(
                        value: difficulty,
                        child: Text(difficulty),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedDifficulty = value;
                      });
                    },
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please select a difficulty level';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  
                  // Points value
                  Text(
                    'Points Value',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: isDarkMode
                          ? AppTheme.darkTextPrimaryColor
                          : AppTheme.textPrimaryColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: Slider(
                          value: 100,
                          min: 50,
                          max: 300,
                          divisions: 5,
                          label: '100 points',
                          onChanged: (value) {},
                          activeColor: AppTheme.primaryColor,
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
                        child: const Row(
                          children: [
                            Icon(
                              Icons.star,
                              color: Color(0xFFFFD700),
                              size: 18,
                            ),
                            SizedBox(width: 4),
                            Text(
                              '100 points',
                              style: TextStyle(
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
                  const SizedBox(height: 24),
                  
                  // Submit button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _createModule,
                      icon: const Icon(Icons.add),
                      label: const Text('Create Module'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildStatColumn(
    BuildContext context,
    String label,
    String value,
    IconData icon,
  ) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: isDarkMode ? AppTheme.darkSurfaceColor : Colors.white,
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
  
  Color _getDifficultyColor(String difficulty) {
    switch (difficulty) {
      case 'Beginner':
        return Colors.green;
      case 'Intermediate':
        return Colors.orange;
      case 'Advanced':
        return Colors.red;
      default:
        return Colors.blue;
    }
  }
} 