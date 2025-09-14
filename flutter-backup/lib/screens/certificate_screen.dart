import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';

class CertificateScreen extends StatefulWidget {
  const CertificateScreen({super.key});

  @override
  State<CertificateScreen> createState() => _CertificateScreenState();
}

class _CertificateScreenState extends State<CertificateScreen> {
  final List<Certificate> _certificates = [
    Certificate(
      id: '1',
      title: 'Customer Service Excellence',
      description: 'Completed advanced customer service training program',
      issueDate: DateTime(2024, 1, 15),
      completionPercentage: 100,
      badgeColor: Colors.blue,
      icon: Icons.support_agent,
    ),
    Certificate(
      id: '2',
      title: 'Safety and Compliance',
      description: 'Workplace safety and regulatory compliance certification',
      issueDate: DateTime(2024, 2, 20),
      completionPercentage: 100,
      badgeColor: Colors.red,
      icon: Icons.security,
    ),
    Certificate(
      id: '3',
      title: 'Leadership Fundamentals',
      description: 'Basic leadership and team management skills',
      issueDate: DateTime(2024, 3, 10),
      completionPercentage: 95,
      badgeColor: Colors.purple,
      icon: Icons.groups,
    ),
    Certificate(
      id: '4',
      title: 'Digital Marketing Basics',
      description: 'Introduction to digital marketing strategies',
      issueDate: null,
      completionPercentage: 75,
      badgeColor: Colors.orange,
      icon: Icons.campaign,
    ),
    Certificate(
      id: '5',
      title: 'Data Analytics',
      description: 'Data analysis and reporting fundamentals',
      issueDate: null,
      completionPercentage: 40,
      badgeColor: Colors.green,
      icon: Icons.analytics,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final earnedCertificates =
        _certificates.where((c) => c.issueDate != null).toList();
    final inProgressCertificates =
        _certificates.where((c) => c.issueDate == null).toList();

    return Scaffold(
      backgroundColor:
          isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: isDarkMode ? const Color(0xFF1E293B) : Colors.white,
        elevation: 0,
        title: const Text(
          'Certificates',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            onPressed: () {
              _showFilterOptions(context);
            },
            icon: Icon(Icons.filter_list),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Stats
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24.0),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primaryColor, Color(0xFF8B5CF6)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primaryColor.withValues(alpha: 0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Icon(
                    Icons.workspace_premium,
                    size: 64,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Your Achievements',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${earnedCertificates.length} certificates earned',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white.withValues(alpha: 0.9),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildStatItem(
                          'Completed', '${earnedCertificates.length}'),
                      _buildStatItem(
                          'In Progress', '${inProgressCertificates.length}'),
                      _buildStatItem('Total Points', '2,150'),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Earned Certificates Section
            if (earnedCertificates.isNotEmpty) ...[
              Text(
                'Earned Certificates',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isDarkMode ? Colors.white : Colors.black87,
                ),
              ),
              const SizedBox(height: 16),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: earnedCertificates.length,
                itemBuilder: (context, index) {
                  return _buildCertificateCard(
                      earnedCertificates[index], isDarkMode, true);
                },
              ),
              const SizedBox(height: 32),
            ],

            // In Progress Section
            if (inProgressCertificates.isNotEmpty) ...[
              Text(
                'In Progress',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isDarkMode ? Colors.white : Colors.black87,
                ),
              ),
              const SizedBox(height: 16),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: inProgressCertificates.length,
                itemBuilder: (context, index) {
                  return _buildCertificateCard(
                      inProgressCertificates[index], isDarkMode, false);
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.white.withValues(alpha: 0.8),
          ),
        ),
      ],
    );
  }

  Widget _buildCertificateCard(
      Certificate certificate, bool isDarkMode, bool isEarned) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () {
          if (isEarned) {
            _showCertificateDetails(certificate);
          } else {
            _showProgressDetails(certificate);
          }
        },
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: isDarkMode ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: isEarned
                ? Border.all(
                    color: certificate.badgeColor.withValues(alpha: 0.3),
                    width: 2)
                : null,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              // Icon Badge
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: certificate.badgeColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  certificate.icon,
                  color: certificate.badgeColor,
                  size: 28,
                ),
              ),

              const SizedBox(width: 16),

              // Certificate Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      certificate.title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: isDarkMode ? Colors.white : Colors.black87,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      certificate.description,
                      style: TextStyle(
                        fontSize: 14,
                        color: isDarkMode ? Colors.grey[400] : Colors.grey[600],
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                    if (isEarned) ...[
                      // Earned date
                      Row(
                        children: [
                          Icon(
                            Icons.event,
                            size: 16,
                            color: isDarkMode
                                ? Colors.grey[500]
                                : Colors.grey[500],
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Earned ${_formatDate(certificate.issueDate!)}',
                            style: TextStyle(
                              fontSize: 12,
                              color: isDarkMode
                                  ? Colors.grey[500]
                                  : Colors.grey[500],
                            ),
                          ),
                        ],
                      ),
                    ] else ...[
                      // Progress bar
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${certificate.completionPercentage}% Complete',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: certificate.badgeColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          LinearProgressIndicator(
                            value: certificate.completionPercentage / 100,
                            backgroundColor: isDarkMode
                                ? Colors.grey[700]
                                : Colors.grey[200],
                            valueColor: AlwaysStoppedAnimation<Color>(
                                certificate.badgeColor),
                            minHeight: 6,
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),

              // Action Button
              Column(
                children: [
                  if (isEarned) ...[
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.green.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        Icons.verified,
                        color: Colors.green,
                        size: 20,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Download',
                      style: TextStyle(
                        fontSize: 12,
                        color: isDarkMode ? Colors.grey[400] : Colors.grey[600],
                      ),
                    ),
                  ] else ...[
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: certificate.badgeColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        Icons.arrow_forward,
                        color: certificate.badgeColor,
                        size: 20,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Continue',
                      style: TextStyle(
                        fontSize: 12,
                        color: isDarkMode ? Colors.grey[400] : Colors.grey[600],
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }

  void _showCertificateDetails(Certificate certificate) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          child: Container(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Certificate Icon
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: certificate.badgeColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(
                    certificate.icon,
                    color: certificate.badgeColor,
                    size: 40,
                  ),
                ),
                const SizedBox(height: 20),

                // Certificate Title
                Text(
                  certificate.title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),

                // Description
                Text(
                  certificate.description,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),

                // Issue Date
                Text(
                  'Issued on ${_formatDate(certificate.issueDate!)}',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
                const SizedBox(height: 24),

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          Navigator.of(context).pop();
                          _shareCertificate(certificate);
                        },
                        icon: Icon(Icons.share),
                        label: const Text('Share'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.of(context).pop();
                          _downloadCertificate(certificate);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryColor,
                          foregroundColor: Colors.white,
                        ),
                        icon: Icon(Icons.download),
                        label: const Text('Download'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showProgressDetails(Certificate certificate) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          child: Container(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Progress Icon
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: certificate.badgeColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(
                    certificate.icon,
                    color: certificate.badgeColor,
                    size: 40,
                  ),
                ),
                const SizedBox(height: 20),

                // Course Title
                Text(
                  certificate.title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),

                // Description
                Text(
                  certificate.description,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 20),

                // Progress Info
                Text(
                  '${certificate.completionPercentage}% Complete',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: certificate.badgeColor,
                  ),
                ),
                const SizedBox(height: 12),

                LinearProgressIndicator(
                  value: certificate.completionPercentage / 100,
                  backgroundColor: Colors.grey[200],
                  valueColor:
                      AlwaysStoppedAnimation<Color>(certificate.badgeColor),
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(4),
                ),
                const SizedBox(height: 24),

                // Action Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.of(context).pop();
                      _continueCourse(certificate);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    icon: Icon(Icons.play_arrow),
                    label: const Text('Continue Learning'),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showFilterOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Filter Certificates',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              ListTile(
                leading: Icon(Icons.all_inclusive),
                title: const Text('All Certificates'),
                onTap: () => Navigator.pop(context),
              ),
              ListTile(
                leading: Icon(Icons.verified),
                title: const Text('Earned Only'),
                onTap: () => Navigator.pop(context),
              ),
              ListTile(
                leading: Icon(Icons.schedule),
                title: const Text('In Progress Only'),
                onTap: () => Navigator.pop(context),
              ),
              ListTile(
                leading: Icon(Icons.sort),
                title: const Text('Sort by Date'),
                onTap: () => Navigator.pop(context),
              ),
            ],
          ),
        );
      },
    );
  }

  void _downloadCertificate(Certificate certificate) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Downloading ${certificate.title} certificate...'),
        backgroundColor: AppTheme.primaryColor,
      ),
    );
  }

  void _shareCertificate(Certificate certificate) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Sharing ${certificate.title} certificate...'),
        backgroundColor: AppTheme.primaryColor,
      ),
    );
  }

  void _continueCourse(Certificate certificate) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Opening ${certificate.title} course...'),
        backgroundColor: AppTheme.primaryColor,
      ),
    );
  }
}

class Certificate {
  final String id;
  final String title;
  final String description;
  final DateTime? issueDate;
  final int completionPercentage;
  final Color badgeColor;
  final IconData icon;

  Certificate({
    required this.id,
    required this.title,
    required this.description,
    this.issueDate,
    required this.completionPercentage,
    required this.badgeColor,
    required this.icon,
  });
}
