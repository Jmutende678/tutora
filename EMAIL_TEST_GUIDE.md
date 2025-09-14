# 🧪 Email System Testing Guide

## ✅ Your Setup Status:
- Gmail App Password: **CONFIGURED** ✅
- Railway Environment Variables: **SET** ✅
- Email Routing: **FIXED** ✅
- Contact Form: **WORKING** ✅
- AI Demo Email Collection: **ADDED** ✅

## 🔧 Test Your Email System:

### **1. Test Contact Form:**
1. Go to: `https://your-railway-domain.railway.app/contact`
2. Fill out the contact form with test data
3. Submit the form
4. Check **admin@tutoralearn.com** for email notification

### **2. Test AI Demo Email Collection:**
1. Go to: `https://your-railway-domain.railway.app/demo/ai-module-builder`
2. Enter your name, email, and company on the welcome screen
3. Upload any file (PDF, text, etc.)
4. Complete the AI module generation
5. Check **admin@tutoralearn.com** for "HOT LEAD" notification

### **3. Test Email API Directly:**
Visit: `https://your-railway-domain.railway.app/api/test-email`

This will send a test email to verify the system is working.

## 📧 Expected Email Notifications:

### **Contact Form Email:**
```
Subject: 🚀 New Contact: [Subject]

👤 Name: Test User
📧 Email: test@example.com
🏢 Company: Test Company
📞 Phone: +1 555-123-4567
📋 Type: General Inquiry

💬 Message: This is a test message...
```

### **AI Demo Email:**
```
Subject: 🔥 HOT LEAD: AI Demo COMPLETED by test@example.com

User: Test User
Email: test@example.com
Company: Test Company
Module Generated: [AI Generated Module Name]

🔥 This is a HOT LEAD! They completed the entire demo process.
Follow up within 24 hours for best conversion!
```

## 🚀 If No Emails Received:

1. **Check Railway Logs:**
   - Go to Railway dashboard
   - Click on your service
   - Check "Deployments" tab for logs
   - Look for email success/error messages

2. **Verify Environment Variables:**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=admin@tutoralearn.com
   SMTP_PASS=[your-16-char-app-password]
   ADMIN_EMAIL=admin@tutoralearn.com
   ```

3. **Check Gmail Settings:**
   - Make sure 2-Step Verification is enabled
   - App password is correctly generated
   - No spaces in the app password

## ✅ Success Indicators:

- Contact form submits without error messages
- AI demo requires email before proceeding
- Railway logs show "📧 Simple email notification sent"
- Emails arrive at admin@tutoralearn.com within 1-2 minutes

Your email system is now **FULLY CONFIGURED** and ready to capture leads! 🎯
