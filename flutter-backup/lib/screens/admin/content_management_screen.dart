import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/app_logo.dart';

class ContentManagementScreen extends StatefulWidget {
  const ContentManagementScreen({super.key});

  @override
  State<ContentManagementScreen> createState() =>
      _ContentManagementScreenState();
}

class _ContentManagementScreenState extends State<ContentManagementScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  final bool _isLoading = false;
  String _searchQuery = '';
  String _selectedCategory = 'All';

  final List<ContentItem> _contentItems = [
    ContentItem(
      id: '1',
      name: 'Safety Training Video.mp4',
      type: ContentType.video,
      category: 'Safety',
      size: '45.2 MB',
      uploadDate: DateTime.now().subtract(const Duration(days: 2)),
      url: 'https://example.com/safety-video.mp4',
      thumbnailUrl:
          'https://images.unsplash.com/photo-1606791405792-1c6834ac8c93?w=300&h=200&fit=crop',
    ),
    ContentItem(
      id: '2',
      name: 'Service Excellence Guide.pdf',
      type: ContentType.document,
      category: 'Service',
      size: '2.1 MB',
      uploadDate: DateTime.now().subtract(const Duration(days: 5)),
      url: 'https://example.com/service-guide.pdf',
    ),
    ContentItem(
      id: '3',
      name: 'Course Hero Image.png',
      type: ContentType.image,
      category: 'Design',
      size: '1.5 MB',
      uploadDate: DateTime.now().subtract(const Duration(days: 1)),
      url:
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
      thumbnailUrl:
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
    ),
  ];

  final List<String> _categories = [
    'All',
    'Safety',
    'Service',
    'Compliance',
    'Design',
    'Technology'
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<ContentItem> get _filteredContent {
    return _contentItems.where((item) {
      final matchesSearch =
          item.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
              item.category.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesCategory =
          _selectedCategory == 'All' || item.category == _selectedCategory;
      return matchesSearch && matchesCategory;
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
            const Text('Content Management'),
          ],
        ),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(icon: Icon(Icons.folder), text: 'Media Library'),
            Tab(icon: Icon(Icons.upload), text: 'Upload'),
            Tab(icon: Icon(Icons.category), text: 'Categories'),
            Tab(icon: Icon(Icons.settings), text: 'Settings'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildMediaLibraryTab(),
          _buildUploadTab(),
          _buildCategoriesTab(),
          _buildSettingsTab(),
        ],
      ),
    );
  }

  Widget _buildMediaLibraryTab() {
    return Column(
      children: [
        // Search and filter bar
        _buildSearchAndFilters(),

        // Content grid
        Expanded(
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _filteredContent.isEmpty
                  ? _buildEmptyState()
                  : GridView.builder(
                      padding: const EdgeInsets.all(16),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.8,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      itemCount: _filteredContent.length,
                      itemBuilder: (context, index) {
                        return _buildContentCard(_filteredContent[index]);
                      },
                    ),
        ),
      ],
    );
  }

  Widget _buildSearchAndFilters() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.all(16),
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
          TextField(
            onChanged: (value) {
              setState(() {
                _searchQuery = value;
              });
            },
            decoration: InputDecoration(
              hintText: 'Search content...',
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
          Row(
            children: [
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
                      child: Text(category),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedCategory = value!;
                    });
                  },
                ),
              ),
              const SizedBox(width: 16),
              ElevatedButton.icon(
                onPressed: _showBulkActions,
                icon: Icon(Icons.checklist),
                label: const Text('Bulk Actions'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildContentCard(ContentItem item) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
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
          // Thumbnail/Preview
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
                color: Colors.grey[200],
              ),
              child: Stack(
                children: [
                  _buildContentPreview(item),

                  // Type indicator
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getContentTypeColor(item.type)
                            .withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            _getContentTypeIcon(item.type),
                            size: 12,
                            color: Colors.white,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _getContentTypeText(item.type),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Actions
                  Positioned(
                    top: 8,
                    right: 8,
                    child: PopupMenuButton<String>(
                      icon: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.6),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Icon(Icons.more_vert,
                            color: Colors.white, size: 16),
                      ),
                      onSelected: (value) => _handleContentAction(value, item),
                      itemBuilder: (context) => [
                        const PopupMenuItem(value: 'view', child: Text('View')),
                        const PopupMenuItem(
                            value: 'download', child: Text('Download')),
                        const PopupMenuItem(value: 'edit', child: Text('Edit')),
                        const PopupMenuItem(
                            value: 'delete', child: Text('Delete')),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Content info
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.name,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isDarkMode
                        ? AppTheme.darkTextPrimaryColor
                        : AppTheme.textPrimaryColor,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  item.category,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.primaryColor,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      item.size,
                      style: TextStyle(
                        fontSize: 11,
                        color: isDarkMode
                            ? AppTheme.darkTextSecondaryColor
                            : AppTheme.textSecondaryColor,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      _formatDate(item.uploadDate),
                      style: TextStyle(
                        fontSize: 11,
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
        ],
      ),
    );
  }

  Widget _buildContentPreview(ContentItem item) {
    switch (item.type) {
      case ContentType.image:
        return ClipRRect(
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(16),
            topRight: Radius.circular(16),
          ),
          child: _buildPlaceholderPreview(item.type),
        );
      case ContentType.video:
        return Stack(
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
              child: _buildPlaceholderPreview(item.type),
            ),
            const Center(
              child: Icon(
                Icons.play_circle_filled,
                size: 48,
                color: Colors.white,
              ),
            ),
          ],
        );
      default:
        return _buildPlaceholderPreview(item.type);
    }
  }

  Widget _buildPlaceholderPreview(ContentType type) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            _getContentTypeColor(type).withValues(alpha: 0.8),
            _getContentTypeColor(type).withValues(alpha: 0.6),
          ],
        ),
      ),
      child: Center(
        child: Icon(
          _getContentTypeIcon(type),
          size: 48,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildUploadTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildUploadCard('Upload Images', Icons.image,
              'PNG, JPG, GIF up to 10MB', () => _showUploadDialog('image')),
          const SizedBox(height: 16),
          _buildUploadCard('Upload Videos', Icons.video_library,
              'MP4, AVI, MOV up to 100MB', () => _showUploadDialog('video')),
          const SizedBox(height: 16),
          _buildUploadCard('Upload Documents', Icons.description,
              'PDF, DOC, PPT up to 50MB', () => _showUploadDialog('document')),
          const SizedBox(height: 16),
          _buildUploadCard('Bulk Upload', Icons.cloud_upload,
              'Upload multiple files at once', _showBulkUploadDialog),
        ],
      ),
    );
  }

  Widget _buildUploadCard(
      String title, IconData icon, String description, VoidCallback onTap) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border:
              Border.all(color: AppTheme.primaryColor.withValues(alpha: 0.2)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              offset: const Offset(0, 2),
              blurRadius: 10,
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                size: 32,
                color: AppTheme.primaryColor,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isDarkMode
                          ? AppTheme.darkTextPrimaryColor
                          : AppTheme.textPrimaryColor,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 14,
                      color: isDarkMode
                          ? AppTheme.darkTextSecondaryColor
                          : AppTheme.textSecondaryColor,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios, size: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoriesTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildSectionHeader('Content Categories', 'Organize your content'),
          const SizedBox(height: 16),
          ..._categories
              .where((c) => c != 'All')
              .map((category) => _buildCategoryCard(category)),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: _showAddCategoryDialog,
            icon: Icon(Icons.add),
            label: const Text('Add New Category'),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard(String category) {
    final count =
        _contentItems.where((item) => item.category == category).length;
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, 2),
            blurRadius: 10,
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              Icons.folder,
              color: AppTheme.primaryColor,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  category,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isDarkMode
                        ? AppTheme.darkTextPrimaryColor
                        : AppTheme.textPrimaryColor,
                  ),
                ),
                Text(
                  '$count items',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDarkMode
                        ? AppTheme.darkTextSecondaryColor
                        : AppTheme.textSecondaryColor,
                  ),
                ),
              ],
            ),
          ),
          PopupMenuButton<String>(
            onSelected: (value) => _handleCategoryAction(value, category),
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'edit', child: Text('Edit')),
              const PopupMenuItem(value: 'delete', child: Text('Delete')),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildSectionHeader(
              'Storage Settings', 'Manage your content storage'),
          const SizedBox(height: 16),
          _buildSettingCard(
              'Storage Used', '2.4 GB of 10 GB', Icons.storage, () {}),
          _buildSettingCard('Auto-compress Images', 'Optimize images on upload',
              Icons.compress, () {}),
          _buildSettingCard('Backup Settings', 'Automatic content backup',
              Icons.backup, () {}),
          const SizedBox(height: 24),
          _buildSectionHeader('Content Policies', 'Set content guidelines'),
          const SizedBox(height: 16),
          _buildSettingCard('File Size Limits', 'Set maximum file sizes',
              Icons.file_copy, () {}),
          _buildSettingCard('Allowed Formats', 'Configure file types',
              Icons.checklist, () {}),
          _buildSettingCard('Content Moderation', 'Review and approval',
              Icons.verified_user, () {}),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, String subtitle) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: isDarkMode
                ? AppTheme.darkTextPrimaryColor
                : AppTheme.textPrimaryColor,
          ),
        ),
        Text(
          subtitle,
          style: TextStyle(
            fontSize: 14,
            color: isDarkMode
                ? AppTheme.darkTextSecondaryColor
                : AppTheme.textSecondaryColor,
          ),
        ),
      ],
    );
  }

  Widget _buildSettingCard(
      String title, String subtitle, IconData icon, VoidCallback onTap) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppTheme.primaryColor.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: AppTheme.primaryColor),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: isDarkMode
                ? AppTheme.darkTextPrimaryColor
                : AppTheme.textPrimaryColor,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(
            color: isDarkMode
                ? AppTheme.darkTextSecondaryColor
                : AppTheme.textSecondaryColor,
          ),
        ),
        trailing: Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
        tileColor: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.folder_open,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'No content found',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Upload your first file to get started',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[500],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => _tabController.animateTo(1),
            icon: Icon(Icons.upload),
            label: const Text('Upload Content'),
          ),
        ],
      ),
    );
  }

  // Utility methods
  Color _getContentTypeColor(ContentType type) {
    switch (type) {
      case ContentType.image:
        return Colors.blue;
      case ContentType.video:
        return Colors.red;
      case ContentType.document:
        return Colors.green;
      case ContentType.audio:
        return Colors.purple;
    }
  }

  IconData _getContentTypeIcon(ContentType type) {
    switch (type) {
      case ContentType.image:
        return Icons.image;
      case ContentType.video:
        return Icons.video_library;
      case ContentType.document:
        return Icons.description;
      case ContentType.audio:
        return Icons.audiotrack;
    }
  }

  String _getContentTypeText(ContentType type) {
    switch (type) {
      case ContentType.image:
        return 'IMAGE';
      case ContentType.video:
        return 'VIDEO';
      case ContentType.document:
        return 'DOC';
      case ContentType.audio:
        return 'AUDIO';
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date).inDays;

    if (difference == 0) {
      return 'Today';
    } else if (difference == 1) {
      return 'Yesterday';
    } else if (difference < 7) {
      return '${difference}d ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }

  // Action methods
  void _handleContentAction(String action, ContentItem item) {
    switch (action) {
      case 'view':
        _viewContent(item);
        break;
      case 'download':
        _downloadContent(item);
        break;
      case 'edit':
        _editContent(item);
        break;
      case 'delete':
        _deleteContent(item);
        break;
    }
  }

  void _viewContent(ContentItem item) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        child: Container(
          padding: const EdgeInsets.all(20),
          constraints: const BoxConstraints(maxWidth: 500, maxHeight: 600),
          child: Column(
            children: [
              Text(
                item.name,
                style:
                    const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: _buildContentPreview(item),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close'),
                  ),
                  ElevatedButton(
                    onPressed: () => _downloadContent(item),
                    child: const Text('Download'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _downloadContent(ContentItem item) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Downloading ${item.name}...')),
    );
  }

  void _editContent(ContentItem item) {
    // Show edit dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Edit Content'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: const InputDecoration(labelText: 'Name'),
              controller: TextEditingController(text: item.name),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: item.category,
              decoration: const InputDecoration(labelText: 'Category'),
              items: _categories.where((c) => c != 'All').map((category) {
                return DropdownMenuItem(value: category, child: Text(category));
              }).toList(),
              onChanged: (value) {},
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Content updated successfully')),
              );
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _deleteContent(ContentItem item) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Content'),
        content: Text('Are you sure you want to delete "${item.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _contentItems.removeWhere((i) => i.id == item.id);
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Content deleted successfully')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _handleCategoryAction(String action, String category) {
    if (action == 'edit') {
      _showEditCategoryDialog(category);
    } else if (action == 'delete') {
      _showDeleteCategoryDialog(category);
    }
  }

  void _showUploadDialog(String type) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Upload ${type.toUpperCase()}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              height: 100,
              width: double.infinity,
              decoration: BoxDecoration(
                border:
                    Border.all(color: Colors.grey, style: BorderStyle.solid),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Center(
                child: Text('Drag & drop files here or click to browse'),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {},
              icon: Icon(Icons.folder),
              label: const Text('Browse Files'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Upload feature coming soon!')),
              );
            },
            child: const Text('Upload'),
          ),
        ],
      ),
    );
  }

  void _showBulkUploadDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Bulk Upload'),
        content: const Text('Select multiple files to upload at once'),
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
            child: const Text('Select Files'),
          ),
        ],
      ),
    );
  }

  void _showBulkActions() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Bulk Actions'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: Icon(Icons.delete),
              title: const Text('Delete Selected'),
              onTap: () {},
            ),
            ListTile(
              leading: Icon(Icons.folder),
              title: const Text('Move to Category'),
              onTap: () {},
            ),
            ListTile(
              leading: Icon(Icons.download),
              title: const Text('Download Selected'),
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }

  void _showAddCategoryDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Category'),
        content: const TextField(
          decoration: InputDecoration(
            labelText: 'Category Name',
            hintText: 'Enter category name',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Category added successfully!')),
              );
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _showEditCategoryDialog(String category) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Edit Category'),
        content: TextField(
          decoration: const InputDecoration(labelText: 'Category Name'),
          controller: TextEditingController(text: category),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Category updated successfully!')),
              );
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showDeleteCategoryDialog(String category) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Category'),
        content: Text('Are you sure you want to delete "$category"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Category deleted successfully!')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}

// Models
class ContentItem {
  final String id;
  final String name;
  final ContentType type;
  final String category;
  final String size;
  final DateTime uploadDate;
  final String url;
  final String? thumbnailUrl;

  ContentItem({
    required this.id,
    required this.name,
    required this.type,
    required this.category,
    required this.size,
    required this.uploadDate,
    required this.url,
    this.thumbnailUrl,
  });
}

enum ContentType {
  image,
  video,
  document,
  audio,
}
