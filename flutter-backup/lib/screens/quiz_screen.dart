import 'package:flutter/material.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/models/quiz_model.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/widgets/primary_button.dart';

class QuizScreen extends StatefulWidget {
  final ModuleModel module;

  const QuizScreen({
    super.key,
    required this.module,
  });

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  late List<QuizQuestion> _questions;
  int _currentQuestionIndex = 0;
  final List<dynamic> _userAnswers = [];
  bool _isSubmitting = false;
  bool _quizCompleted = false;
  int _correctAnswers = 0;

  @override
  void initState() {
    super.initState();
    _questions = QuizQuestion.dummyQuestions();
    // Initialize answer slots for each question
    for (int i = 0; i < _questions.length; i++) {
      if (_questions[i].type == QuestionType.multipleChoice) {
        _userAnswers.add(<int>[]);
      } else if (_questions[i].type == QuestionType.trueFalse) {
        _userAnswers.add(null);
      } else {
        _userAnswers.add(null); // For other question types
      }
    }
  }

  void _nextQuestion() {
    // Show feedback before moving to next question
    _showAnswerFeedback(() {
      if (_currentQuestionIndex < _questions.length - 1) {
        setState(() {
          _currentQuestionIndex++;
        });
      } else {
        _submitQuiz();
      }
    });
  }

  void _previousQuestion() {
    if (_currentQuestionIndex > 0) {
      setState(() {
        _currentQuestionIndex--;
      });
    }
  }

