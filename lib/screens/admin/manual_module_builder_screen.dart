import 'package:flutter/material.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/widgets/custom_text_field.dart';

class ManualModuleBuilderScreen extends StatefulWidget {
  const ManualModuleBuilderScreen({super.key});

  @override
  State<ManualModuleBuilderScreen> createState() =>
      _ManualModuleBuilderScreenState();
}

class _ManualModuleBuilderScreenState extends State<ManualModuleBuilderScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  final _formKey = GlobalKey<FormState>();

  // Basic Information Controllers
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _pointsController = TextEditingController();
  final _durationController = TextEditingController();

  // Module Settings
  String _selectedCategory = 'Safety';
  DifficultyLevel _selectedDifficulty = DifficultyLevel.beginner;
  bool _isPublished = false;
  bool _requiresCompletion = true;

  // Content Sections
  final List<ContentSection> _contentSections = [];
  final List<QuizQuestion> _quizQuestions = [];

  // Assessment Settings
  int _passingScore = 80;
  int _maxAttempts = 3;
  bool _showCorrectAnswers = true;

  final List<String> _categories = [
    'Safety',
    'Service',
    'Compliance',
    'Soft Skills',
    'Technology',
    'Leadership'
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _addDefaultSection();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _titleController.dispose();
    _descriptionController.dispose();
    _pointsController.dispose();
    _durationController.dispose();
    super.dispose();
  }

  void _addDefaultSection() {
    _contentSections.add(ContentSection(
      title: 'Introduction',
      type: SectionType.text,
      content: '',
    ));
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Manual Module Builder'),
        backgroundColor: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          indicatorColor: AppTheme.primaryColor,
          labelColor: AppTheme.primaryColor,
          unselectedLabelColor: isDarkMode
              ? AppTheme.darkTextSecondaryColor
              : AppTheme.textSecondaryColor,
          tabs: const [
            Tab(icon: Icon(Icons.info), text: 'Basic Info'),
            Tab(icon: Icon(Icons.article), text: 'Content'),
            Tab(icon: Icon(Icons.quiz), text: 'Assessment'),
            Tab(icon: Icon(Icons.settings), text: 'Settings'),
            Tab(icon: Icon(Icons.preview), text: 'Preview'),
          ],
        ),
      ),
      body: Form(
        key: _formKey,
        child: TabBarView(
          controller: _tabController,
          children: [
            _buildBasicInfoTab(isDarkMode),
            _buildContentTab(isDarkMode),
            _buildAssessmentTab(isDarkMode),
            _buildSettingsTab(isDarkMode),
            _buildPreviewTab(isDarkMode),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _saveModule,
        icon: Icon(Icons.save),
        label: const Text('Save Module'),
        backgroundColor: AppTheme.primaryColor,
      ),
    );
  }

  Widget _buildBasicInfoTab(bool isDarkMode) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionCard(
            isDarkMode,
            'Module Information',
            Icons.info,
            Column(
              children: [
                CustomTextField(
                  label: 'Module Title',
                  controller: _titleController,
                  hintText: 'Enter a clear, descriptive title',
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter a module title';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                CustomTextField(
                  label: 'Description',
                  controller: _descriptionController,
                  hintText: 'Describe what learners will gain from this module',
                  maxLines: 4,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter a description';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: CustomTextField(
                        label: 'Points Value',
                        controller: _pointsController,
                        hintText: '100',
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Required';
                          }
                          if (int.tryParse(value) == null) {
                            return 'Must be a number';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: CustomTextField(
                        label: 'Duration (minutes)',
                        controller: _durationController,
                        hintText: '30',
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Required';
                          }
                          if (int.tryParse(value) == null) {
                            return 'Must be a number';
                          }
                          return null;
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _buildSectionCard(
            isDarkMode,
            'Category & Difficulty',
            Icons.category,
            Column(
              children: [
                DropdownButtonFormField<String>(
                  value: _selectedCategory,
                  decoration: const InputDecoration(
                    labelText: 'Category',
                    border: OutlineInputBorder(),
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
                const SizedBox(height: 16),
                DropdownButtonFormField<DifficultyLevel>(
                  value: _selectedDifficulty,
                  decoration: const InputDecoration(
                    labelText: 'Difficulty Level',
                    border: OutlineInputBorder(),
                  ),
                  items: DifficultyLevel.values.map((difficulty) {
                    return DropdownMenuItem(
                      value: difficulty,
                      child: Text(
                          difficulty.toString().split('.').last.toUpperCase()),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedDifficulty = value!;
                    });
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContentTab(bool isDarkMode) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Content Sections',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isDarkMode
                      ? AppTheme.darkTextPrimaryColor
                      : AppTheme.textPrimaryColor,
                ),
              ),
              ElevatedButton.icon(
                onPressed: _addContentSection,
                icon: Icon(Icons.add),
                label: const Text('Add Section'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_contentSections.isEmpty)
            _buildEmptyState('No content sections yet',
                'Add your first section to get started')
          else
            ReorderableListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              onReorder: _reorderSections,
              itemCount: _contentSections.length,
              itemBuilder: (context, index) {
                return _buildContentSectionCard(index, isDarkMode);
              },
            ),
        ],
      ),
    );
  }

  Widget _buildAssessmentTab(bool isDarkMode) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionCard(
            isDarkMode,
            'Assessment Settings',
            Icons.settings,
            Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        initialValue: _passingScore.toString(),
                        decoration: const InputDecoration(
                          labelText: 'Passing Score (%)',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.number,
                        onChanged: (value) {
                          _passingScore = int.tryParse(value) ?? 80;
                        },
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextFormField(
                        initialValue: _maxAttempts.toString(),
                        decoration: const InputDecoration(
                          labelText: 'Max Attempts',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.number,
                        onChanged: (value) {
                          _maxAttempts = int.tryParse(value) ?? 3;
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SwitchListTile(
                  title: const Text('Show Correct Answers'),
                  subtitle:
                      const Text('Display correct answers after completion'),
                  value: _showCorrectAnswers,
                  onChanged: (value) {
                    setState(() {
                      _showCorrectAnswers = value;
                    });
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Quiz Questions',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isDarkMode
                      ? AppTheme.darkTextPrimaryColor
                      : AppTheme.textPrimaryColor,
                ),
              ),
              ElevatedButton.icon(
                onPressed: _addQuizQuestion,
                icon: Icon(Icons.add),
                label: const Text('Add Question'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_quizQuestions.isEmpty)
            _buildEmptyState('No quiz questions yet',
                'Add questions to assess learner understanding')
          else
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _quizQuestions.length,
              itemBuilder: (context, index) {
                return _buildQuizQuestionCard(index, isDarkMode);
              },
            ),
        ],
      ),
    );
  }

  Widget _buildSettingsTab(bool isDarkMode) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          _buildSectionCard(
            isDarkMode,
            'Publication Settings',
            Icons.publish,
            Column(
              children: [
                SwitchListTile(
                  title: const Text('Publish Module'),
                  subtitle:
                      const Text('Make this module available to learners'),
                  value: _isPublished,
                  onChanged: (value) {
                    setState(() {
                      _isPublished = value;
                    });
                  },
                ),
                const Divider(),
                SwitchListTile(
                  title: const Text('Require Completion'),
                  subtitle: const Text('Learners must complete all sections'),
                  value: _requiresCompletion,
                  onChanged: (value) {
                    setState(() {
                      _requiresCompletion = value;
                    });
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPreviewTab(bool isDarkMode) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionCard(
            isDarkMode,
            'Module Preview',
            Icons.preview,
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _titleController.text.isEmpty
                      ? 'Module Title'
                      : _titleController.text,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  _descriptionController.text.isEmpty
                      ? 'Module description will appear here'
                      : _descriptionController.text,
                  style: TextStyle(
                    fontSize: 16,
                    color: isDarkMode
                        ? AppTheme.darkTextSecondaryColor
                        : AppTheme.textSecondaryColor,
                  ),
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  children: [
                    Chip(
                      label: Text(_selectedCategory),
                      backgroundColor:
                          AppTheme.primaryColor.withValues(alpha: 0.1),
                    ),
                    Chip(
                      label: Text(_selectedDifficulty
                          .toString()
                          .split('.')
                          .last
                          .toUpperCase()),
                      backgroundColor:
                          AppTheme.primaryColor.withValues(alpha: 0.1),
                    ),
                    if (_pointsController.text.isNotEmpty)
                      Chip(
                        label: Text('${_pointsController.text} points'),
                        backgroundColor: Colors.amber.withValues(alpha: 0.1),
                      ),
                    if (_durationController.text.isNotEmpty)
                      Chip(
                        label: Text('${_durationController.text} min'),
                        backgroundColor: Colors.blue.withValues(alpha: 0.1),
                      ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'Content Sections (${_contentSections.length})',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                ...(_contentSections
                    .map((section) => ListTile(
                          leading: Icon(_getSectionIcon(section.type)),
                          title: Text(section.title),
                          subtitle: Text(_getSectionTypeLabel(section.type)),
                        ))
                    .toList()),
                const SizedBox(height: 16),
                Text(
                  'Assessment (${_quizQuestions.length} questions)',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard(
      bool isDarkMode, String title, IconData icon, Widget child) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
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
              Icon(icon, color: AppTheme.primaryColor),
              const SizedBox(width: 12),
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
            ],
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }

  Widget _buildContentSectionCard(int index, bool isDarkMode) {
    final section = _contentSections[index];

    return Container(
      key: ValueKey(index),
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(_getSectionIcon(section.type), color: AppTheme.primaryColor),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  section.title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              IconButton(
                onPressed: () => _editContentSection(index),
                icon: Icon(Icons.edit),
              ),
              IconButton(
                onPressed: () => _deleteContentSection(index),
                icon: Icon(Icons.delete, color: Colors.red),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            _getSectionTypeLabel(section.type),
            style: TextStyle(
              color: isDarkMode
                  ? AppTheme.darkTextSecondaryColor
                  : AppTheme.textSecondaryColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuizQuestionCard(int index, bool isDarkMode) {
    final question = _quizQuestions[index];

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDarkMode ? AppTheme.cardColorDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  question.question,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              IconButton(
                onPressed: () => _editQuizQuestion(index),
                icon: Icon(Icons.edit),
              ),
              IconButton(
                onPressed: () => _deleteQuizQuestion(index),
                icon: Icon(Icons.delete, color: Colors.red),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            '${question.options.length} options',
            style: TextStyle(
              color: isDarkMode
                  ? AppTheme.darkTextSecondaryColor
                  : AppTheme.textSecondaryColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(String title, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
          Icon(
            Icons.inbox,
            size: 64,
            color: Colors.grey.withValues(alpha: 0.5),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.grey.withValues(alpha: 0.7),
            ),
          ),
        ],
      ),
    );
  }

  IconData _getSectionIcon(SectionType type) {
    switch (type) {
      case SectionType.text:
        return Icons.article;
      case SectionType.video:
        return Icons.play_circle;
      case SectionType.interactive:
        return Icons.touch_app;
      case SectionType.bulletPoints:
        return Icons.list;
      case SectionType.caseStudy:
        return Icons.cases;
      case SectionType.resources:
        return Icons.folder;
    }
  }

  String _getSectionTypeLabel(SectionType type) {
    switch (type) {
      case SectionType.text:
        return 'Text Content';
      case SectionType.video:
        return 'Video Content';
      case SectionType.interactive:
        return 'Interactive Exercise';
      case SectionType.bulletPoints:
        return 'Bullet Points';
      case SectionType.caseStudy:
        return 'Case Study';
      case SectionType.resources:
        return 'Resources & Tools';
    }
  }

  void _addContentSection() {
    showDialog(
      context: context,
      builder: (context) => ContentSectionDialog(
        onSave: (section) {
          setState(() {
            _contentSections.add(section);
          });
        },
      ),
    );
  }

  void _editContentSection(int index) {
    showDialog(
      context: context,
      builder: (context) => ContentSectionDialog(
        section: _contentSections[index],
        onSave: (section) {
          setState(() {
            _contentSections[index] = section;
          });
        },
      ),
    );
  }

  void _deleteContentSection(int index) {
    setState(() {
      _contentSections.removeAt(index);
    });
  }

  void _reorderSections(int oldIndex, int newIndex) {
    setState(() {
      if (newIndex > oldIndex) newIndex--;
      final section = _contentSections.removeAt(oldIndex);
      _contentSections.insert(newIndex, section);
    });
  }

  void _addQuizQuestion() {
    showDialog(
      context: context,
      builder: (context) => QuizQuestionDialog(
        onSave: (question) {
          setState(() {
            _quizQuestions.add(question);
          });
        },
      ),
    );
  }

  void _editQuizQuestion(int index) {
    showDialog(
      context: context,
      builder: (context) => QuizQuestionDialog(
        question: _quizQuestions[index],
        onSave: (question) {
          setState(() {
            _quizQuestions[index] = question;
          });
        },
      ),
    );
  }

  void _deleteQuizQuestion(int index) {
    setState(() {
      _quizQuestions.removeAt(index);
    });
  }

  void _saveModule() {
    if (_formKey.currentState!.validate()) {
      // Create the module object
      final module = ModuleModel(
        id: 'module_${DateTime.now().millisecondsSinceEpoch}',
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        pointsValue: int.parse(_pointsController.text),
        estimatedMinutes: int.parse(_durationController.text),
        category: _selectedCategory,
        difficulty: _selectedDifficulty,
        status: ModuleStatus.notStarted,
        progress: 0.0,
        duration: int.parse(_durationController.text),
        isCompleted: false,
      );

      // Here you would typically save to a backend/database
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Module "${module.title}" saved successfully!'),
          backgroundColor: Colors.green,
        ),
      );

      Navigator.pop(context, module);
    }
  }
}

// Supporting Models and Dialogs
enum SectionType {
  text,
  video,
  interactive,
  bulletPoints,
  caseStudy,
  resources
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

class QuizQuestion {
  final String question;
  final List<String> options;
  final int correctAnswer;

  QuizQuestion({
    required this.question,
    required this.options,
    required this.correctAnswer,
  });
}

class ContentSectionDialog extends StatefulWidget {
  final ContentSection? section;
  final Function(ContentSection) onSave;

  const ContentSectionDialog({
    super.key,
    this.section,
    required this.onSave,
  });

  @override
  State<ContentSectionDialog> createState() => _ContentSectionDialogState();
}

class _ContentSectionDialogState extends State<ContentSectionDialog> {
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  SectionType _selectedType = SectionType.text;

  @override
  void initState() {
    super.initState();
    if (widget.section != null) {
      _titleController.text = widget.section!.title;
      _contentController.text = widget.section!.content;
      _selectedType = widget.section!.type;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.section == null
          ? 'Add Content Section'
          : 'Edit Content Section'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Section Title',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<SectionType>(
              value: _selectedType,
              decoration: const InputDecoration(
                labelText: 'Content Type',
                border: OutlineInputBorder(),
              ),
              items: SectionType.values.map((type) {
                return DropdownMenuItem(
                  value: type,
                  child: Text(type.toString().split('.').last),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedType = value!;
                });
              },
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _contentController,
              decoration: const InputDecoration(
                labelText: 'Content',
                border: OutlineInputBorder(),
              ),
              maxLines: 5,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            if (_titleController.text.isNotEmpty) {
              widget.onSave(ContentSection(
                title: _titleController.text,
                type: _selectedType,
                content: _contentController.text,
              ));
              Navigator.pop(context);
            }
          },
          child: const Text('Save'),
        ),
      ],
    );
  }
}

class QuizQuestionDialog extends StatefulWidget {
  final QuizQuestion? question;
  final Function(QuizQuestion) onSave;

  const QuizQuestionDialog({
    super.key,
    this.question,
    required this.onSave,
  });

  @override
  State<QuizQuestionDialog> createState() => _QuizQuestionDialogState();
}

class _QuizQuestionDialogState extends State<QuizQuestionDialog> {
  final _questionController = TextEditingController();
  final List<TextEditingController> _optionControllers = [];
  int _correctAnswer = 0;

  @override
  void initState() {
    super.initState();
    if (widget.question != null) {
      _questionController.text = widget.question!.question;
      _correctAnswer = widget.question!.correctAnswer;
      for (int i = 0; i < widget.question!.options.length; i++) {
        _optionControllers
            .add(TextEditingController(text: widget.question!.options[i]));
      }
    } else {
      // Add 4 default option controllers
      for (int i = 0; i < 4; i++) {
        _optionControllers.add(TextEditingController());
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(
          widget.question == null ? 'Add Quiz Question' : 'Edit Quiz Question'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _questionController,
              decoration: const InputDecoration(
                labelText: 'Question',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            const Text('Answer Options:'),
            const SizedBox(height: 8),
            ..._optionControllers.asMap().entries.map((entry) {
              int index = entry.key;
              TextEditingController controller = entry.value;
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    Radio<int>(
                      value: index,
                      groupValue: _correctAnswer,
                      onChanged: (value) {
                        setState(() {
                          _correctAnswer = value!;
                        });
                      },
                    ),
                    Expanded(
                      child: TextField(
                        controller: controller,
                        decoration: InputDecoration(
                          labelText: 'Option ${index + 1}',
                          border: const OutlineInputBorder(),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            if (_questionController.text.isNotEmpty) {
              final options = _optionControllers
                  .map((controller) => controller.text)
                  .where((text) => text.isNotEmpty)
                  .toList();

              if (options.length >= 2) {
                widget.onSave(QuizQuestion(
                  question: _questionController.text,
                  options: options,
                  correctAnswer: _correctAnswer,
                ));
                Navigator.pop(context);
              }
            }
          },
          child: const Text('Save'),
        ),
      ],
    );
  }
}
