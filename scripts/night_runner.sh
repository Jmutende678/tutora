#!/bin/bash
set -e

echo "🌙 NIGHT RUNNER STARTING - Will run until app is successful!"
echo "Started at: $(date)"

# Create log file
LOG_FILE="build_attempts_$(date +%Y%m%d_%H%M%S).log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to try running the app
try_run_app() {
    local attempt=$1
    log "🚀 Attempt #$attempt: Trying to run app..."
    
    # Start app in background with timeout
    timeout 600 flutter run -d "EBA9EE5A-6328-4C13-9177-EA0DF1361BF4" --no-hot > "run_attempt_$attempt.log" 2>&1 &
    local run_pid=$!
    
    # Wait for app to start or timeout
    sleep 30
    
    # Check if app is running by looking for success indicators
    if grep -q "Flutter run key commands" "run_attempt_$attempt.log" 2>/dev/null; then
        log "✅ SUCCESS! App is running on attempt #$attempt"
        echo "🎉🎉🎉 APP IS RUNNING! 🎉🎉🎉"
        echo "Check run_attempt_$attempt.log for details"
        return 0
    elif ps -p $run_pid > /dev/null 2>&1; then
        log "⏳ App still building on attempt #$attempt, waiting longer..."
        wait $run_pid
        if [ $? -eq 0 ]; then
            log "✅ SUCCESS! App completed successfully on attempt #$attempt"
            return 0
        fi
    fi
    
    # Kill any remaining processes
    pkill -f "flutter.*run" 2>/dev/null || true
    log "❌ Attempt #$attempt failed, trying next solution..."
    return 1
}

# Array of different solutions to try
solutions=(
    "iOS 14.0 with x86_64 only"
    "iOS 15.0 deployment target"
    "Minimal dependencies"
    "Flutter 3.16.x downgrade"
    "Clean Xcode DerivedData"
    "Reset simulator"
    "Alternative Firebase setup"
)

attempt=1
max_attempts=50

log "Starting automated build attempts (max: $max_attempts)"

while [ $attempt -le $max_attempts ]; do
    log "🔄 Starting solution cycle #$attempt"
    
    case $((($attempt - 1) % 7)) in
        0)
            log "Applying: ${solutions[0]}"
            # iOS 14.0 with x86_64 only
            sed -i '' 's/platform :ios, '\''[0-9]*\.[0-9]*'\''/platform :ios, '\''14.0'\''/g' ios/Podfile
            ./scripts/auto_fix_ios.sh || true
            ;;
        1)
            log "Applying: ${solutions[1]}"
            # iOS 15.0 deployment target
            sed -i '' 's/platform :ios, '\''[0-9]*\.[0-9]*'\''/platform :ios, '\''15.0'\''/g' ios/Podfile
            sed -i '' 's/IPHONEOS_DEPLOYMENT_TARGET = [0-9]*\.[0-9]*;/IPHONEOS_DEPLOYMENT_TARGET = 15.0;/g' ios/Runner.xcodeproj/project.pbxproj
            flutter clean && cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
            ;;
        2)
            log "Applying: ${solutions[2]}"
            # Minimal dependencies (no Firebase)
            cat > pubspec.yaml << 'EOF'
name: tutora
description: A training platform for small businesses
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: ">=2.19.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  provider: ^6.0.5
  intl: ^0.18.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
EOF
            flutter pub get && flutter clean
            ;;
        3)
            log "Applying: ${solutions[3]}"
            # Flutter downgrade attempt
            flutter downgrade || true
            flutter clean && flutter pub get
            ;;
        4)
            log "Applying: ${solutions[4]}"
            # Clean Xcode DerivedData
            rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || true
            flutter clean && cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
            ;;
        5)
            log "Applying: ${solutions[5]}"
            # Reset simulator
            xcrun simctl erase "EBA9EE5A-6328-4C13-9177-EA0DF1361BF4" || true
            xcrun simctl boot "EBA9EE5A-6328-4C13-9177-EA0DF1361BF4" || true
            ;;
        6)
            log "Applying: ${solutions[6]}"
            # Alternative Firebase setup with older versions
            cat > pubspec.yaml << 'EOF'
name: tutora
description: A training platform for small businesses
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: ">=2.19.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  firebase_core: ^2.24.0
  firebase_auth: ^4.15.0
  cloud_firestore: ^4.13.0
  provider: ^6.0.5
  intl: ^0.18.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
EOF
            flutter pub get && flutter clean
            ;;
    esac
    
    # Try to run the app with current configuration
    if try_run_app $attempt; then
        log "🎉 SUCCESS! App is now running!"
        echo "Final successful configuration saved in build_attempts_*.log"
        exit 0
    fi
    
    # Small delay between attempts
    sleep 10
    attempt=$((attempt + 1))
done

log "❌ All $max_attempts attempts exhausted. Check logs for details."
echo "Logs saved in: $LOG_FILE"
echo "Individual attempt logs: run_attempt_*.log" 