import 'package:flutter/material.dart';
import 'package:tutora/screens/home_screen.dart';
import 'package:tutora/screens/leaderboard_screen.dart';
import 'package:tutora/screens/admin/admin_dashboard.dart';
import 'package:tutora/widgets/bottom_nav_bar.dart';

class MainApp extends StatefulWidget {
  final bool isAdmin;
  
  const MainApp({
    super.key,
    this.isAdmin = false,
  });

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  int _currentIndex = 0;
  late PageController _pageController;
  
  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _currentIndex);
  }
  
  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }
  
  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
      _pageController.animateToPage(
        index,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        onPageChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        children: [
          const HomeScreen(),
          const Center(child: Text('Modules Screen')),
          const LeaderboardScreen(),
          const Center(child: Text('Profile Screen')),
          if (widget.isAdmin) const AdminDashboardScreen(),
        ],
      ),
      bottomNavigationBar: BottomNavBar(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
        isManager: widget.isAdmin,
      ),
    );
  }
} 