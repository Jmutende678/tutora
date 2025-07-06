import 'package:flutter/material.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/theme/app_theme.dart';

enum ContentType { introduction, keyConcepts, bestPractices, caseStudies }

class ModuleContentScreen extends StatefulWidget {
  final ModuleModel module;
  final ContentType contentType;

  const ModuleContentScreen({
    super.key,
    required this.module,
    required this.contentType,
  });

  @override
  State<ModuleContentScreen> createState() => _ModuleContentScreenState();
}

class _ModuleContentScreenState extends State<ModuleContentScreen> {
  PageController? _pageController;
  int _currentPage = 0;
  late List<ContentSection> _contentSections;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _loadContent();
  }

  @override
  void dispose() {
    _pageController?.dispose();
    super.dispose();
  }

  void _loadContent() {
    // Sample content - in a real app, this would come from a backend/database
    switch (widget.contentType) {
      case ContentType.introduction:
        _contentSections = [
          ContentSection(
            title: 'Welcome to ${widget.module.title}',
            type: SectionType.text,
            content: '''
Welcome to this comprehensive learning module. In this section, you'll discover the fundamentals and importance of ${widget.module.title}.

This module has been designed to provide you with practical knowledge and real-world applications that you can immediately implement in your work environment.
            ''',
          ),
          ContentSection(
            title: 'Learning Objectives',
            type: SectionType.bulletPoints,
            content: '''
• Understand the core principles of ${widget.module.title}
• Learn practical implementation strategies
• Develop problem-solving skills
• Apply knowledge to real-world scenarios
• Master best practices and techniques
            ''',
          ),
          ContentSection(
            title: 'Overview Video',
            type: SectionType.video,
            content: 'introduction_video.mp4',
          ),
        ];
        break;
      case ContentType.keyConcepts:
        _contentSections = [
          ContentSection(
            title: 'Core Principles',
            type: SectionType.text,
            content: '''
The fundamental concepts of ${widget.module.title} are built on several key principles that form the foundation of effective practice.

Understanding these principles will help you make informed decisions and implement solutions effectively.
            ''',
          ),
          ContentSection(
            title: 'Key Terms & Definitions',
            type: SectionType.bulletPoints,
            content: '''
• **Efficiency**: Maximizing output while minimizing resource consumption
• **Effectiveness**: Achieving desired outcomes and meeting objectives
• **Quality**: Meeting or exceeding standards and expectations
• **Innovation**: Implementing new ideas and creative solutions
• **Collaboration**: Working together towards common goals
            ''',
          ),
          ContentSection(
            title: 'Interactive Exercise',
            type: SectionType.interactive,
            content:
                'Complete the knowledge check below to test your understanding.',
          ),
        ];
        break;
      case ContentType.bestPractices:
        _contentSections = [
          ContentSection(
            title: 'Industry Standards',
            type: SectionType.text,
            content: '''
Following industry best practices ensures consistency, quality, and effectiveness in your work. These practices have been developed through years of experience and research.
            ''',
          ),
          ContentSection(
            title: 'Implementation Guidelines',
            type: SectionType.bulletPoints,
            content: '''
• Start with clear objectives and goals
• Develop a structured approach
• Document processes and procedures
• Regular monitoring and evaluation
• Continuous improvement mindset
• Stakeholder engagement and communication
            ''',
          ),
          ContentSection(
            title: 'Tools & Resources',
            type: SectionType.resources,
            content:
                'Access additional tools and templates to support your implementation.',
          ),
        ];
        break;
      case ContentType.caseStudies:
        _contentSections = [
          ContentSection(
            title: 'Real-World Application',
            type: SectionType.text,
            content: '''
Learn from real-world examples and see how the concepts from this module have been successfully applied in different organizations and situations.
            ''',
          ),
          ContentSection(
            title: 'Case Study 1: Success Story',
            type: SectionType.caseStudy,
            content: '''
**Company**: TechCorp Solutions
**Challenge**: Improving team productivity by 40%
**Solution**: Implementation of structured workflows and communication protocols
**Results**: Achieved 45% productivity increase within 6 months
**Key Learnings**: Clear communication and defined processes are essential for success
            ''',
          ),
          ContentSection(
            title: 'Case Study 2: Lessons Learned',
            type: SectionType.caseStudy,
            content: '''
**Company**: Global Services Inc.
**Challenge**: Reducing customer response time
**Solution**: Automated systems and improved training
**Results**: 60% reduction in response time
**Key Learnings**: Technology and training must work together for optimal results
            ''',
          ),
        ];
        break;
    }
  }

  String _getContentTitle() {
    switch (widget.contentType) {
      case ContentType.introduction:
        return 'Introduction';
      case ContentType.keyConcepts:
        return 'Key Concepts';
      case ContentType.bestPractices:
        return 'Best Practices';
      case ContentType.caseStudies:
        return 'Case Studies';
    }
  }

  IconData _getContentIcon() {
    switch (widget.contentType) {
      case ContentType.introduction:
        return Icons.play_circle_outline;
      case ContentType.keyConcepts:
        return Icons.lightbulb_outline;
      case ContentType.bestPractices:
        return Icons.check_circle_outline;
      case ContentType.caseStudies:
        return Icons.cases_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(_getContentTitle()),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          IconButton(
            icon: Icon(_getContentIcon()),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Progress indicator
          Container(
            padding: const EdgeInsets.all(16),
            color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${_currentPage + 1} of ${_contentSections.length}',
                      style: TextStyle(
                        fontSize: 14,
                        color: isDarkMode
                            ? AppTheme.darkTextSecondaryColor
                            : AppTheme.textSecondaryColor,
                      ),
                    ),
                    Text(
                      '${((_currentPage + 1) / _contentSections.length * 100).round()}%',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: (_currentPage + 1) / _contentSections.length,
                  backgroundColor:
                      isDarkMode ? Colors.grey[700] : Colors.grey[200],
                  valueColor: const AlwaysStoppedAnimation<Color>(
                      AppTheme.primaryColor),
                ),
              ],
            ),
          ),

          // Content
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              onPageChanged: (index) {
                setState(() {
                  _currentPage = index;
                });
              },
              itemCount: _contentSections.length,
              itemBuilder: (context, index) {
                return _buildContentSection(
                    _contentSections[index], isDarkMode);
              },
            ),
          ),

          // Navigation buttons
          Container(
            padding: const EdgeInsets.all(16),
            color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
            child: Row(
              children: [
                if (_currentPage > 0)
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        _pageController?.previousPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      },
                      child: const Text('Previous'),
                    ),
                  ),
                if (_currentPage > 0) const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      if (_currentPage < _contentSections.length - 1) {
                        _pageController?.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      } else {
                        // Mark section as complete and return
                        Navigator.of(context).pop(true);
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      foregroundColor: Colors.white,
                    ),
                    child: Text(
                      _currentPage < _contentSections.length - 1
                          ? 'Next'
                          : 'Complete',
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContentSection(ContentSection section, bool isDarkMode) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section title
          Text(
            section.title,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: isDarkMode
                  ? AppTheme.darkTextPrimaryColor
                  : AppTheme.textPrimaryColor,
            ),
          ),
          const SizedBox(height: 24),

          // Content based on type
          _buildContentByType(section, isDarkMode),
        ],
      ),
    );
  }

  Widget _buildContentByType(ContentSection section, bool isDarkMode) {
    switch (section.type) {
      case SectionType.text:
        return Text(
          section.content,
          style: TextStyle(
            fontSize: 16,
            height: 1.6,
            color: isDarkMode
                ? AppTheme.darkTextSecondaryColor
                : AppTheme.textSecondaryColor,
          ),
        );

      case SectionType.bulletPoints:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: section.content
              .split('\n')
              .where((line) => line.trim().isNotEmpty)
              .map((point) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                point,
                style: TextStyle(
                  fontSize: 16,
                  height: 1.6,
                  color: isDarkMode
                      ? AppTheme.darkTextSecondaryColor
                      : AppTheme.textSecondaryColor,
                ),
              ),
            );
          }).toList(),
        );

      case SectionType.video:
        return _buildVideoPlayer(section.content, isDarkMode);

      case SectionType.interactive:
        return _buildInteractiveContent(section.content, isDarkMode);

      case SectionType.resources:
        return _buildResourcesContent(section.content, isDarkMode);

      case SectionType.caseStudy:
        return _buildCaseStudyContent(section.content, isDarkMode);
    }
  }

  Widget _buildVideoPlayer(String videoUrl, bool isDarkMode) {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.blue.withValues(alpha: 0.3),
                  Colors.purple.withValues(alpha: 0.3),
                ],
              ),
            ),
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.play_circle_fill,
                size: 64,
                color: Colors.white.withValues(alpha: 0.9),
              ),
              const SizedBox(height: 8),
              Text(
                'Tap to play video',
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.9),
                  fontSize: 16,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInteractiveContent(String content, bool isDarkMode) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.primaryColor.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.primaryColor.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Icon(
            Icons.quiz,
            size: 48,
            color: AppTheme.primaryColor,
          ),
          const SizedBox(height: 16),
          Text(
            content,
            style: TextStyle(
              fontSize: 16,
              color: isDarkMode
                  ? AppTheme.darkTextPrimaryColor
                  : AppTheme.textPrimaryColor,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                    content: Text('Interactive exercise coming soon!')),
              );
            },
            child: const Text('Start Exercise'),
          ),
        ],
      ),
    );
  }

  Widget _buildResourcesContent(String content, bool isDarkMode) {
    final resources = [
      {
        'name': 'Implementation Checklist',
        'type': 'PDF',
        'icon': Icons.picture_as_pdf
      },
      {'name': 'Process Template', 'type': 'DOCX', 'icon': Icons.description},
      {'name': 'Workflow Diagram', 'type': 'PNG', 'icon': Icons.image},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          content,
          style: TextStyle(
            fontSize: 16,
            color: isDarkMode
                ? AppTheme.darkTextSecondaryColor
                : AppTheme.textSecondaryColor,
          ),
        ),
        const SizedBox(height: 16),
        ...resources.map((resource) {
          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              leading: Icon(
                resource['icon'] as IconData,
                color: AppTheme.primaryColor,
              ),
              title: Text(resource['name'] as String),
              subtitle: Text(resource['type'] as String),
              trailing: Icon(Icons.download),
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Downloading ${resource['name']}')),
                );
              },
              tileColor: isDarkMode ? AppTheme.cardColorDark : Colors.grey[50],
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildCaseStudyContent(String content, bool isDarkMode) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.business_center,
                color: AppTheme.primaryColor,
                size: 24,
              ),
              const SizedBox(width: 8),
              Text(
                'Case Study',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            content,
            style: TextStyle(
              fontSize: 16,
              height: 1.6,
              color: isDarkMode
                  ? AppTheme.darkTextSecondaryColor
                  : AppTheme.textSecondaryColor,
            ),
          ),
        ],
      ),
    );
  }
}

enum SectionType {
  text,
  bulletPoints,
  video,
  interactive,
  resources,
  caseStudy,
}

class ContentSection {
  final String title;
  final SectionType type;
  final String content;

  ContentSection({
    required this.title,
    required this.type,
    required this.content,
  });
}
