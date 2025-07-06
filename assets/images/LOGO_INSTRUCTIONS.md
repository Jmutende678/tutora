# 🎨 How to Add Your Tutora Logo

## Step 1: Save Your Logo
1. Save your blue cube logo as `tutora_logo.png`
2. Make sure it's **PNG format** with transparent background
3. Recommended size: **512x512 pixels** or larger

## Step 2: Add to Project
1. Copy `tutora_logo.png` to this folder: `assets/images/`
2. The file should be located at: `assets/images/tutora_logo.png`

## Step 3: Enable Custom Logo
1. Open file: `lib/utils/app_logo.dart`
2. Find line 6: `static const bool _useCustomLogo = false;`
3. Change it to: `static const bool _useCustomLogo = true;`

## Step 4: Apply Changes
1. Save the file
2. In terminal, press `r` for hot reload
3. Your logo will appear throughout the app! 🚀

## Your Logo Will Appear In:
- ✅ App header
- ✅ Navigation
- ✅ Login screens  
- ✅ Profile sections
- ✅ Admin dashboard

## Need Help?
If your logo doesn't appear, check:
- File name is exactly: `tutora_logo.png`
- File is in the correct folder: `assets/images/`
- You changed `_useCustomLogo` to `true`
- You saved the file and hot reloaded 