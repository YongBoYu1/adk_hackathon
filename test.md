⏺ NHL LiveStream Commentary Agent - Testing Instructions

  Quick Start Testing

  Prerequisites

  # Clone and setup
  git clone <repository>
  cd adk_hackathon
  pip install -r requirements.txt

  # Configure API keys
  export GOOGLE_API_KEY="your-google-api-key"
  export GOOGLE_CLOUD_PROJECT="your-project-id"

  🚀 1. Complete Pipeline Test (Recommended)

  Test Live Commentary Pipeline V3 (Full System)

  # Run complete Data + Commentary + Audio pipeline
  python src/pipeline/live_commentary_pipeline_v3.py 2024030412 2

  # Expected output:
  # - Real-time NHL data processing
  # - Professional two-person commentary generation  
  # - Audio files in audio_output/ directory
  # - Results in data/sequential_agent_v3_outputs/

  Test Live Commentary Pipeline V2 (Text Only)

  # Run Data + Commentary pipeline (no audio)
  python src/pipeline/live_commentary_pipeline_v2.py 2024030412 2

  # Expected output:
  # - Commentary text in data/sequential_agent_outputs/
  # - Faster processing without audio generation

  🧪 2. Individual Agent Testing

  Test Data Agent

  # Test NHL data processing and analysis
  python test_data_agent_adk.py

  # Verifies:
  # - NHL API data enhancement
  # - Player name resolution
  # - Progressive statistics calculation

  Test Commentary Agent

  # Test professional commentary generation
  python test_commentary_session_aware.py --max-files 5

  # Verifies:
  # - Two-person dialogue generation
  # - Session continuity
  # - Anti-repetition mechanisms

  Test Audio Agent

  # Test text-to-speech and audio processing
  python src/agents/audio_agent/test_audio_agent.py

  # Verifies:
  # - Google Cloud TTS integration
  # - Voice style selection
  # - Audio file generation

  🌐 3. Web Demo Testing

  Launch Web Interface

  # Start Flask web application
  python main.py

  # Navigate to: http://localhost:8080
  # Test real-time game selection and audio streaming

  Test WebSocket Audio Streaming

  # In browser console:
  const ws = new WebSocket('ws://localhost:8765');
  ws.onmessage = (event) => console.log('Audio data:', event.data);

  📋 4. Quick Validation Tests

  Test Game Data Collection

  # Generate sample game data
  python src/data/live/live_data_collector.py simulate 2024030412
  --game_duration_minutes 1

  # Check output: data/live/2024030412/

  Test Static Context Generation

  # Generate team/player information
  python src/data/static/static_info_generator.py 2024030412

  # Check output: data/static/game_2024030412_static_context.json

  Extract Commentary Summary

  # View clean commentary dialogue
  python extract_commentary_dialogue.py --output test_summary.txt

  # Review generated commentary quality

  ✅ 5. Expected Test Results

  Successful Pipeline Run Should Produce:

  - Data Files: data/live/GAME_ID/ with timestamped JSON files
  - Commentary: Professional two-person dialogue in output directories
  - Audio Files: WAV files in audio_output/ with proper naming
  - Processing Stats: Average processing time under 10 seconds per timestamp

  Key Quality Indicators:

  - ✅ Commentary flows naturally without repetition
  - ✅ Player names are correctly resolved (not just IDs)
  - ✅ Game statistics progress realistically (0-0 to final score)
  - ✅ Audio files are generated with appropriate voice styles
  - ✅ No data leakage (early timestamps don't show final game stats)

  🛠️ Troubleshooting

  Common Issues:

  # Missing API key
  export GOOGLE_API_KEY="your-key-here"

  # Missing dependencies
  pip install google-adk google-genai google-cloud-texttospeech

  # Clean previous data
  ./scripts/clean_data.sh  # if available

  Debug Mode:

  # Run with debug output
  FLASK_ENV=development python main.py

  # Test single timestamp
  python test_single_timestamp.py data/live/2024030412/2024030412_1_00_00.json

  📊 Performance Benchmarks

  Target Performance:

  - Data Processing: < 2 seconds per timestamp
  - Commentary Generation: < 5 seconds per timestamp
  - Audio Generation: < 8 seconds per timestamp
  - Total Pipeline: < 15 seconds per timestamp
  - Memory Usage: < 1GB per concurrent game

  Test Different Game IDs:

  - 2024030412 - Playoff game (high intensity)
  - 2024020001 - Regular season game
  - 2024030414 - Alternative playoff game

  Choose any valid NHL game ID for testing. The system automatically fetches game
  data and generates appropriate commentary.