# 🔧 Railway Email Fix - Connection Timeout Issue

## 🔍 **Problem Identified:**
Your Railway logs show: `❌ Failed to initialize email service: Error: Connection timeout`

This means Railway's servers can't connect to Gmail SMTP on port 587.

## ✅ **Solution: Update Railway Environment Variables**

**Change these variables in Railway:**

### **OLD Settings (causing timeout):**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### **NEW Settings (Railway compatible):**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
```

**Keep these the same:**
```bash
SMTP_USER=admin@tutoralearn.com
SMTP_PASS=lftaxsmtgfoecihi
ADMIN_EMAIL=admin@tutoralearn.com
```

## 🚀 **Steps to Fix:**

1. **Go to Railway Dashboard**
2. **Click your Tutora service**
3. **Go to "Variables" tab**
4. **Edit `SMTP_PORT`**: Change from `587` to `465`
5. **Save and redeploy**

## 🧪 **Test After Fix:**

Visit: `https://your-railway-domain.railway.app/api/send-test-email`

You should see:
```json
{
  "status": "SUCCESS",
  "message": "Test email sent successfully!"
}
```

## 📧 **Why This Fixes It:**

- **Port 587**: Uses STARTTLS (often blocked by hosting providers)
- **Port 465**: Uses SSL/TLS (more reliable on Railway)
- **Longer timeouts**: Gives more time for connection
- **TLS settings**: Better compatibility with Railway's network

## 🔥 **Expected Result:**

After this fix, your logs should show:
```
✅ Email service initialized successfully
📧 Simple email notification sent
```

Instead of:
```
❌ Failed to initialize email service: Error: Connection timeout
📧 Will log emails to console instead
```

**This should fix your email notifications immediately!** 🎯
