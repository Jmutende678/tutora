import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/app_logo.dart';

class NotificationCenterScreen extends StatefulWidget {
  const NotificationCenterScreen({super.key});

  @override
  State<NotificationCenterScreen> createState() =>
      _NotificationCenterScreenState();
}

class _NotificationCenterScreenState extends State<NotificationCenterScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  final bool _isLoading = false;
  String _searchQuery = '';
  NotificationFilter _currentFilter = NotificationFilter.all;

  final List<AdminNotification> _notifications = [
    AdminNotification(
      id: '1',
      title: 'System Maintenance Scheduled',
      message:
          'Scheduled maintenance will occur on March 15, 2024 from 2:00 AM to 4:00 AM EST.',
      type: NotificationType.system,
      priority: NotificationPriority.high,
      timestamp: DateTime.now().subtract(const Duration(hours: 2)),
      isRead: false,
      actionRequired: true,
    ),
    AdminNotification(
      id: '2',
      title: 'New User Registration Spike',
      message:
          '147 new users registered in the last 24 hours. Consider reviewing server capacity.',
      type: NotificationType.userActivity,
      priority: NotificationPriority.medium,
      timestamp: DateTime.now().subtract(const Duration(hours: 4)),
      isRead: false,
      actionRequired: false,
    ),
    AdminNotification(
      id: '3',
      title: 'Module Completion Rate Drop',
      message:
          'Safety Training module completion rate dropped to 65% this week.',
      type: NotificationType.analytics,
      priority: NotificationPriority.medium,
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
      isRead: true,
      actionRequired: true,
    ),
    AdminNotification(
      id: '4',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected from IP: 192.168.1.100',
      type: NotificationType.security,
      priority: NotificationPriority.critical,
      timestamp: DateTime.now().subtract(const Duration(minutes: 30)),
      isRead: false,
      actionRequired: true,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<AdminNotification> get _filteredNotifications {
    return _notifications.where((notification) {
      final matchesSearch = notification.title
              .toLowerCase()
              .contains(_searchQuery.toLowerCase()) ||
          notification.message
              .toLowerCase()
              .contains(_searchQuery.toLowerCase());

      final matchesFilter = _currentFilter == NotificationFilter.all ||
          (_currentFilter == NotificationFilter.unread &&
              !notification.isRead) ||
          (_currentFilter == NotificationFilter.actionRequired &&
              notification.actionRequired) ||
          (_currentFilter == NotificationFilter.critical &&
              notification.priority == NotificationPriority.critical);

      return matchesSearch && matchesFilter;
    }).toList();
  }

  int get _unreadCount {
    return _notifications.where((n) => !n.isRead).length;
  }

  int get _actionRequiredCount {
    return _notifications.where((n) => n.actionRequired && !n.isRead).length;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            AppLogo.getIconOnly(size: 24),
            const SizedBox(width: 12),
            const Text('Notification Center'),
            if (_unreadCount > 0) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  _unreadCount.toString(),
                  style: const TextStyle(color: Colors.white, fontSize: 12),
                ),
              ),
            ],
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.mark_email_read),
            onPressed: _markAllAsRead,
            tooltip: 'Mark all as read',
          ),
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: _showNotificationSettings,
            tooltip: 'Notification settings',
          ),
          PopupMenuButton<String>(
            onSelected: _handleMenuAction,
            itemBuilder: (context) => [
              const PopupMenuItem(
                  value: 'create', child: Text('Create Announcement')),
              const PopupMenuItem(
                  value: 'schedule', child: Text('Schedule Notification')),
              const PopupMenuItem(value: 'export', child: Text('Export Logs')),
            ],
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(
              icon: Badge(
                label: _unreadCount > 0 ? Text(_unreadCount.toString()) : null,
                child: Icon(Icons.notifications),
              ),
              text: 'All Notifications',
            ),
            const Tab(icon: Icon(Icons.campaign), text: 'Announcements'),
            const Tab(icon: Icon(Icons.history), text: 'Activity Log'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildNotificationsTab(),
          _buildAnnouncementsTab(),
          _buildActivityLogTab(),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _createNotification,
        icon: Icon(Icons.add),
        label: const Text('New Alert'),
        backgroundColor: AppTheme.primaryColor,
      ),
    );
  }

  Widget _buildNotificationsTab() {
    return Column(
      children: [
        _buildSearchAndFilters(),
        _buildQuickStats(),
        Expanded(
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _filteredNotifications.isEmpty
                  ? _buildEmptyState()
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _filteredNotifications.length,
                      itemBuilder: (context, index) {
                        return _buildNotificationCard(
                            _filteredNotifications[index]);
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
              hintText: 'Search notifications...',
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
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: NotificationFilter.values.map((filter) {
                return Container(
                  margin: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(_getFilterText(filter)),
                    selected: _currentFilter == filter,
                    onSelected: (selected) {
                      setState(() {
                        _currentFilter = filter;
                      });
                    },
                    backgroundColor:
                        isDarkMode ? Colors.grey[800] : Colors.grey[100],
                    selectedColor: AppTheme.primaryColor.withValues(alpha: 0.2),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickStats() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, 2),
            blurRadius: 8,
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem('Unread', _unreadCount, Colors.blue),
          _buildStatItem(
              'Action Required', _actionRequiredCount, Colors.orange),
          _buildStatItem(
              'Critical',
              _notifications
                  .where((n) => n.priority == NotificationPriority.critical)
                  .length,
              Colors.red),
          _buildStatItem('Total', _notifications.length, Colors.grey),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, int count, Color color) {
    return Column(
      children: [
        Text(
          count.toString(),
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildNotificationCard(AdminNotification notification) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: notification.isRead
              ? Colors.transparent
              : _getPriorityColor(notification.priority).withValues(alpha: 0.3),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, 2),
            blurRadius: 8,
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: _getTypeColor(notification.type).withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            _getTypeIcon(notification.type),
            color: _getTypeColor(notification.type),
            size: 20,
          ),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                notification.title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight:
                      notification.isRead ? FontWeight.normal : FontWeight.bold,
                  color: isDarkMode
                      ? AppTheme.darkTextPrimaryColor
                      : AppTheme.textPrimaryColor,
                ),
              ),
            ),
            _buildPriorityBadge(notification.priority),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),
            Text(
              notification.message,
              style: TextStyle(
                fontSize: 14,
                color: isDarkMode
                    ? AppTheme.darkTextSecondaryColor
                    : AppTheme.textSecondaryColor,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.access_time,
                  size: 14,
                  color: Colors.grey[600],
                ),
                const SizedBox(width: 4),
                Text(
                  _formatTimestamp(notification.timestamp),
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                if (notification.actionRequired) ...[
                  const SizedBox(width: 12),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.orange.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      'Action Required',
                      style: TextStyle(
                        fontSize: 10,
                        color: Colors.orange,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
        trailing: PopupMenuButton<String>(
          onSelected: (value) => _handleNotificationAction(value, notification),
          itemBuilder: (context) => [
            PopupMenuItem(
              value: 'mark_read',
              child:
                  Text(notification.isRead ? 'Mark as Unread' : 'Mark as Read'),
            ),
            const PopupMenuItem(value: 'view', child: Text('View Details')),
            if (notification.actionRequired)
              const PopupMenuItem(value: 'action', child: Text('Take Action')),
            const PopupMenuItem(value: 'archive', child: Text('Archive')),
            const PopupMenuItem(value: 'delete', child: Text('Delete')),
          ],
        ),
        onTap: () => _viewNotificationDetails(notification),
      ),
    );
  }

  Widget _buildPriorityBadge(NotificationPriority priority) {
    Color color;
    String text;

    switch (priority) {
      case NotificationPriority.low:
        color = Colors.green;
        text = 'Low';
        break;
      case NotificationPriority.medium:
        color = Colors.orange;
        text = 'Medium';
        break;
      case NotificationPriority.high:
        color = Colors.red;
        text = 'High';
        break;
      case NotificationPriority.critical:
        color = Colors.red[900]!;
        text = 'Critical';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 10,
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildAnnouncementsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildAnnouncementCard(
            'Platform Update v2.1',
            'New features and improvements have been rolled out to all users.',
            DateTime.now().subtract(const Duration(days: 3)),
            true,
          ),
          _buildAnnouncementCard(
            'Holiday Schedule Notice',
            'Please note our modified support hours during the holiday season.',
            DateTime.now().subtract(const Duration(days: 7)),
            false,
          ),
          _buildAnnouncementCard(
            'New Training Modules Available',
            'Advanced Leadership and Team Management courses are now live.',
            DateTime.now().subtract(const Duration(days: 14)),
            false,
          ),
        ],
      ),
    );
  }

  Widget _buildAnnouncementCard(
      String title, String content, DateTime date, bool isActive) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: isActive
            ? Border.all(color: AppTheme.primaryColor.withValues(alpha: 0.3))
            : null,
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
          Row(
            children: [
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isDarkMode
                        ? AppTheme.darkTextPrimaryColor
                        : AppTheme.textPrimaryColor,
                  ),
                ),
              ),
              if (isActive)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'Active',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.green,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: TextStyle(
              fontSize: 14,
              color: isDarkMode
                  ? AppTheme.darkTextSecondaryColor
                  : AppTheme.textSecondaryColor,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(Icons.calendar_today, size: 14, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Text(
                _formatDate(date),
                style: TextStyle(fontSize: 12, color: Colors.grey[600]),
              ),
              const Spacer(),
              TextButton.icon(
                onPressed: () {},
                icon: Icon(Icons.edit, size: 16),
                label: const Text('Edit'),
              ),
              TextButton.icon(
                onPressed: () {},
                icon: Icon(Icons.visibility, size: 16),
                label: const Text('View'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActivityLogTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildLogEntry(
              'User Management',
              'Admin John Doe created new user account for Sarah Wilson',
              DateTime.now().subtract(const Duration(minutes: 15))),
          _buildLogEntry(
              'Module Update',
              'Safety Training module was updated with new content',
              DateTime.now().subtract(const Duration(minutes: 45))),
          _buildLogEntry(
              'System Alert',
              'Automated backup completed successfully',
              DateTime.now().subtract(const Duration(hours: 2))),
          _buildLogEntry(
              'Security',
              'Failed login attempt blocked from IP 192.168.1.50',
              DateTime.now().subtract(const Duration(hours: 4))),
          _buildLogEntry(
              'Content Upload',
              'New training video uploaded: "Emergency Procedures"',
              DateTime.now().subtract(const Duration(hours: 6))),
        ],
      ),
    );
  }

  Widget _buildLogEntry(
      String category, String description, DateTime timestamp) {
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
            blurRadius: 8,
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
              Icons.history,
              color: AppTheme.primaryColor,
              size: 16,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  category,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.primaryColor,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 14,
                    color: isDarkMode
                        ? AppTheme.darkTextPrimaryColor
                        : AppTheme.textPrimaryColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _formatTimestamp(timestamp),
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_none,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'No notifications found',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'All caught up! Check back later for updates.',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }

  // Utility methods
  Color _getPriorityColor(NotificationPriority priority) {
    switch (priority) {
      case NotificationPriority.low:
        return Colors.green;
      case NotificationPriority.medium:
        return Colors.orange;
      case NotificationPriority.high:
        return Colors.red;
      case NotificationPriority.critical:
        return Colors.red[900]!;
    }
  }

  Color _getTypeColor(NotificationType type) {
    switch (type) {
      case NotificationType.system:
        return Colors.blue;
      case NotificationType.userActivity:
        return Colors.green;
      case NotificationType.security:
        return Colors.red;
      case NotificationType.analytics:
        return Colors.purple;
      case NotificationType.content:
        return Colors.orange;
    }
  }

  IconData _getTypeIcon(NotificationType type) {
    switch (type) {
      case NotificationType.system:
        return Icons.settings;
      case NotificationType.userActivity:
        return Icons.people;
      case NotificationType.security:
        return Icons.security;
      case NotificationType.analytics:
        return Icons.analytics;
      case NotificationType.content:
        return Icons.folder;
    }
  }

  String _getFilterText(NotificationFilter filter) {
    switch (filter) {
      case NotificationFilter.all:
        return 'All';
      case NotificationFilter.unread:
        return 'Unread';
      case NotificationFilter.actionRequired:
        return 'Action Required';
      case NotificationFilter.critical:
        return 'Critical';
    }
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${timestamp.day}/${timestamp.month}/${timestamp.year}';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  // Action methods
  void _markAllAsRead() {
    setState(() {
      for (var notification in _notifications) {
        notification.isRead = true;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('All notifications marked as read')),
    );
  }

  void _handleMenuAction(String action) {
    switch (action) {
      case 'create':
        _createAnnouncement();
        break;
      case 'schedule':
        _scheduleNotification();
        break;
      case 'export':
        _exportLogs();
        break;
    }
  }

  void _handleNotificationAction(
      String action, AdminNotification notification) {
    switch (action) {
      case 'mark_read':
        setState(() {
          notification.isRead = !notification.isRead;
        });
        break;
      case 'view':
        _viewNotificationDetails(notification);
        break;
      case 'action':
        _takeAction(notification);
        break;
      case 'archive':
        _archiveNotification(notification);
        break;
      case 'delete':
        _deleteNotification(notification);
        break;
    }
  }

  void _viewNotificationDetails(AdminNotification notification) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(notification.title),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(notification.message),
            const SizedBox(height: 16),
            Row(
              children: [
                const Text('Priority: ',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                _buildPriorityBadge(notification.priority),
              ],
            ),
            const SizedBox(height: 8),
            Text('Type: ${notification.type.toString().split('.').last}'),
            const SizedBox(height: 8),
            Text('Time: ${_formatTimestamp(notification.timestamp)}'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          if (notification.actionRequired)
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _takeAction(notification);
              },
              child: const Text('Take Action'),
            ),
        ],
      ),
    );
  }

  void _takeAction(AdminNotification notification) {
    // Implement specific actions based on notification type
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Taking action for: ${notification.title}')),
    );
  }

  void _archiveNotification(AdminNotification notification) {
    setState(() {
      _notifications.remove(notification);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Notification archived')),
    );
  }

  void _deleteNotification(AdminNotification notification) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Notification'),
        content:
            const Text('Are you sure you want to delete this notification?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _notifications.remove(notification);
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Notification deleted')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _createNotification() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Create New Alert'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const TextField(
              decoration: InputDecoration(labelText: 'Title'),
            ),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(labelText: 'Message'),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<NotificationPriority>(
              decoration: const InputDecoration(labelText: 'Priority'),
              items: NotificationPriority.values.map((priority) {
                return DropdownMenuItem(
                  value: priority,
                  child: Text(priority.toString().split('.').last),
                );
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
                const SnackBar(content: Text('Alert created successfully!')),
              );
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
  }

  void _createAnnouncement() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Create Announcement'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const TextField(
              decoration: InputDecoration(labelText: 'Title'),
            ),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(labelText: 'Content'),
              maxLines: 4,
            ),
            const SizedBox(height: 16),
            CheckboxListTile(
              title: const Text('Send as push notification'),
              value: false,
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
                const SnackBar(content: Text('Announcement created!')),
              );
            },
            child: const Text('Publish'),
          ),
        ],
      ),
    );
  }

  void _scheduleNotification() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
          content: Text('Schedule notification feature coming soon!')),
    );
  }

  void _exportLogs() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Exporting activity logs...')),
    );
  }

  void _showNotificationSettings() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Notification Settings'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SwitchListTile(
              title: const Text('Email Notifications'),
              value: true,
              onChanged: (value) {},
            ),
            SwitchListTile(
              title: const Text('Push Notifications'),
              value: true,
              onChanged: (value) {},
            ),
            SwitchListTile(
              title: const Text('Critical Alerts Only'),
              value: false,
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
                const SnackBar(content: Text('Settings saved!')),
              );
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}

// Models
class AdminNotification {
  final String id;
  final String title;
  final String message;
  final NotificationType type;
  final NotificationPriority priority;
  final DateTime timestamp;
  bool isRead;
  final bool actionRequired;

  AdminNotification({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.priority,
    required this.timestamp,
    required this.isRead,
    required this.actionRequired,
  });
}

enum NotificationType {
  system,
  userActivity,
  security,
  analytics,
  content,
}

enum NotificationPriority {
  low,
  medium,
  high,
  critical,
}

enum NotificationFilter {
  all,
  unread,
  actionRequired,
  critical,
}