  void _submitQuiz() {
    setState(() {
      _isSubmitting = true;
    });

    // Calculate score
    int correct = 0;
    for (int i = 0; i < _questions.length; i++) {
      if (_questions[i].checkAnswer(_userAnswers[i])) {
        correct++;
      }
    }

    // In a real app, we would save the quiz result to the backend
    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        _correctAnswers = correct;
        _quizCompleted = true;
        _isSubmitting = false;
      });
    });
  }

  void _handleMultipleChoiceAnswer(int optionIndex) {
    setState(() {
      final selectedOptions = _userAnswers[_currentQuestionIndex] as List<int>;
      if (selectedOptions.contains(optionIndex)) {
        selectedOptions.remove(optionIndex);
      } else {
        selectedOptions.add(optionIndex);
      }
    });
  }

  void _handleSingleChoiceAnswer(int optionIndex) {
    setState(() {
      _userAnswers[_currentQuestionIndex] = optionIndex;
    });
  }

  void _showAnswerFeedback(VoidCallback onContinue) {
    final currentQuestion = _questions[_currentQuestionIndex];
    final userAnswer = _userAnswers[_currentQuestionIndex];
    final isCorrect = currentQuestion.checkAnswer(userAnswer);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Row(
            children: [
              Icon(
                isCorrect ? Icons.check_circle : Icons.error,
                color: isCorrect ? Colors.green : Colors.red,
                size: 28,
              ),
              const SizedBox(width: 12),
              Text(
                isCorrect ? 'Correct!' : 'Incorrect',
                style: TextStyle(
                  color: isCorrect ? Colors.green : Colors.red,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (isCorrect)
                const Text(
                  '🎉 Well done! You got it right.',
                  style: TextStyle(fontSize: 16),
                )
              else ...[
                const Text(
                  'Not quite right. Here\'s the correct answer:',
                  style: TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.green.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                    border:
                        Border.all(color: Colors.green.withValues(alpha: 0.3)),
                  ),
                  child: Text(
                    _getCorrectAnswerText(currentQuestion),
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                onContinue();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    isCorrect ? Colors.green : AppTheme.primaryColor,
                foregroundColor: Colors.white,
              ),
              child: Text(
                _currentQuestionIndex < _questions.length - 1
                    ? 'Next Question'
                    : 'View Results',
              ),
            ),
          ],
        );
      },
    );
  }

  String _getCorrectAnswerText(QuizQuestion question) {
    if (question.type == QuestionType.trueFalse) {
      return question.correctAnswers.first;
    } else if (question.type == QuestionType.multipleChoice) {
      return question.correctAnswers.join(', ');
    }
    return 'Check the correct answers above';
  }

  @override
  Widget build(BuildContext context) {
    if (_quizCompleted) {
      return _buildQuizResultScreen();
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.module.title} - Quiz'),
        centerTitle: true,
      ),
      body: _isSubmitting ? _buildLoadingScreen() : _buildQuizContent(),
    );
  }

  Widget _buildQuizContent() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final currentQuestion = _questions[_currentQuestionIndex];
    final progress = (_currentQuestionIndex + 1) / _questions.length;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Progress indicator
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        'Question ${_currentQuestionIndex + 1} of ${_questions.length}',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: isDarkMode
                              ? AppTheme.darkTextSecondaryColor
                              : AppTheme.textSecondaryColor,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      '${(progress * 100).toInt()}%',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: progress,
                  backgroundColor:
                      isDarkMode ? Colors.grey.shade800 : Colors.grey.shade200,
                  valueColor: const AlwaysStoppedAnimation<Color>(
                      AppTheme.primaryColor),
                  borderRadius: BorderRadius.circular(4),
                  minHeight: 8,
                ),
              ],
            ),

            const SizedBox(height: 32),

            // Question text
            Container(
              padding: const EdgeInsets.all(20),
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
              child: Text(
                currentQuestion.questionText,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: isDarkMode
                      ? AppTheme.darkTextPrimaryColor
                      : AppTheme.textPrimaryColor,
                ),
                softWrap: true,
              ),
            ),

            const SizedBox(height: 24),

            // Answer options
            Expanded(
              child: _buildAnswerOptions(currentQuestion),
            ),

            const SizedBox(height: 24),

            // Navigation buttons
            Row(
              children: [
                if (_currentQuestionIndex > 0)
                  Expanded(
                    flex: 1,
                    child: OutlinedButton(
                      onPressed: _previousQuestion,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.primaryColor,
                        side: const BorderSide(color: AppTheme.primaryColor),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('Previous'),
                    ),
                  ),
                if (_currentQuestionIndex > 0) const SizedBox(width: 16),
                Expanded(
                  flex: 2,
                  child: PrimaryButton(
                    text: _currentQuestionIndex < _questions.length - 1
                        ? 'Next'
                        : 'Submit Quiz',
                    onPressed: _isAnswerSelected() ? _nextQuestion : () {},
                    isLoading: false,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  bool _isAnswerSelected() {
    final currentAnswer = _userAnswers[_currentQuestionIndex];
    final currentQuestion = _questions[_currentQuestionIndex];

    if (currentQuestion.type == QuestionType.multipleChoice) {
      return (currentAnswer as List<int>).isNotEmpty;
    } else if (currentQuestion.type == QuestionType.trueFalse) {
      return currentAnswer != null;
    }

    return currentAnswer != null;
  }

  Widget _buildAnswerOptions(QuizQuestion question) {
    if (question.type == QuestionType.multipleChoice) {
      return _buildMultipleChoiceOptions(question);
    } else if (question.type == QuestionType.trueFalse) {
      return _buildTrueFalseOptions(question);
    }

    // Placeholder for other question types
    return const Center(
      child: Text(
        "This question type will be implemented in a future update",
        textAlign: TextAlign.center,
        style: TextStyle(
          fontSize: 16,
          fontStyle: FontStyle.italic,
        ),
      ),
    );
  }

  Widget _buildMultipleChoiceOptions(QuizQuestion question) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final selectedOptions = _userAnswers[_currentQuestionIndex] as List<int>;

    return ListView.builder(
      itemCount: question.options.length,
      itemBuilder: (context, index) {
        final isSelected = selectedOptions.contains(index);

        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () => _handleMultipleChoiceAnswer(index),
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppTheme.primaryColor.withValues(alpha: 0.1)
                    : isDarkMode
                        ? AppTheme.cardColorDark
                        : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected
                      ? AppTheme.primaryColor
                      : isDarkMode
                          ? Colors.grey.shade800
                          : Colors.grey.shade300,
                  width: isSelected ? 2 : 1,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppTheme.primaryColor
                          : Colors.transparent,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isSelected
                            ? AppTheme.primaryColor
                            : Colors.grey.shade400,
                        width: 2,
                      ),
                    ),
                    child: isSelected
                        ? Icon(
                            Icons.check,
                            color: Colors.white,
                            size: 16,
                          )
                        : null,
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      question.options[index],
                      style: TextStyle(
                        fontSize: 16,
                        color: isDarkMode
                            ? AppTheme.darkTextPrimaryColor
                            : AppTheme.textPrimaryColor,
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.normal,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildTrueFalseOptions(QuizQuestion question) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final selectedOption = _userAnswers[_currentQuestionIndex] as int?;

    return Column(
      children: [
        for (int i = 0; i < question.options.length; i++)
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: InkWell(
              onTap: () => _handleSingleChoiceAnswer(i),
              borderRadius: BorderRadius.circular(12),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: selectedOption == i
                      ? (question.options[i] == 'True'
                          ? Colors.green.withValues(alpha: 0.1)
                          : Colors.red.withValues(alpha: 0.1))
                      : isDarkMode
                          ? AppTheme.darkSurfaceColor
                          : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: selectedOption == i
                        ? (question.options[i] == 'True'
                            ? Colors.green
                            : Colors.red)
                        : isDarkMode
                            ? Colors.grey.shade800
                            : Colors.grey.shade300,
                    width: selectedOption == i ? 2 : 1,
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      question.options[i] == 'True'
                          ? Icons.check_circle_outline
                          : Icons.cancel_outlined,
                      color: selectedOption == i
                          ? (question.options[i] == 'True'
                              ? Colors.green
                              : Colors.red)
                          : isDarkMode
                              ? Colors.grey.shade400
                              : Colors.grey.shade700,
                      size: 24,
                    ),
                    const SizedBox(width: 16),
                    Text(
                      question.options[i],
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: selectedOption == i
                            ? (question.options[i] == 'True'
                                ? Colors.green
                                : Colors.red)
                            : isDarkMode
                                ? AppTheme.darkTextPrimaryColor
                                : AppTheme.textPrimaryColor,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildLoadingScreen() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(),
          SizedBox(height: 24),
          Text(
            'Calculating your score...',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuizResultScreen() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final score = (_correctAnswers / _questions.length) * 100;
    final passed = score >= 70; // 70% passing score

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Result icon
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: passed
                      ? AppTheme.completedColor.withValues(alpha: 0.1)
                      : AppTheme.errorColor.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  passed ? Icons.check_circle : Icons.error,
                  color: passed ? AppTheme.completedColor : AppTheme.errorColor,
                  size: 60,
                ),
              ),
              const SizedBox(height: 24),

              // Result title
              Text(
                passed ? 'Congratulations!' : 'Quiz Failed',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: isDarkMode
                      ? AppTheme.darkTextPrimaryColor
                      : AppTheme.textPrimaryColor,
                ),
              ),
              const SizedBox(height: 16),

              // Score
              Text(
                'Your score: ${score.toInt()}%',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                  color: passed ? AppTheme.completedColor : AppTheme.errorColor,
                ),
              ),
              Text(
                '$_correctAnswers out of ${_questions.length} correct',
                style: TextStyle(
                  fontSize: 18,
                  color: isDarkMode
                      ? AppTheme.darkTextSecondaryColor
                      : AppTheme.textSecondaryColor,
                ),
              ),
              const SizedBox(height: 36),

              // Points earned card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isDarkMode ? AppTheme.darkSurfaceColor : Colors.white,
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
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.star,
                          color: Color(0xFFFFD700),
                          size: 32,
                        ),
                        const SizedBox(width: 16),
                        Text(
                          'You earned ${passed ? widget.module.pointsValue : 0} points!',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: isDarkMode
                                ? AppTheme.darkTextPrimaryColor
                                : AppTheme.textPrimaryColor,
                          ),
                        ),
                      ],
                    ),
                    if (passed)
                      const Column(
                        children: [
                          SizedBox(height: 16),
                          Text(
                            'Module completed successfully!',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 16,
                              color: AppTheme.completedColor,
                            ),
                          ),
                        ],
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 36),

              // Buttons
              Row(
                children: [
                  if (!passed)
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.primaryColor,
                          side: const BorderSide(color: AppTheme.primaryColor),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text('Try Again'),
                      ),
                    ),
                  if (!passed) const SizedBox(width: 16),
                  Expanded(
                    child: PrimaryButton(
                      text: 'Back to Module',
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      isLoading: false,
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
}
