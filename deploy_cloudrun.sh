#!/bin/bash

# NHL Live Commentary System - Cloud Run Deployment Script
# Optimized deployment to Google Cloud Run with AI workloads support

set -e  # Exit on any error

echo "🏒 NHL Live Commentary System - Cloud Run Deployment"
echo "=================================================="

# Configuration
SERVICE_NAME="nhl-commentary"
REGION="us-central1"  # Change this to your preferred region
MIN_INSTANCES=0
MAX_INSTANCES=10
MEMORY="8Gi"
CPU="4"
TIMEOUT="3600s"  # 1 hour for complex AI processing

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed."
    echo "Please install Google Cloud SDK from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed."
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
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
echo "🌍 Region: $REGION"
echo "🚀 Service Name: $SERVICE_NAME"

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com --project=$PROJECT_ID

# Build and deploy using Cloud Build
echo "🏗️  Building container image with Cloud Build..."
echo "This may take several minutes..."

IMAGE_URL="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Verify required files before building
echo "📋 Verifying required files for Cloud Build..."
if [[ ! -f "Dockerfile" ]]; then
    echo "❌ Error: Dockerfile not found in current directory"
    exit 1
fi

if [[ ! -f "requirements.txt" ]]; then
    echo "❌ Error: requirements.txt not found in current directory"
    exit 1
fi

echo "✅ Dockerfile found"
echo "✅ requirements.txt found"

# Show what will be uploaded
echo "📦 Files to be uploaded:"
echo "Current directory: $(pwd)"
ls -la Dockerfile requirements.txt main.py 2>/dev/null || echo "Some files missing"

# Build the container image
echo "🏗️  Submitting build to Cloud Build..."
gcloud builds submit --tag $IMAGE_URL --project=$PROJECT_ID .

echo "✅ Container image built successfully"

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."

# Prepare environment variables
ENV_VARS=""
if [ -n "$GEMINI_API_KEY" ]; then
    ENV_VARS="$ENV_VARS,GEMINI_API_KEY=$GEMINI_API_KEY"
    echo "✅ GEMINI_API_KEY added to deployment"
fi

if [ -n "$GOOGLE_API_KEY" ]; then
    ENV_VARS="$ENV_VARS,GOOGLE_API_KEY=$GOOGLE_API_KEY"
    echo "✅ GOOGLE_API_KEY added to deployment"
fi

# Remove leading comma if present
ENV_VARS=$(echo $ENV_VARS | sed 's/^,//')

# Deploy command
DEPLOY_CMD="gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_URL \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory $MEMORY \
    --cpu $CPU \
    --timeout $TIMEOUT \
    --min-instances $MIN_INSTANCES \
    --max-instances $MAX_INSTANCES \
    --port 8080 \
    --project $PROJECT_ID"

# Add environment variables if they exist
if [ -n "$ENV_VARS" ]; then
    DEPLOY_CMD="$DEPLOY_CMD --set-env-vars $ENV_VARS"
fi

# Execute deployment
eval $DEPLOY_CMD

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID)

echo ""
echo "🎉 Deployment Successful!"
echo "=================================================="
echo "🌐 Service URL: $SERVICE_URL"
echo "📊 Cloud Run Console: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME?project=$PROJECT_ID"
echo "🔍 Container Registry: https://console.cloud.google.com/gcr/images/$PROJECT_ID?project=$PROJECT_ID"
echo ""
echo "📋 Service Configuration:"
echo "   Memory: $MEMORY"
echo "   CPU: $CPU"
echo "   Timeout: $TIMEOUT"
echo "   Min Instances: $MIN_INSTANCES"
echo "   Max Instances: $MAX_INSTANCES"
echo ""
echo "📋 Next Steps:"
echo "1. Test your service: curl $SERVICE_URL"
echo ""
echo "2. Set environment variables (if not set during deployment):"
echo "   gcloud run services update $SERVICE_NAME \\"
echo "     --region $REGION \\"
echo "     --set-env-vars GEMINI_API_KEY=your_key,GOOGLE_API_KEY=your_key"
echo ""
echo "3. Monitor logs:"
echo "   gcloud run logs tail --service $SERVICE_NAME --region $REGION"
echo ""
echo "4. Access your application:"
echo "   $SERVICE_URL"
echo ""
echo "💰 Estimated Cost: Cloud Run charges only when serving requests"
echo "🏒 Happy commenting!"