import 'dart:typed_data';
import 'dart:convert';
import 'package:flutter/material.dart';

class FileUploadMock {
  /// Simulates a file upload and returns a mock response
  static Future<Map<String, dynamic>> uploadFile(Uint8List fileBytes, {String fileType = 'image'}) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Convert the file to a base64 string (for demonstration purposes)
    final base64String = base64Encode(fileBytes);
    final fileId = 'mock_file_${DateTime.now().millisecondsSinceEpoch}';
    
    // Return mock response
    return {
      'success': true,
      'message': 'File uploaded successfully',
      'fileId': fileId,
      'fileUrl': 'https://example.com/uploads/mock_file.png',
      'fileType': fileType,
      'fileSize': fileBytes.length,
      'base64Data': '${base64String.substring(0, 100)}...' // Truncated for display
    };
  }

  /// Creates a mock placeholder image when no image is selected
  static Image getPlaceholderImage({double width = 120, double height = 120}) {
    return Image.memory(
      _createPlaceholderImageBytes(),
      width: width,
      height: height,
      fit: BoxFit.cover,
    );
  }

  /// Creates a simple colored square as placeholder
  static Uint8List _createPlaceholderImageBytes() {
    // Create a simple 1x1 pixel transparent image
    return Uint8List.fromList([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
  }

  /// Converts a base64 string to Uint8List for image display
  static Uint8List base64ToBytes(String base64String) {
    return base64Decode(base64String);
  }

  /// Converts a file to base64 string
  static Future<String> fileToBase64(Uint8List fileBytes) async {
    return base64Encode(fileBytes);
  }
} 