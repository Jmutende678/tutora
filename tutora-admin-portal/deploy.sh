#!/bin/bash
echo "🚀 Deploying Tutora Admin Portal..."
if command -v vercel >/dev/null 2>&1; then
    vercel --prod
else
    echo "Installing Vercel CLI..."
    npm install -g vercel
    vercel --prod
fi
/Users/johnmutende/Downloads/tutora-main/tutora-admin-portal
