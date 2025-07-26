# 🚀 Tutora Deployment Guide

## 🚨 CRITICAL: Preventing Version Drift

This guide prevents the recurring issue where wrong versions get deployed or good versions get overwritten.

## ✅ Pre-Deployment Checklist

### 1. Build Verification
```bash
cd tutora-admin-portal
npm run build
```
**✅ MUST PASS:** No TypeScript errors, React hooks warnings, or image optimization issues.

### 2. Environment Variables Check
Ensure these are set correctly on Vercel:
- `STRIPE_SECRET_KEY` (NOT ending with "HERE")
- `STRIPE_PUBLISHABLE_KEY`
- `OPENAI_API_KEY`
- `SUPABASE_*` variables
- `NEXTAUTH_SECRET`
- `JWT_SECRET`
- `SMTP_*` variables
- `NODE_ENV=production`

### 3. Pricing Page Verification
```bash
curl -s https://tutoralearn.com/pricing | grep -c "calculator\|cost breakdown"
```
**✅ EXPECTED:** Should return `0` (no calculator sections)

## 🔒 Version Control Safety

### Always Verify Before Deploy:
1. **Check Current Branch**: `git branch` (should be on `main`)
2. **Check Latest Commit**: `git log --oneline -1`
3. **Verify Pricing**: Check locally that pricing page has NO calculator
4. **Test Build**: `npm run build` must succeed

### Emergency Rollback Commands:
```bash
# If wrong version deploys, promote the correct one:
vercel promote https://tutora-CORRECT-ID.vercel.app --scope=johns-projects-eb6ca0cb

# Check available deployments:
vercel ls | head -10
```

## 🎯 Correct Pricing Page Structure

**✅ SHOULD HAVE:**
- Clean 3-plan layout: Starter ($89), Growth ($299), Professional ($699)
- Growth plan has "Most Popular" badge
- Enterprise as separate gradient section with crown icon
- NO calculator ("How many team members will use Tutora?")
- NO "Your Cost Breakdown" section

**❌ SHOULD NOT HAVE:**
- User count calculator
- Dynamic cost breakdown
- Calculator import from lucide-react

## 🚨 Common Issues & Solutions

### Issue 1: Stripe API Error
**Error:** `Invalid API Key provided: sk_test_***********************HERE`
**Solution:** Fix Vercel environment variable - remove "HERE" suffix

### Issue 2: React Hooks Warnings
**Error:** `React Hook useEffect has a missing dependency`
**Solution:** Add missing dependencies or wrap functions in `useCallback`

### Issue 3: Image Optimization
**Error:** `Using <img> could result in slower LCP`
**Solution:** Replace `<img>` with `import Image from 'next/image'`

### Issue 4: Version Drift
**Error:** Good pricing layout gets overwritten
**Solution:** 
1. Identify correct deployment ID from Vercel dashboard
2. Use `vercel promote` to restore good version
3. Update local code to match deployed version
4. Commit and push to prevent regression

## 📋 Deployment Workflow

1. **Make Changes** → Commit locally
2. **Test Build** → `npm run build` ✅
3. **Verify Pricing** → No calculator ✅
4. **Push to Git** → `git push origin main`
5. **Auto Deploy** → Vercel builds from main branch
6. **Verify Live** → Check https://tutoralearn.com/pricing
7. **If Wrong** → Use emergency rollback commands

## 🔧 Quick Fixes Reference

```bash
# Fix React hooks:
# Add missing dependencies to useEffect arrays
# Wrap functions in useCallback if needed

# Fix images:
# Replace <img> with <Image> from 'next/image'
# Add width/height props

# Fix Stripe:
# Update STRIPE_SECRET_KEY on Vercel
# Remove any "HERE" suffixes from API keys
```

## 🎯 Success Metrics

After deployment, verify:
- ✅ Build succeeds (no errors/warnings)
- ✅ Pricing page loads without calculator
- ✅ All environment variables set correctly
- ✅ No console errors in browser
- ✅ Module builder demo works

---

**💡 Remember:** Prevention is better than fixing. Always test locally before deploying! 