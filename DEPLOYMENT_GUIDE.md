# NHL Live Commentary System - Google Cloud Deployment Guide

## Prerequisites

1. **Google Cloud Account**: Create a Google Cloud account if you don't have one
2. **Google Cloud Project**: Create a new project or use an existing one
3. **Google Cloud SDK**: Install the gcloud CLI tool
4. **API Keys**: Obtain GEMINI_API_KEY and GOOGLE_API_KEY

## Quick Deployment (Recommended)

### Step 1: Install Google Cloud SDK
```bash
# Download and install from: https://cloud.google.com/sdk/docs/install
# Or use package manager:

# macOS (with Homebrew)
brew install --cask google-cloud-sdk

# Ubuntu/Debian
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### Step 2: Authenticate and Setup
```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable appengine.googleapis.com
gcloud services enable texttospeech.googleapis.com
```

### Step 3: Deploy Using Script
```bash
# Make the deployment script executable (if not already)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

## Manual Deployment

### Step 1: Prepare Environment Variables
```bash
# Set your API keys
export GEMINI_API_KEY="your_gemini_api_key_here"
export GOOGLE_API_KEY="your_google_api_key_here"
```

### Step 2: Deploy to App Engine
```bash
# Deploy the application
gcloud app deploy app.yaml

# Set environment variables in App Engine
gcloud app versions set-environment-variables \
  GEMINI_API_KEY="your_gemini_api_key_here" \
  GOOGLE_API_KEY="your_google_api_key_here"
```

## Post-Deployment Configuration

### Setting API Keys (if not set during deployment)
```bash
gcloud app versions set-environment-variables \
  GEMINI_API_KEY="your_gemini_api_key_here" \
  GOOGLE_API_KEY="your_google_api_key_here"
```

### Monitor Application
```bash
# View logs
gcloud app logs tail -s nhl-commentary

# View application info
gcloud app describe

# Open application in browser
gcloud app browse
```

## Troubleshooting

### Common Issues

1. **"App Engine is not initialized"**
   ```bash
   gcloud app create --region=us-central1
   ```

2. **"API not enabled"**
   ```bash
   gcloud services enable appengine.googleapis.com
   gcloud services enable texttospeech.googleapis.com
   ```

3. **Memory issues during deployment**
   - The app.yaml is configured with 8GB memory
   - If you need more, edit the `memory_gb` value in app.yaml

4. **Timeout issues**
   - The app.yaml includes a 300-second timeout
   - For longer AI processing, increase the timeout value

### Checking Deployment Status
```bash
# List app versions
gcloud app versions list --service=nhl-commentary

# Check service status
gcloud app services list

# View detailed logs
gcloud app logs read --service=nhl-commentary --limit=50
```

## Configuration Files

- **app.yaml**: App Engine configuration
- **main.py**: Entry point for App Engine
- **requirements.txt**: Python dependencies
- **.gcloudignore**: Files to exclude from deployment

## Architecture Notes

- The application runs on App Engine Standard Environment
- Python 3.9 runtime
- Automatic scaling (1-10 instances)
- 8GB memory per instance for AI processing
- WebSocket support enabled for real-time audio streaming

## Security Considerations

1. **API Keys**: Set via environment variables, not in code
2. **HTTPS**: All traffic is forced to HTTPS
3. **IAM**: Use service accounts with minimal required permissions

## Monitoring and Maintenance

### View Application Metrics
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Navigate to App Engine > Dashboard
- Monitor CPU, memory, and request metrics

### Update the Application
```bash
# Make changes to your code
# Then redeploy
gcloud app deploy app.yaml
```

### Scale the Application
Edit `app.yaml` to modify:
- `max_instances`: Maximum number of instances
- `target_cpu_utilization`: CPU threshold for scaling
- `memory_gb`: Memory per instance

## Support

For issues specific to this deployment:
1. Check the application logs: `gcloud app logs tail -s nhl-commentary`
2. Review the [App Engine documentation](https://cloud.google.com/appengine/docs)
3. Check the [NHL Commentary System documentation](CLAUDE.md)

## Cost Optimization

- App Engine Standard pricing applies
- Consider using `basic_scaling` instead of `automatic_scaling` for cost savings
- Monitor usage in the Google Cloud Console billing section