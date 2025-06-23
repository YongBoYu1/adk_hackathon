#!/usr/bin/env python3
"""
NHL Live Commentary System - Google Cloud App Engine Entry Point

This is the main entry point for Google Cloud App Engine deployment.
It imports and runs the Flask app from web_client_demo/app.py.
"""

import os
import sys
from pathlib import Path

# Add project paths to Python path for Google Cloud deployment
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / 'src'))
sys.path.insert(0, str(project_root / 'src' / 'agents'))
sys.path.insert(0, str(project_root / 'src' / 'board'))
sys.path.insert(0, str(project_root / 'src' / 'data'))
sys.path.insert(0, str(project_root / 'src' / 'pipeline'))
sys.path.insert(0, str(project_root / 'web_client_demo'))

# Ensure data directories exist
data_dirs = [
    project_root / 'data',
    project_root / 'data' / 'live', 
    project_root / 'data' / 'static',
    project_root / 'data' / 'sequential_agent_v3_outputs',
    project_root / 'audio_output'
]

for dir_path in data_dirs:
    dir_path.mkdir(parents=True, exist_ok=True)

# Import the Flask app from web_client_demo
from web_client_demo.app import app as flask_app, socketio

# Make app available for App Engine
app = flask_app

if __name__ == '__main__':
    # For local development and Cloud Run
    port = int(os.environ.get('PORT', 8080))  # Cloud Run uses 8080 by default
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"🏒 NHL Live Commentary System")
    print(f"   Running on port: {port}")
    print(f"   Debug mode: {debug}")
    print(f"   Environment: {'Development' if debug else 'Production'}")
    print(f"   Project root: {project_root}")
    print(f"   Platform: {'Cloud Run' if os.environ.get('K_SERVICE') else 'Local/App Engine'}")
    
    # Use different server based on environment
    if os.environ.get('K_SERVICE'):
        # Running on Cloud Run - use gunicorn (called from Dockerfile)
        print("   Running on Cloud Run with gunicorn")
    else:
        # Local development or App Engine
        socketio.run(app, host='0.0.0.0', port=port, debug=debug)
else:
    # For production deployment (App Engine or Cloud Run via gunicorn)
    platform = "Cloud Run" if os.environ.get('K_SERVICE') else "App Engine"
    print(f"🏒 NHL Live Commentary System - Production Mode ({platform})")
    print(f"   Project root: {project_root}")
    print(f"   Flask app loaded successfully")