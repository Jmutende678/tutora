enum QuestionType {
  multipleChoice,
  trueFalse,
  fillInTheBlank,
  dragAndDrop,
}

class QuizQuestion {
  final String id;
  final String questionText;
  final QuestionType type;
  final List<String> options;
  final List<String> correctAnswers;
  
  QuizQuestion({
    required this.id,
    required this.questionText,
    required this.type,
    required this.options,
    required this.correctAnswers,
  });
  
  // Validate user's answer
  bool checkAnswer(dynamic userAnswer) {
    if (type == QuestionType.multipleChoice || type == QuestionType.trueFalse) {
      // For multiple choice, compare selected option indices
      if (userAnswer is List<int>) {
        // Convert indices to options
        final selectedOptions = userAnswer.map((index) => options[index]).toList();
        // Check if all correct answers are selected and no incorrect answers are selected
        return correctAnswers.every((answer) => selectedOptions.contains(answer)) &&
               selectedOptions.every((selected) => correctAnswers.contains(selected));
      }
      // For true/false or single selection
      else if (userAnswer is int) {
        return correctAnswers.contains(options[userAnswer]);
      }
    } else if (type == QuestionType.fillInTheBlank) {
      // For fill in the blank, compare text
      if (userAnswer is String) {
        return correctAnswers.any((answer) => 
          answer.toLowerCase() == userAnswer.toLowerCase().trim());
      }
    } else if (type == QuestionType.dragAndDrop) {
      // For drag and drop, compare order
      if (userAnswer is List<int>) {
        return userAnswer.every((index) => 
          options[index] == correctAnswers[userAnswer.indexOf(index)]);
      }
    }
    return false;
  }
  
  // Dummy questions for the quiz
  static List<QuizQuestion> dummyQuestions() {
    return [
      QuizQuestion(
        id: 'q1',
        questionText: 'Which of the following are important aspects of workplace safety?',
        type: QuestionType.multipleChoice,
        options: [
          'Proper use of equipment',
          'Emergency procedures',
          'Personal protective equipment',
          'Taking shortcuts to complete tasks faster'
        ],
        correctAnswers: [
          'Proper use of equipment',
          'Emergency procedures',
          'Personal protective equipment'
        ],
      ),
      QuizQuestion(
        id: 'q2',
        questionText: 'True or False: It\'s acceptable to ignore minor safety violations to meet deadlines.',
        type: QuestionType.trueFalse,
        options: ['True', 'False'],
        correctAnswers: ['False'],
      ),
      QuizQuestion(
        id: 'q3',
        questionText: 'Fill in the blank: The first step in case of a workplace emergency is to ______.',
        type: QuestionType.fillInTheBlank,
        options: [],
        correctAnswers: ['alert others', 'raise alarm', 'call for help', 'notify supervisor'],
      ),
      QuizQuestion(
        id: 'q4',
        questionText: 'Which of the following should you do when handling confidential customer information?',
        type: QuestionType.multipleChoice,
        options: [
          'Share it only with authorized personnel',
          'Store it securely according to company policy',
          'Discuss it openly with colleagues to improve service',
          'Password protect sensitive files'
        ],
        correctAnswers: [
          'Share it only with authorized personnel',
          'Store it securely according to company policy',
          'Password protect sensitive files'
        ],
      ),
      QuizQuestion(
        id: 'q5',
        questionText: 'True or False: Regular training and upskilling are important for career growth.',
        type: QuestionType.trueFalse,
        options: ['True', 'False'],
        correctAnswers: ['True'],
      ),
    ];
  }
}

class QuizResult {
  final String quizId;
  final int totalQuestions;
  final int correctAnswers;
  final int pointsEarned;
  final Duration timeTaken;
  
  QuizResult({
    required this.quizId,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.pointsEarned,
    required this.timeTaken,
  });
  
  double get scorePercentage => (correctAnswers / totalQuestions) * 100;
  
  bool get isPassed => scorePercentage >= 70; // 70% is passing score
} 