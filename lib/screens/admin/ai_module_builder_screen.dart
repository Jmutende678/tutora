import 'package:flutter/material.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/utils/app_logo.dart';
import 'package:tutora/widgets/primary_button.dart';

enum AIModuleBuilderStep {
  upload,
  processing,
  preview,
  confirmation,
}

class AIModuleBuilderScreen extends StatefulWidget {
  const AIModuleBuilderScreen({super.key});

  @override
  State<AIModuleBuilderScreen> createState() => _AIModuleBuilderScreenState();
}

class _AIModuleBuilderScreenState extends State<AIModuleBuilderScreen>
    with TickerProviderStateMixin {
  AIModuleBuilderStep _currentStep = AIModuleBuilderStep.upload;
  String? _uploadedFileName;
  double _uploadProgress = 0.0;
  bool _isUploading = false;
  bool _includeSubtitles = false;

  // AI Processing data
  Map<String, dynamic> _aiGeneratedData = {};

  // Animations
  late AnimationController _uploadAnimationController;
  late AnimationController _processingAnimationController;
  late Animation<double> _uploadFadeAnimation;
  late Animation<double> _processingRotationAnimation;

  @override
  void initState() {
    super.initState();
    _uploadAnimationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _processingAnimationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _uploadFadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _uploadAnimationController,
      curve: Curves.easeInOut,
    ));

    _processingRotationAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _processingAnimationController,
      curve: Curves.linear,
    ));

    _uploadAnimationController.forward();
  }

  @override
  void dispose() {
    _uploadAnimationController.dispose();
    _processingAnimationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: _buildAppBar(),
      body: _buildCurrentStep(),
    );
  }

  AppBar _buildAppBar() {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      leading: IconButton(
        icon: Icon(Icons.arrow_back, color: Colors.black87),
        onPressed: () => Navigator.pop(context),
      ),
      title: Row(
        children: [
          AppLogo.getIconOnly(size: 24),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              'AI Module Builder',
              style: TextStyle(
                color: Colors.black87,
                fontSize: 20,
                fontWeight: FontWeight.w600,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
      actions: [
        Container(
          margin: const EdgeInsets.only(right: 16),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.purple.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.purple.withValues(alpha: 0.3)),
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.auto_awesome, color: Colors.purple, size: 16),
              const SizedBox(width: 4),
              Text(
                'AI Powered',
                style: TextStyle(
                  color: Colors.purple,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCurrentStep() {
    switch (_currentStep) {
      case AIModuleBuilderStep.upload:
        return _buildUploadInterface();
      case AIModuleBuilderStep.processing:
        return _buildProcessingInterface();
      case AIModuleBuilderStep.preview:
        return _buildPreviewInterface();
      case AIModuleBuilderStep.confirmation:
        return _buildConfirmationInterface();
    }
  }

  Widget _buildUploadInterface() {
    return AnimatedBuilder(
      animation: _uploadFadeAnimation,
      builder: (context, child) {
        return Opacity(
          opacity: _uploadFadeAnimation.value,
          child: Center(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 600),
              margin: const EdgeInsets.all(24),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Hero section
                    Container(
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.08),
                            blurRadius: 30,
                            offset: const Offset(0, 12),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          // Icon and title
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  AppTheme.primaryColor,
                                  Colors.purple,
                                ],
                              ),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Icon(
                              Icons.smart_display_rounded,
                              color: Colors.white,
                              size: 40,
                            ),
                          ),

                          const SizedBox(height: 24),

                          const Text(
                            'Transform Your Video Into\nA Complete Training Module',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                              height: 1.3,
                            ),
                          ),

                          const SizedBox(height: 12),

                          Text(
                            'Upload a training video and our AI will create a transcript, summary, and quiz questions automatically.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey[600],
                              height: 1.5,
                            ),
                          ),

                          const SizedBox(height: 32),

                          // Upload area
                          _buildUploadArea(),

                          const SizedBox(height: 24),

                          // Options
                          _buildUploadOptions(),

                          const SizedBox(height: 32),

                          // Generate button
                          SizedBox(
                            width: double.infinity,
                            child: PrimaryButton(
                              text: _uploadedFileName != null
                                  ? 'Generate Training Module'
                                  : 'Select Video First',
                              onPressed: _uploadedFileName != null
                                  ? _startAIProcessing
                                  : null,
                              icon: Icons.auto_awesome,
                              isLoading: _isUploading,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Trust indicators
                    _buildTrustIndicators(),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildUploadArea() {
    return GestureDetector(
      onTap: _selectVideo,
      child: Container(
        width: double.infinity,
        height: 200,
        decoration: BoxDecoration(
          border: Border.all(
            color: _uploadedFileName != null
                ? AppTheme.primaryColor
                : Colors.grey[300]!,
            width: 2,
            style: BorderStyle.solid,
          ),
          borderRadius: BorderRadius.circular(16),
          color: _uploadedFileName != null
              ? AppTheme.primaryColor.withValues(alpha: 0.05)
              : Colors.grey[50],
        ),
        child: _uploadedFileName != null
            ? _buildUploadedFileDisplay()
            : _buildEmptyUploadArea(),
      ),
    );
  }

  Widget _buildEmptyUploadArea() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          Icons.cloud_upload_outlined,
          size: 48,
          color: Colors.grey[400],
        ),
        const SizedBox(height: 16),
        Text(
          'Drag & drop or click to upload',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.grey[700],
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Supports: MP4, MOV, WEBM',
          style: TextStyle(
            fontSize: 14,
            color: Colors.grey[500],
          ),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.amber.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.amber.withValues(alpha: 0.3)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.lightbulb_outline, color: Colors.amber[700], size: 16),
              const SizedBox(width: 6),
              Text(
                'Best results: Under 10 minutes',
                style: TextStyle(
                  color: Colors.amber[700],
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildUploadedFileDisplay() {
    if (_isUploading) {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              Icons.video_file,
              size: 40,
              color: AppTheme.primaryColor,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Uploading video...',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          // Progress indicator
          SizedBox(
            width: 200,
            child: Column(
              children: [
                LinearProgressIndicator(
                  value: _uploadProgress,
                  backgroundColor: Colors.grey[300],
                  valueColor: const AlwaysStoppedAnimation<Color>(
                      AppTheme.primaryColor),
                ),
                const SizedBox(height: 8),
                Text(
                  '${(_uploadProgress * 100).round()}%',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
        ],
      );
    }

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.primaryColor.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            Icons.video_file,
            size: 40,
            color: AppTheme.primaryColor,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          _uploadedFileName!,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
          textAlign: TextAlign.center,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle, color: Colors.green, size: 20),
            const SizedBox(width: 6),
            Text(
              'Ready to process',
              style: TextStyle(
                color: Colors.green[700],
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        TextButton.icon(
          onPressed: _clearUpload,
          icon: Icon(Icons.refresh, size: 16),
          label: const Text('Upload Different Video'),
          style: TextButton.styleFrom(
            foregroundColor: AppTheme.primaryColor,
          ),
        ),
      ],
    );
  }

  Widget _buildUploadOptions() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        children: [
          Checkbox(
            value: _includeSubtitles,
            onChanged: (value) {
              setState(() {
                _includeSubtitles = value ?? false;
              });
            },
            activeColor: AppTheme.primaryColor,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Include custom subtitles/transcript',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
                Text(
                  'Upload your own transcript for more accurate results',
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

  Widget _buildTrustIndicators() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _buildTrustBadge(Icons.security, 'Secure'),
        const SizedBox(width: 24),
        _buildTrustBadge(Icons.speed, 'Fast'),
        const SizedBox(width: 24),
        _buildTrustBadge(Icons.edit, 'Editable'),
      ],
    );
  }

  Widget _buildTrustBadge(IconData icon, String label) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[200]!),
          ),
          child: Icon(icon, color: AppTheme.primaryColor, size: 20),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  // Processing Interface
  Widget _buildProcessingInterface() {
    final steps = [
      {'title': 'Transcribing Video', 'icon': Icons.hearing},
      {'title': 'Extracting Key Learning Points', 'icon': Icons.lightbulb},
      {'title': 'Generating Quiz Questions', 'icon': Icons.quiz},
      {'title': 'Assembling Module', 'icon': Icons.build_circle},
    ];

    return Center(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 500),
        margin: const EdgeInsets.all(24),
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 30,
              offset: const Offset(0, 12),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // AI Processing animation
            AnimatedBuilder(
              animation: _processingRotationAnimation,
              builder: (context, child) {
                return Transform.rotate(
                  angle: _processingRotationAnimation.value * 2 * 3.14159,
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          AppTheme.primaryColor,
                          Colors.purple,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Icon(
                      Icons.auto_awesome,
                      color: Colors.white,
                      size: 40,
                    ),
                  ),
                );
              },
            ),

            const SizedBox(height: 24),

            const Text(
              'AI is working its magic ✨',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),

            const SizedBox(height: 12),

            Text(
              'This usually takes 1-3 minutes depending on video length',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 32),

            // Processing steps
            ...steps.asMap().entries.map((entry) {
              final index = entry.key;
              final step = entry.value;
              final isActive = index <= 1; // Mock progress

              return Container(
                margin: const EdgeInsets.only(bottom: 16),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color:
                            isActive ? AppTheme.primaryColor : Colors.grey[200],
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        step['icon'] as IconData,
                        color: isActive ? Colors.white : Colors.grey[400],
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        step['title'] as String,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: isActive ? Colors.black87 : Colors.grey[500],
                        ),
                      ),
                    ),
                    if (isActive) ...[
                      const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            AppTheme.primaryColor,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildPreviewInterface() {
    return DefaultTabController(
      length: 3,
      child: Column(
        children: [
          // Header
          Container(
            color: Colors.white,
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.green.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(Icons.check_circle,
                          color: Colors.green, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'AI Generation Complete!',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                          Text(
                            'Review and edit your training module before publishing',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                TabBar(
                  labelColor: AppTheme.primaryColor,
                  unselectedLabelColor: Colors.grey[600],
                  indicatorColor: AppTheme.primaryColor,
                  labelStyle: const TextStyle(fontWeight: FontWeight.w600),
                  tabs: const [
                    Tab(
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.text_snippet, size: 20),
                          const SizedBox(width: 8),
                          Flexible(
                              child: Text('Transcript',
                                  overflow: TextOverflow.ellipsis)),
                        ],
                      ),
                    ),
                    Tab(
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.quiz, size: 20),
                          const SizedBox(width: 8),
                          Flexible(
                              child: Text('Quiz',
                                  overflow: TextOverflow.ellipsis)),
                        ],
                      ),
                    ),
                    Tab(
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.library_books, size: 20),
                          const SizedBox(width: 8),
                          Flexible(
                              child: Text('Module',
                                  overflow: TextOverflow.ellipsis)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Tab content
          Expanded(
            child: TabBarView(
              children: [
                _buildTranscriptTab(),
                _buildQuizTab(),
                _buildModuleTab(),
              ],
            ),
          ),

          // Bottom actions
          Container(
            color: Colors.white,
            padding: const EdgeInsets.all(24),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      setState(() {
                        _currentStep = AIModuleBuilderStep.upload;
                      });
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      side: BorderSide(color: Colors.grey[300]!),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('Back to Upload'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  flex: 2,
                  child: PrimaryButton(
                    text: 'Continue to Final Review',
                    onPressed: () {
                      setState(() {
                        _currentStep = AIModuleBuilderStep.confirmation;
                      });
                    },
                    icon: Icons.arrow_forward,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTranscriptTab() {
    return Container(
      color: const Color(0xFFF8FAFC),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
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
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Expanded(
                    child: Text(
                      'Video Transcript',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  OutlinedButton.icon(
                    onPressed: () {
                      // Edit transcript
                    },
                    icon: Icon(Icons.edit, size: 16),
                    label: const Text('Edit'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.primaryColor,
                      side: const BorderSide(color: AppTheme.primaryColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Transcript content with timestamps
              ..._buildMockTranscriptContent(),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> _buildMockTranscriptContent() {
    final transcriptSegments = [
      {
        'time': '00:00',
        'text':
            'Welcome to our comprehensive safety training module. Today we\'ll be covering essential workplace safety protocols that every employee must understand.'
      },
      {
        'time': '00:15',
        'text':
            'First, let\'s discuss the importance of personal protective equipment, or PPE. This includes hard hats, safety glasses, gloves, and appropriate footwear.'
      },
      {
        'time': '00:35',
        'text':
            'When entering any work area, always conduct a visual inspection. Look for potential hazards such as wet floors, exposed wiring, or unstable structures.'
      },
      {
        'time': '01:00',
        'text':
            'Emergency procedures are critical. Know the location of fire exits, first aid stations, and emergency contact information. In case of an emergency, remain calm and follow established protocols.'
      },
      {
        'time': '01:25',
        'text':
            'Chemical safety requires special attention. Always read safety data sheets, use proper ventilation, and store chemicals according to their classification.'
      },
    ];

    return transcriptSegments.map((segment) {
      return Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.grey[50],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[200]!),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                segment['time']!,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.primaryColor,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                segment['text']!,
                style: const TextStyle(
                  fontSize: 14,
                  height: 1.5,
                  color: Colors.black87,
                ),
              ),
            ),
          ],
        ),
      );
    }).toList();
  }

  Widget _buildQuizTab() {
    return Container(
      color: const Color(0xFFF8FAFC),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
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
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Expanded(
                        child: Text(
                          'Generated Quiz Questions',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      OutlinedButton.icon(
                        onPressed: () {
                          // Add question
                        },
                        icon: Icon(Icons.add, size: 16),
                        label: const Text('Add Question'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.primaryColor,
                          side: const BorderSide(color: AppTheme.primaryColor),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  Text(
                    '5 questions generated • Estimated completion: 3 minutes',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Quiz questions
                  ..._buildMockQuizQuestions(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildMockQuizQuestions() {
    final questions = [
      {
        'type': 'Multiple Choice',
        'question': 'What does PPE stand for in workplace safety?',
        'options': [
          'Personal Protection Equipment',
          'Personal Protective Equipment',
          'Professional Protection Equipment',
          'Preventive Protection Equipment'
        ],
        'correct': 1,
      },
      {
        'type': 'True/False',
        'question':
            'It is acceptable to skip visual inspections when you are familiar with the work area.',
        'correct': false,
      },
      {
        'type': 'Multiple Choice',
        'question':
            'Which of the following should you do in case of an emergency?',
        'options': [
          'Run immediately',
          'Remain calm and follow protocols',
          'Call your supervisor first',
          'Wait for instructions'
        ],
        'correct': 1,
      },
    ];

    return questions.asMap().entries.map((entry) {
      final index = entry.key;
      final question = entry.value;

      return Container(
        margin: const EdgeInsets.only(bottom: 20),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.grey[50],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[200]!),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getQuestionTypeColor(question['type'] as String)
                        .withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    question['type'] as String,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: _getQuestionTypeColor(question['type'] as String),
                    ),
                  ),
                ),
                const Spacer(),
                IconButton(
                  onPressed: () {
                    // Edit question
                  },
                  icon: Icon(Icons.edit, size: 20),
                  color: Colors.grey[600],
                ),
                IconButton(
                  onPressed: () {
                    // Delete question
                  },
                  icon: Icon(Icons.delete, size: 20),
                  color: Colors.red[400],
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              'Question ${index + 1}',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[500],
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              question['question'] as String,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
            if (question['options'] != null) ...[
              const SizedBox(height: 16),
              ...(question['options'] as List<String>)
                  .asMap()
                  .entries
                  .map((optionEntry) {
                final optionIndex = optionEntry.key;
                final option = optionEntry.value;
                final isCorrect = optionIndex == question['correct'];

                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isCorrect
                        ? Colors.green.withValues(alpha: 0.1)
                        : Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isCorrect ? Colors.green : Colors.grey[300]!,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 20,
                        height: 20,
                        decoration: BoxDecoration(
                          color: isCorrect ? Colors.green : Colors.grey[200],
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: isCorrect
                            ? Icon(Icons.check,
                                color: Colors.white, size: 14)
                            : null,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          option,
                          style: TextStyle(
                            fontSize: 14,
                            color:
                                isCorrect ? Colors.green[700] : Colors.black87,
                            fontWeight:
                                isCorrect ? FontWeight.w600 : FontWeight.normal,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ] else ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: (question['correct'] as bool)
                      ? Colors.red.withValues(alpha: 0.1)
                      : Colors.green.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: (question['correct'] as bool)
                        ? Colors.red
                        : Colors.green,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      (question['correct'] as bool) ? Icons.close : Icons.check,
                      color: (question['correct'] as bool)
                          ? Colors.red
                          : Colors.green,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Correct Answer: ${(question['correct'] as bool) ? 'False' : 'True'}',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: (question['correct'] as bool)
                            ? Colors.red[700]
                            : Colors.green[700],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      );
    }).toList();
  }

  Color _getQuestionTypeColor(String type) {
    switch (type) {
      case 'Multiple Choice':
        return Colors.blue;
      case 'True/False':
        return Colors.orange;
      case 'Short Answer':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  Widget _buildModuleTab() {
    return Container(
      color: const Color(0xFFF8FAFC),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
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
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Expanded(
                    child: Text(
                      'Module Overview',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  OutlinedButton.icon(
                    onPressed: () {
                      // Edit module
                    },
                    icon: Icon(Icons.edit, size: 16),
                    label: const Text('Edit Details'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.primaryColor,
                      side: const BorderSide(color: AppTheme.primaryColor),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Module thumbnail upload
              Container(
                width: double.infinity,
                height: 200,
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey[300]!),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.image_outlined,
                        size: 48, color: Colors.grey[400]),
                    const SizedBox(height: 12),
                    Text(
                      'Add Module Thumbnail',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey[600],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextButton(
                      onPressed: () {
                        // Upload thumbnail
                      },
                      child: const Text('Upload Image'),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Module details
              _buildModuleDetailField(
                  'Title', 'Workplace Safety Training', true),
              const SizedBox(height: 16),
              _buildModuleDetailField('Category', 'Safety & Compliance', false),
              const SizedBox(height: 16),
              _buildModuleDetailField(
                'Description',
                'Comprehensive workplace safety training covering PPE requirements, hazard identification, emergency procedures, and chemical safety protocols. Essential training for all employees to ensure a safe working environment.',
                true,
                maxLines: 4,
              ),

              const SizedBox(height: 24),

              // Module stats
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                        'Video Duration', '2:30 min', Icons.play_circle),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildStatCard(
                        'Quiz Questions', '5 questions', Icons.quiz),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                        'Est. Completion', '6 minutes', Icons.schedule),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildStatCard(
                        'Difficulty', 'Beginner', Icons.signal_cellular_alt),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildModuleDetailField(String label, String value, bool isEditable,
      {int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          initialValue: value,
          maxLines: maxLines,
          enabled: isEditable,
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppTheme.primaryColor),
            ),
            contentPadding: const EdgeInsets.all(12),
            suffixIcon: isEditable ? Icon(Icons.edit, size: 20) : null,
          ),
          style: const TextStyle(fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        children: [
          Icon(icon, color: AppTheme.primaryColor, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildConfirmationInterface() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'Confirmation Interface',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Text(
            'AI Generated Data: ${_aiGeneratedData.isNotEmpty ? 'Ready' : 'Processing...'}',
            style: const TextStyle(fontSize: 16),
          ),
          if (_aiGeneratedData.isNotEmpty) ...[
            const SizedBox(height: 16),
            Text('Title: ${_aiGeneratedData['title'] ?? 'Unknown'}'),
            Text('Summary: ${_aiGeneratedData['summary'] ?? 'Unknown'}'),
          ],
        ],
      ),
    );
  }

  // Mock methods - will be replaced with real functionality
  void _selectVideo() async {
    setState(() {
      _isUploading = true;
      _uploadProgress = 0.0;
    });

    // Simulate upload progress
    for (int i = 0; i <= 100; i += 10) {
      await Future.delayed(const Duration(milliseconds: 200));
      if (mounted) {
        setState(() {
          _uploadProgress = i / 100;
        });
      }
    }

    if (mounted) {
      setState(() {
        _uploadedFileName = 'safety_training_video.mp4';
        _isUploading = false;
        _uploadProgress = 0.0;
      });
    }
  }

  void _clearUpload() {
    setState(() {
      _uploadedFileName = null;
    });
  }

  void _startAIProcessing() {
    setState(() {
      _currentStep = AIModuleBuilderStep.processing;
    });
    _processingAnimationController.repeat();

    _simulateAIProcessing();
  }

  void _simulateAIProcessing() async {
    await Future.delayed(const Duration(seconds: 5));

    if (mounted) {
      setState(() {
        _aiGeneratedData = {
          'transcript': 'Sample transcript content...',
          'questions': [],
          'title': 'Safety Training Module',
          'summary': 'Comprehensive safety training covering key protocols.',
        };
        _currentStep = AIModuleBuilderStep.preview;
      });
      _processingAnimationController.stop();
    }
  }
}
