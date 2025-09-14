enum ModuleStatus {
  notStarted,
  inProgress,
  completed,
}

enum DifficultyLevel { beginner, intermediate, advanced }

class ModuleModel {
  final String id;
  final String title;
  final String description;
  final String? imageUrl;
  final int estimatedMinutes;
  final int pointsValue;
  final String category;
  final ModuleStatus status;
  final double progress; // 0.0 to 1.0
  final DifficultyLevel difficulty;
  final int duration; // in minutes
  final bool isCompleted;

  ModuleModel({
    required this.id,
    required this.title,
    required this.description,
    this.imageUrl,
    required this.estimatedMinutes,
    required this.pointsValue,
    required this.category,
    this.status = ModuleStatus.notStarted,
    this.progress = 0.0,
    this.difficulty = DifficultyLevel.beginner,
    this.duration = 0,
    this.isCompleted = false,
  });

  // Dummy data for UI development
  static List<ModuleModel> dummyModules() {
    return [
      ModuleModel(
        id: 'module1',
        title: 'Workplace Safety Fundamentals',
        description:
            'Learn the basics of workplace safety protocols and how to prevent common accidents in the workplace.',
        imageUrl:
            'https://images.unsplash.com/photo-1584735174965-52bbd47a2717?w=400&h=250&fit=crop',
        estimatedMinutes: 30,
        pointsValue: 100,
        category: 'Safety',
        status: ModuleStatus.completed,
        progress: 1.0,
        difficulty: DifficultyLevel.beginner,
        duration: 30,
        isCompleted: true,
      ),
      ModuleModel(
        id: 'module2',
        title: 'Customer Service Excellence',
        description:
            'Master the art of providing exceptional customer service and handling difficult situations.',
        imageUrl:
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop',
        estimatedMinutes: 45,
        pointsValue: 150,
        category: 'Service',
        status: ModuleStatus.inProgress,
        progress: 0.6,
        difficulty: DifficultyLevel.intermediate,
        duration: 45,
        isCompleted: false,
      ),
      ModuleModel(
        id: 'module3',
        title: 'Data Security Basics',
        description:
            'Understand the importance of data security and learn best practices to protect sensitive information.',
        imageUrl:
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
        estimatedMinutes: 25,
        pointsValue: 75,
        category: 'Compliance',
        status: ModuleStatus.notStarted,
        progress: 0.0,
        difficulty: DifficultyLevel.beginner,
        duration: 25,
        isCompleted: false,
      ),
      ModuleModel(
        id: 'module4',
        title: 'Effective Communication',
        description:
            'Improve your communication skills for better workplace collaboration and customer interactions.',
        imageUrl:
            'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=250&fit=crop',
        estimatedMinutes: 40,
        pointsValue: 120,
        category: 'Soft Skills',
        status: ModuleStatus.notStarted,
        progress: 0.0,
        difficulty: DifficultyLevel.intermediate,
        duration: 40,
        isCompleted: false,
      ),
      ModuleModel(
        id: 'module5',
        title: 'Time Management Strategies',
        description:
            'Learn effective techniques to manage your time and increase productivity in the workplace.',
        imageUrl:
            'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop',
        estimatedMinutes: 35,
        pointsValue: 100,
        category: 'Productivity',
        status: ModuleStatus.inProgress,
        progress: 0.3,
        difficulty: DifficultyLevel.advanced,
        duration: 35,
        isCompleted: false,
      ),
    ];
  }

  // Copy with method for updating module data
  ModuleModel copyWith({
    String? id,
    String? title,
    String? description,
    String? imageUrl,
    int? estimatedMinutes,
    int? pointsValue,
    String? category,
    ModuleStatus? status,
    double? progress,
    DifficultyLevel? difficulty,
    int? duration,
    bool? isCompleted,
  }) {
    return ModuleModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      imageUrl: imageUrl ?? this.imageUrl,
      estimatedMinutes: estimatedMinutes ?? this.estimatedMinutes,
      pointsValue: pointsValue ?? this.pointsValue,
      category: category ?? this.category,
      status: status ?? this.status,
      progress: progress ?? this.progress,
      difficulty: difficulty ?? this.difficulty,
      duration: duration ?? this.duration,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}
