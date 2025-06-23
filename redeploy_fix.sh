#!/bin/bash

# Quick redeploy script to fix missing dependencies
# This script rebuilds and redeploys with the updated requirements.txt

set -e

echo "🔧 NHL Live Commentary - Quick Fix Redeploy"
echo "==========================================="

# Get project info
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
SERVICE_NAME="nhl-commentary"
IMAGE_URL="gcr.io/$PROJECT_ID/$SERVICE_NAME"

if [ -z "$PROJECT_ID" ]; then
    echo "❌ No project set. Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📍 Project: $PROJECT_ID"
echo "🚀 Service: $SERVICE_NAME"

# Check if the missing dependency was added
echo ""
echo "🔍 Verifying requirements.txt fix..."
if grep -q "google-generativeai" requirements.txt; then
    echo "✅ google-generativeai dependency added"
else
    echo "❌ google-generativeai still missing in requirements.txt"
    exit 1
fi

# Rebuild with updated dependencies
echo ""
echo "🏗️  Rebuilding with updated dependencies..."
echo "This will take a few minutes..."

gcloud builds submit --tag $IMAGE_URL .

echo "✅ New image built successfully"

# Get current service configuration for environment variables
echo ""
echo "🔄 Redeploying service..."

# Deploy with same configuration but new image
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_URL \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --memory 8Gi \
    --cpu 4 \
    --timeout 3600s \
    --min-instances 0 \
    --max-instances 10 \
    --quiet

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region us-central1 --format 'value(status.url)')

echo ""
echo "🎉 Redeploy successful!"
echo "=========================="
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "📋 Changes applied:"
echo "   ✅ Added google-generativeai>=0.8.0"
echo "   ✅ Rebuilt container with new dependencies"
echo "   ✅ Redeployed to Cloud Run"
echo ""
echo "🧪 Test the fix:"
echo "   curl $SERVICE_URL"
echo ""
echo "📊 Monitor logs:"
echo "   gcloud run logs tail --service $SERVICE_NAME --region us-central1"
echo ""
echo "🏒 Dependencies fixed - ready for commentary generation!"