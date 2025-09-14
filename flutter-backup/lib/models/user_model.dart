class UserModel {
  final String id;
  final String name;
  final String email;
  final String? companyCode;
  final String? profileImageUrl;
  final int points;
  final int? completedModules;
  final int? currentStreak;
  final bool isManager;
  final String? position;
  final DateTime? joinDate;
  final int? modulesCompleted;
  final int? quizzesCompleted;
  final DateTime? lastActive;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.companyCode,
    this.profileImageUrl,
    this.points = 0,
    this.completedModules = 0,
    this.currentStreak = 0,
    this.isManager = false,
    this.position,
    this.joinDate,
    this.modulesCompleted,
    this.quizzesCompleted,
    this.lastActive,
  });

  // Dummy data for UI development
  static UserModel dummyUser() {
    return UserModel(
      id: 'user123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      companyCode: 'ACME',
      profileImageUrl: null,
      points: 750,
      completedModules: 12,
      currentStreak: 5,
      isManager: false, // Set to true to see manager UI
      position: 'Sales Representative',
      joinDate: DateTime.now().subtract(const Duration(days: 90)),
      modulesCompleted: 12,
      quizzesCompleted: 12,
      lastActive: DateTime.now().subtract(const Duration(hours: 2)),
    );
  }

  // Copy with method for updating user data
  UserModel copyWith({
    String? id,
    String? name,
    String? email,
    String? companyCode,
    String? profileImageUrl,
    int? points,
    int? completedModules,
    int? currentStreak,
    bool? isManager,
    String? position,
    DateTime? joinDate,
    int? modulesCompleted,
    int? quizzesCompleted,
    DateTime? lastActive,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      companyCode: companyCode ?? this.companyCode,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      points: points ?? this.points,
      completedModules: completedModules ?? this.completedModules,
      currentStreak: currentStreak ?? this.currentStreak,
      isManager: isManager ?? this.isManager,
      position: position ?? this.position,
      joinDate: joinDate ?? this.joinDate,
      modulesCompleted: modulesCompleted ?? this.modulesCompleted,
      quizzesCompleted: quizzesCompleted ?? this.quizzesCompleted,
      lastActive: lastActive ?? this.lastActive,
    );
  }
}
