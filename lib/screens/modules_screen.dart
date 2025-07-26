import 'package:flutter/material.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/app_logo.dart';
import 'package:tutora/widgets/module_card.dart';
import 'package:tutora/screens/module_details_screen.dart';

class ModulesScreen extends StatefulWidget {
  const ModulesScreen({super.key});

  @override
  State<ModulesScreen> createState() => _ModulesScreenState();
}

class _ModulesScreenState extends State<ModulesScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  List<ModuleModel> _modules = [];
  bool _isLoading = false;
  String _searchQuery = '';
  String _selectedCategory = 'All';
  DifficultyLevel? _selectedDifficulty;

  final List<String> _categories = [
    'All',
    'Safety',
    'Service',
    'Compliance',
    'Soft Skills',
    'Technology'
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadModules();
  }

  @override
  void dispose() {
    _tabController.dispose();
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
          module.description.toLowerCase().contains(_searchQuery.toLowerCase());

      final matchesCategory =
          _selectedCategory == 'All' || module.category == _selectedCategory;

      final matchesDifficulty = _selectedDifficulty == null ||
          module.difficulty == _selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    }).toList();
  }

  List<ModuleModel> get _recommendedModules {
    return _modules
        .where((m) => m.status == ModuleStatus.notStarted)
        .take(3)
        .toList();
  }

  List<ModuleModel> get _inProgressModules {
    return _modules.where((m) => m.status == ModuleStatus.inProgress).toList();
  }

  List<ModuleModel> get _completedModules {
    return _modules.where((m) => m.status == ModuleStatus.completed).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDarkMode
          ? AppTheme.scaffoldBackgroundColorDark
          : const Color(0xFFFAFAFA),
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              floating: true,
              pinned: true,
              snap: false,
              backgroundColor:
                  isDarkMode ? AppTheme.cardColorDark : Colors.white,
              surfaceTintColor: Colors.transparent,
              foregroundColor: isDarkMode ? Colors.white : Colors.black87,
              elevation: 0,
              shadowColor: Colors.transparent,
              expandedHeight: 110,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  decoration: BoxDecoration(
                    color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
                  ),
                  child: SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              AppLogo.getSmallLogo(size: 28),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  'Learning Modules',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w700,
                                    color: isDarkMode
                                        ? Colors.white
                                        : const Color(0xFF1F2937),
                                    letterSpacing: -0.3,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              Container(
                                decoration: BoxDecoration(
                                  color: isDarkMode
                                      ? Colors.grey[800]
                                      : const Color(0xFFF8F9FA),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: IconButton(
                                  icon: Icon(
                                    Icons.search_rounded,
                                    color: isDarkMode
                                        ? Colors.white70
                                        : const Color(0xFF6B7280),
                                  ),
                                  onPressed: _showSearchDialog,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                decoration: BoxDecoration(
                                  color: isDarkMode
                                      ? Colors.grey[800]
                                      : const Color(0xFFF8F9FA),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: IconButton(
                                  icon: Icon(
                                    Icons.tune_rounded,
                                    color: isDarkMode
                                        ? Colors.white70
                                        : const Color(0xFF6B7280),
                                  ),
                                  onPressed: _showFilterDialog,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Discover and track your learning journey',
                            style: TextStyle(
                              fontSize: 14,
                              color: isDarkMode
                                  ? Colors.grey[400]
                                  : const Color(0xFF6B7280),
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
            SliverPersistentHeader(
              pinned: true,
              delegate: _SliverTabBarDelegate(
                TabBar(
                  controller: _tabController,
                  isScrollable: true,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  indicatorColor: AppTheme.primaryColor,
                  labelColor: AppTheme.primaryColor,
                  unselectedLabelColor:
                      isDarkMode ? Colors.grey[400] : const Color(0xFF9CA3AF),
                  indicatorWeight: 2,
                  dividerColor: Colors.transparent,
                  tabs: [
                    Tab(
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.explore, size: 16),
                            const SizedBox(width: 8),
                            const Text('Explore'),
                          ],
                        ),
                      ),
                    ),
                    Tab(
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.play_circle, size: 16),
                            const SizedBox(width: 8),
                            Text('In Progress (${_inProgressModules.length})'),
                          ],
                        ),
                      ),
                    ),
                    Tab(
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.check_circle, size: 16),
                            const SizedBox(width: 8),
                            Text('Completed (${_completedModules.length})'),
                          ],
                        ),
                      ),
                    ),
                    Tab(
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.star, size: 16),
                            const SizedBox(width: 8),
                            const Text('Recommended'),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ];
        },
        body: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : TabBarView(
                controller: _tabController,
                children: [
                  _buildExploreTab(),
                  _buildInProgressTab(),
                  _buildCompletedTab(),
                  _buildRecommendedTab(),
                ],
              ),
      ),
    );
  }

  Widget _buildExploreTab() {
    return RefreshIndicator(
      onRefresh: _loadModules,
      child: CustomScrollView(
        slivers: [
          // Quick Filters
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Categories',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Theme.of(context).brightness == Brightness.dark
                          ? Colors.white
                          : Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 40,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _categories.length,
                      itemBuilder: (context, index) {
                        final category = _categories[index];
                        final isSelected = _selectedCategory == category;
                        return Container(
                          margin: const EdgeInsets.only(right: 8),
                          child: FilterChip(
                            label: Text(category),
                            selected: isSelected,
                            onSelected: (selected) {
                              if (mounted) {
                                setState(() {
                                  _selectedCategory =
                                      selected ? category : 'All';
                                });
                              }
                            },
                            backgroundColor:
                                Theme.of(context).brightness == Brightness.dark
                                    ? Colors.grey[800]
                                    : Colors.grey[100],
                            selectedColor:
                                const Color(0xFF059669).withValues(alpha: 0.2),
                            checkmarkColor: const Color(0xFF059669),
                            labelStyle: TextStyle(
                              color: isSelected
                                  ? const Color(0xFF059669)
                                  : Theme.of(context).brightness ==
                                          Brightness.dark
                                      ? Colors.white
                                      : Colors.black87,
                              fontWeight: isSelected
                                  ? FontWeight.w600
                                  : FontWeight.normal,
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Modules Grid
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 1,
                childAspectRatio: 1.32, // 370/280
                mainAxisSpacing: 16,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final module = _filteredModules[index];
                  return ModuleCard(
                    module: module,
                    onTap: () => _openModuleDetails(module),
                  );
                },
                childCount: _filteredModules.length,
              ),
            ),
          ),

          // Bottom padding
          const SliverToBoxAdapter(
            child: SizedBox(height: 100),
          ),
        ],
      ),
    );
  }

  Widget _buildInProgressTab() {
    return _buildModulesList(_inProgressModules, 'No modules in progress');
  }

  Widget _buildCompletedTab() {
    return _buildModulesList(_completedModules, 'No completed modules');
  }

  Widget _buildRecommendedTab() {
    return _buildModulesList(
        _recommendedModules, 'No recommendations available');
  }

  Widget _buildModulesList(List<ModuleModel> modules, String emptyMessage) {
    if (modules.isEmpty) {
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
              emptyMessage,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadModules,
      child: CustomScrollView(
        slivers: [
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 1,
                childAspectRatio: 1.32, // 370/280
                mainAxisSpacing: 16,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final module = modules[index];
                  return ModuleCard(
                    module: module,
                    onTap: () => _openModuleDetails(module),
                  );
                },
                childCount: modules.length,
              ),
            ),
          ),
          const SliverToBoxAdapter(
            child: SizedBox(height: 100),
          ),
        ],
      ),
    );
  }

  void _showSearchDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Search Modules'),
        content: TextField(
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Enter search terms...',
            prefixIcon: Icon(Icons.search),
          ),
          onChanged: (value) {
            if (mounted) {
              setState(() {
                _searchQuery = value;
              });
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () {
              if (mounted) {
                setState(() {
                  _searchQuery = '';
                });
              }
              Navigator.pop(context);
            },
            child: const Text('Clear'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Modules'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Difficulty Level'),
            const SizedBox(height: 8),
            DropdownButton<DifficultyLevel?>(
              value: _selectedDifficulty,
              isExpanded: true,
              items: [
                const DropdownMenuItem(value: null, child: Text('All Levels')),
                ...DifficultyLevel.values.map(
                  (level) => DropdownMenuItem(
                    value: level,
                    child: Text(level.toString().split('.').last.toUpperCase()),
                  ),
                ),
              ],
              onChanged: (value) {
                if (mounted) {
                  setState(() {
                    _selectedDifficulty = value;
                  });
                }
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              if (mounted) {
                setState(() {
                  _selectedDifficulty = null;
                  _selectedCategory = 'All';
                });
              }
              Navigator.pop(context);
            },
            child: const Text('Clear All'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }

  void _openModuleDetails(ModuleModel module) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ModuleDetailsScreen(module: module),
      ),
    );
  }
}

class _SliverTabBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar tabBar;

  _SliverTabBarDelegate(this.tabBar);

  @override
  double get minExtent => tabBar.preferredSize.height;

  @override
  double get maxExtent => tabBar.preferredSize.height;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: Theme.of(context).brightness == Brightness.dark
          ? AppTheme.cardColorDark
          : Colors.white,
      child: tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverTabBarDelegate oldDelegate) {
    return false;
  }
}
