# 🎯 TUTORA LIVE DEMO CREDENTIALS

## 🔐 **Test Company Access**

### **Company Code for Mobile App Testing:**
```
TUT-2024-LIVE01
```

### **Company Details:**
- **Name**: Live Demo Company
- **Plan**: Premium (200 users)
- **Admin Email**: demo@tutoralearn.com

## 📱 **How to Test Mobile App:**

### **Step 1: Enter Company Code**
1. Open Flutter app
2. Enter company code: `TUT-2024-LIVE01`
3. App should find "Live Demo Company"

### **Step 2: Create Test User Account**
Since this is a live demo, you'll need to:
1. **Register a new user** through the web admin portal first
2. **Or** use Supabase auth to create a test user

## 🌐 **Web Admin Portal Testing:**

### **Step 1: Access Admin Portal**
- URL: `http://localhost:3000` (local) or your deployed URL
- Go to `/register` to create a new company
- Or go to `/admin` to view analytics

### **Step 2: Test Registration Flow**
1. Visit pricing page
2. Select a plan
3. Enter company details
4. Complete registration
5. Should create real company in database

## 💳 **Stripe Test Credentials**
When testing payments, use these **Stripe test card numbers**:

### **Successful Payment:**
- **Card**: `4242 4242 4242 4242`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

### **Failed Payment (for testing):**
- **Card**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

## 🎯 **What to Test:**

### **✅ Web Admin Portal:**
- [ ] Homepage loads without errors
- [ ] Pricing page displays correctly
- [ ] Registration flow works
- [ ] Company creation saves to database
- [ ] Admin dashboard shows real data
- [ ] Support ticket system works

### **✅ Mobile App:**
- [ ] Company code lookup works
- [ ] User authentication functions
- [ ] Training modules display
- [ ] Progress tracking works
- [ ] Offline sync capabilities

### **✅ Backend Integration:**
- [ ] Supabase connection established
- [ ] Real-time updates work
- [ ] Email notifications send
- [ ] Analytics track properly
- [ ] File uploads function

## 🚨 **Important Notes:**

### **Database State:**
- ✅ **All fake data removed**
- ✅ **Only 1 demo company** for testing
- ✅ **Production-ready structure**
- ✅ **Real user authentication**

### **Security:**
- 🔒 **Row Level Security** enabled
- 🔒 **API keys** properly configured
- 🔒 **Environment variables** secured
- 🔒 **No hardcoded secrets**

### **Performance:**
- ⚡ **Real database operations**
- ⚡ **Optimized queries**
- ⚡ **Proper indexing**
- ⚡ **Connection pooling**

## 🔧 **Troubleshooting:**

### **If Mobile App Can't Find Company:**
1. Check company code spelling: `TUT-2024-LIVE01`
2. Verify Supabase connection in app
3. Check network connectivity

### **If Registration Fails:**
1. Check browser console for errors
2. Verify Supabase credentials in .env.local
3. Check Supabase dashboard for connection issues

### **If No Data Appears:**
1. Verify database cleanup was successful
2. Check Supabase Table Editor
3. Look for JavaScript errors in console

## 📞 **Support:**
- **Issues**: Check browser/app console first
- **Database**: Use Supabase dashboard to verify data
- **Authentication**: Check Supabase Auth section

---
**Ready for production deployment! 🚀** 