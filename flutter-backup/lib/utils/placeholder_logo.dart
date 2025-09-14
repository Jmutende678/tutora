import 'package:flutter/material.dart';

class PlaceholderLogo {
  static Widget getLogoWidget({double? size}) {
    final logoSize = size ?? 120.0;
    
    return Container(
      width: logoSize,
      height: logoSize,
      decoration: BoxDecoration(
        color: Colors.blue.shade100,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Center(
        child: Text(
          'T',
          style: TextStyle(
            fontSize: logoSize * 0.6,
            fontWeight: FontWeight.bold,
            color: Colors.blue.shade800,
          ),
        ),
      ),
    );
  }
} 