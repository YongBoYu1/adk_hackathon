#!/bin/bash

# NHL Live Commentary System - Google Cloud Deployment Script
# This script deploys the application to Google App Engine

set -e  # Exit on any error

echo "🏒 NHL Live Commentary System - Google Cloud Deployment"
echo "=================================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed."
    echo "Please install Google Cloud SDK from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Error: Not authenticated with Google Cloud."
    echo "Please run: gcloud auth login"
    exit 1
fi

# Get the current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No Google Cloud project set."
    echo "Please run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📍 Project ID: $PROJECT_ID"

# Check if App Engine is enabled
echo "🔍 Checking App Engine status..."
if ! gcloud app describe --project=$PROJECT_ID &>/dev/null; then
    echo "⚠️  App Engine is not initialized for this project."
    echo "Initializing App Engine..."
    
    # Prompt for region
    echo "Please select a region for App Engine:"
    echo "Common regions:"
    echo "  us-central1 (Iowa)"
    echo "  us-east1 (South Carolina)"
    echo "  us-west1 (Oregon)"
    echo "  europe-west1 (Belgium)"
    echo "  asia-northeast1 (Tokyo)"
    
    read -p "Enter region (e.g., us-central1): " REGION
    
    if [ -z "$REGION" ]; then
        echo "❌ Error: Region is required."
        exit 1
    fi
    
    gcloud app create --region=$REGION --project=$PROJECT_ID
    echo "✅ App Engine initialized in region: $REGION"
fi

# Set environment variables (if provided)
echo "🔧 Setting up environment variables..."

# Check if API keys are provided as environment variables
if [ -n "$GEMINI_API_KEY" ]; then
    echo "✅ GEMINI_API_KEY found in environment"
else
    echo "⚠️  GEMINI_API_KEY not found in environment"
    echo "You can set it later using: gcloud app versions set-environment-variables"
fi

if [ -n "$GOOGLE_API_KEY" ]; then
    echo "✅ GOOGLE_API_KEY found in environment"
else
    echo "⚠️  GOOGLE_API_KEY not found in environment"
    echo "You can set it later using: gcloud app versions set-environment-variables"
fi

# Deploy the application
echo "🚀 Deploying to Google App Engine..."
echo "This may take several minutes..."

gcloud app deploy app.yaml --project=$PROJECT_ID --quiet

# Get the deployed URL
URL=$(gcloud app browse --no-launch-browser --project=$PROJECT_ID 2>&1 | grep -o 'https://[^[:space:]]*')

echo ""
echo "🎉 Deployment Successful!"
echo "=================================================="
echo "🌐 Application URL: $URL"
echo "📊 App Engine Console: https://console.cloud.google.com/appengine?project=$PROJECT_ID"
echo ""
echo "📋 Next Steps:"
echo "1. Set API keys if not already set:"
echo "   gcloud app versions set-environment-variables GEMINI_API_KEY=your_key GOOGLE_API_KEY=your_key"
echo ""
echo "2. Monitor logs:"
echo "   gcloud app logs tail -s nhl-commentary"
echo ""
echo "3. Access your application:"
echo "   $URL"
echo ""
echo "🏒 Happy commenting!"