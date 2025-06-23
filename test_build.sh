#!/bin/bash

# Quick test for Cloud Build upload issue
# This script tests if files are properly uploaded to Cloud Build

echo "🔍 Testing Cloud Build file upload..."

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No project set. Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📍 Project: $PROJECT_ID"
echo "📂 Current directory: $(pwd)"

# Check required files
echo ""
echo "📋 Checking required files..."
required_files=("Dockerfile" "requirements.txt" "main.py")

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file exists ($(wc -l < "$file") lines)"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Check .gcloudignore
echo ""
echo "🔍 Checking .gcloudignore..."
if [[ -f ".gcloudignore" ]]; then
    if grep -q "^Dockerfile$" .gcloudignore; then
        echo "❌ Error: Dockerfile is ignored in .gcloudignore"
        echo "Please remove 'Dockerfile' from .gcloudignore"
        exit 1
    else
        echo "✅ Dockerfile is not ignored"
    fi
    
    if grep -q "^requirements.txt$" .gcloudignore; then
        echo "❌ Error: requirements.txt is ignored in .gcloudignore"
        exit 1
    else
        echo "✅ requirements.txt is not ignored"
    fi
else
    echo "⚠️  No .gcloudignore file found"
fi

# Test build submission with a simple tag
echo ""
echo "🧪 Testing Cloud Build submission..."
IMAGE_URL="gcr.io/$PROJECT_ID/nhl-commentary-test"

echo "Building test image: $IMAGE_URL"
echo "This will help identify the exact issue..."

gcloud builds submit --tag $IMAGE_URL . || {
    echo ""
    echo "❌ Build failed. Common solutions:"
    echo "1. Check .gcloudignore doesn't exclude Dockerfile"
    echo "2. Ensure you're in the correct directory"
    echo "3. Verify gcloud project is set correctly"
    echo "4. Check Dockerfile syntax"
    exit 1
}

echo ""
echo "🎉 Test build successful!"
echo "✅ Files are being uploaded correctly"
echo "✅ Dockerfile is valid"
echo "✅ Ready for actual deployment"

# Clean up test image
echo ""
echo "🧹 Cleaning up test image..."
gcloud container images delete $IMAGE_URL --quiet || echo "⚠️  Could not delete test image (this is ok)"

echo ""
echo "🚀 Ready to deploy! Run: ./deploy_cloudrun.sh"