import 'dart:async';

import 'package:flutter/material.dart';
import 'package:tutora/models/module_model.dart';
import 'package:tutora/screens/quiz_screen.dart';
import 'package:tutora/theme/app_theme.dart';
import 'package:tutora/widgets/primary_button.dart';

class VideoPlayerScreen extends StatefulWidget {
  final ModuleModel module;
  final String videoTitle;
  final String videoUrl;
  final bool isUnskippable;

  const VideoPlayerScreen({
    super.key,
    required this.module,
    required this.videoTitle,
    required this.videoUrl,
    this.isUnskippable = true,
  });

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  bool _isPlaying = false;
  bool _isBuffering = true;
  bool _hasWatchedEnough = false;
  bool _showControls = true;
  double _currentPosition = 0;
  final double _duration = 100; // Will be set from actual video duration
  Timer? _hideControlsTimer;
  Timer? _progressTimer;

  @override
  void initState() {
    super.initState();
    // In a real app, we would initialize a video player package here
    _simulateVideoLoading();
  }

  @override
  void dispose() {
    _hideControlsTimer?.cancel();
    _progressTimer?.cancel();
    super.dispose();
  }

  void _simulateVideoLoading() async {
    // Simulate video loading delay
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      setState(() {
        _isBuffering = false;
      });
    }
  }

  void _togglePlayPause() {
    setState(() {
      _isPlaying = !_isPlaying;
      if (_isPlaying) {
        _startProgressTimer();
        _resetHideControlsTimer();
      } else {
        _progressTimer?.cancel();
      }
    });
  }

  void _startProgressTimer() {
    _progressTimer?.cancel();
    _progressTimer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      if (_currentPosition < _duration) {
        setState(() {
          _currentPosition += 0.5;

          // Mark as watched enough when 90% complete
          if (widget.isUnskippable && _currentPosition / _duration > 0.9) {
            _hasWatchedEnough = true;
          }

          // Auto-pause at the end
          if (_currentPosition >= _duration) {
            _isPlaying = false;
            _progressTimer?.cancel();
            _hasWatchedEnough = true;
            _showControls = true;
          }
        });
      }
    });
  }

  void _resetHideControlsTimer() {
    _hideControlsTimer?.cancel();
    _hideControlsTimer = Timer(const Duration(seconds: 3), () {
      if (mounted && _isPlaying) {
        setState(() {
          _showControls = false;
        });
      }
    });
  }

  void _showControlsTemporarily() {
    setState(() {
      _showControls = true;
    });
    _resetHideControlsTimer();
  }

  void _seek(double position) {
    if (widget.isUnskippable &&
        position > _currentPosition &&
        !_hasWatchedEnough) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('You must watch the video before skipping ahead'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
      return;
    }

    setState(() {
      _currentPosition = position;
    });
    _resetHideControlsTimer();
  }

  String _formatDuration(double seconds) {
    final int mins = seconds ~/ 60;
    final int secs = (seconds % 60).round();
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  void _proceedToQuiz() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => QuizScreen(module: widget.module),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(widget.videoTitle),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
        titleTextStyle: const TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      body: GestureDetector(
        onTap: _showControlsTemporarily,
        child: Stack(
          children: [
            // Video display
            Center(
              child: _isBuffering
                  ? const CircularProgressIndicator(color: Colors.white)
                  : Container(
                      color: Colors.black,
                      child: Center(
                        child: Container(
                          width: 200,
                          height: 120,
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(
                            Icons.play_circle_fill,
                            size: 60,
                            color: AppTheme.primaryColor,
                          ),
                        ),
                      ),
                    ),
            ),

            // Video controls overlay (shown/hidden based on _showControls)
            if (_showControls)
              Container(
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.5),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    // Play/pause and seeker bar
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: [
                          // Current position
                          Text(
                            _formatDuration(_currentPosition),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(width: 8),

                          // Seek bar
                          Expanded(
                            child: SliderTheme(
                              data: SliderThemeData(
                                trackHeight: 4,
                                activeTrackColor: AppTheme.primaryColor,
                                inactiveTrackColor: Colors.grey.shade600,
                                thumbColor: AppTheme.primaryColor,
                                thumbShape: const RoundSliderThumbShape(
                                  enabledThumbRadius: 6,
                                ),
                              ),
                              child: Slider(
                                value: _currentPosition,
                                min: 0,
                                max: _duration,
                                onChanged: _seek,
                              ),
                            ),
                          ),

                          const SizedBox(width: 8),

                          // Total duration
                          Text(
                            _formatDuration(_duration),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Controls
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          IconButton(
                            icon: Icon(Icons.replay_10),
                            color: Colors.white,
                            onPressed: () => _seek(_currentPosition - 10 < 0
                                ? 0
                                : _currentPosition - 10),
                          ),
                          FloatingActionButton(
                            onPressed: _togglePlayPause,
                            backgroundColor: AppTheme.primaryColor,
                            child: Icon(
                              _isPlaying ? Icons.pause : Icons.play_arrow,
                              size: 32,
                            ),
                          ),
                          IconButton(
                            icon: Icon(Icons.forward_10),
                            color: Colors.white,
                            onPressed: () {
                              if (widget.isUnskippable && !_hasWatchedEnough) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text(
                                        'You must watch the video before skipping ahead'),
                                    backgroundColor: AppTheme.errorColor,
                                  ),
                                );
                                return;
                              }
                              _seek(_currentPosition + 10 > _duration
                                  ? _duration
                                  : _currentPosition + 10);
                            },
                          ),
                        ],
                      ),
                    ),

                    // Unskippable indicator
                    if (widget.isUnskippable)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        margin: const EdgeInsets.only(
                          bottom: 16,
                          left: 16,
                          right: 16,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.7),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              _hasWatchedEnough
                                  ? Icons.check_circle
                                  : Icons.warning,
                              color: _hasWatchedEnough
                                  ? Colors.green
                                  : Colors.amber,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _hasWatchedEnough
                                  ? 'Video completed! You can now take the quiz.'
                                  : 'This video must be watched before proceeding',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),

            // Video completion overlay
            if (_currentPosition >= _duration)
              Container(
                width: double.infinity,
                color: Colors.black.withValues(alpha: 0.8),
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: Colors.green.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.check_circle,
                        color: Colors.green,
                        size: 60,
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Video Completed!',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'You\'ve earned ${widget.module.pointsValue ~/ 2} points for watching this lesson',
                      style: const TextStyle(
                        fontSize: 16,
                        color: Colors.white70,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 36),
                    const Text(
                      'Ready to test your knowledge?',
                      style: TextStyle(
                        fontSize: 18,
                        color: AppTheme.primaryColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 24),
                    PrimaryButton(
                      text: 'Take the Quiz',
                      onPressed: _proceedToQuiz,
                      isLoading: false,
                    ),
                    const SizedBox(height: 16),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _currentPosition = 0;
                          _isPlaying = false;
                        });
                      },
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Watch Again'),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
