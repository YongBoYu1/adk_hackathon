#!/usr/bin/env python3
"""
NHL Commentary Web Server 启动脚本
简化的启动器，包含依赖检查和错误处理
"""

import os
import sys
import threading
import subprocess
import asyncio
import json
import glob
from datetime import datetime
from flask import Flask, request, send_from_directory, jsonify, send_file
from flask_socketio import SocketIO, emit

# 添加项目根目录到路径
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

# 导入NHL Pipeline
try:
    from src.pipeline import NHLPipeline
    PIPELINE_AVAILABLE = True
    print("✅ NHL Pipeline 已导入")
except ImportError as e:
    print(f"⚠️ 无法导入NHL Pipeline: {e}")
    PIPELINE_AVAILABLE = False

def check_dependencies():
    """检查必要的依赖包"""
    required_packages = ['flask', 'flask_socketio', 'eventlet']
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} 已安装")
        except ImportError:
            print(f"❌ {package} 未安装")
            try:
                subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
                print(f"✅ {package} 安装成功")
            except:
                return False
    
    return True

class NHLWebServer:
    """NHL解说Web服务器 - 支持真实Pipeline"""
    
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.app = None
        self.socketio = None
        self.game_sessions = {}
        self.active_pipelines = {}
        self.clients = set()
    
    def create_app(self):
        """创建Flask应用"""
        app = Flask(__name__)
        app.config['SECRET_KEY'] = 'nhl_commentary_secret_key'
        
        # 创建SocketIO实例
        socketio = SocketIO(app, cors_allowed_origins="*", logger=False, engineio_logger=False)
        
        # 设置路由
        self.setup_routes(app)
        
        # 设置WebSocket事件
        self.setup_websocket_events(socketio)
        
        self.app = app
        self.socketio = socketio
        return app, socketio
    
    def setup_routes(self, app):
        """设置HTTP路由"""
        
        @app.route('/')
        def index():
            """主页面"""
            return send_from_directory('.', 'index.html')
        
        @app.route('/<path:filename>')
        def serve_static(filename):
            """静态文件服务"""
            return send_from_directory('.', filename)
            
        @app.route('/api/audio/<path:filename>')
        def serve_audio(filename):
            """提供音频文件服务"""
            try:
                # 查找音频文件 - 使用绝对路径
                audio_output_dir = '/Users/yifan/Downloads/google_hackathon/adk_hackathon/audio_output'
                audio_file_path = os.path.join(audio_output_dir, filename)
                
                print(f"🔍 查找音频文件: {audio_file_path}")
                print(f"📁 文件是否存在: {os.path.exists(audio_file_path)}")
                
                if os.path.exists(audio_file_path):
                    return send_file(audio_file_path, mimetype='audio/wav')
                else:
                    print(f"⚠️ 音频文件不存在: {audio_file_path}")
                    # 列出目录内容以便调试
                    if os.path.exists(audio_output_dir):
                        files = os.listdir(audio_output_dir)
                        print(f"📂 目录中的文件: {files[:5]}")  # 只显示前5个
                    return jsonify({'error': '音频文件不存在'}), 404
            except Exception as e:
                print(f"❌ 音频文件服务错误: {e}")
                return jsonify({'error': str(e)}), 500
        
        @app.route('/api/status')
        def get_status():
            """获取服务器状态"""
            return jsonify({
                'status': 'running',
                'clients': len(self.clients),
                'active_games': len(self.active_pipelines),
                'pipeline_available': PIPELINE_AVAILABLE,
                'timestamp': datetime.now().isoformat()
            })
    
    def setup_websocket_events(self, socketio):
        """设置WebSocket事件处理"""
        
        @socketio.on('connect')
        def handle_connect():
            """客户端连接"""
            client_id = request.sid
            self.clients.add(client_id)
            print(f"🔗 客户端连接: {client_id}")
            
            # 发送连接确认
            emit('status', {
                'type': 'connection',
                'data': {
                    'status': 'connected',
                    'clientId': client_id,
                    'pipeline_available': PIPELINE_AVAILABLE,
                    'timestamp': datetime.now().isoformat()
                }
            })
        
        @socketio.on('disconnect')
        def handle_disconnect():
            """客户端断开连接"""
            client_id = request.sid
            if client_id in self.clients:
                self.clients.remove(client_id)
            
            # 清理该客户端的活跃会话
            sessions_to_remove = []
            for session_id, session in self.game_sessions.items():
                if session.get('client_id') == client_id:
                    sessions_to_remove.append(session_id)
            
            for session_id in sessions_to_remove:
                self.stop_game_session(session_id)
            
            print(f"🔌 客户端断开: {client_id}")
        
        @socketio.on('start')
        def handle_start(data):
            """开始解说"""
            client_id = request.sid
            game_id = data.get('gameId')
            voice_style = data.get('voiceStyle', 'enthusiastic')
            language = data.get('language', 'zh-CN')
            
            if not game_id:
                emit('error', {
                    'type': 'error',
                    'data': {'message': '请输入比赛ID'}
                })
                return
            
            print(f"🏒 开始解说: {game_id} (风格: {voice_style}, 语言: {language})")
            
            if not PIPELINE_AVAILABLE:
                emit('error', {
                    'type': 'error',
                    'data': {'message': 'NHL Pipeline 不可用，请检查依赖'}
                })
                return
            
            try:
                # 创建游戏会话
                session_id = f"{client_id}_{game_id}"
                session = {
                    'client_id': client_id,
                    'game_id': game_id,
                    'voice_style': voice_style,
                    'language': language,
                    'status': 'running',
                    'start_time': datetime.now()
                }
                
                self.game_sessions[session_id] = session
                
                # 启动解说pipeline（在新线程中）
                pipeline_thread = threading.Thread(
                    target=self.run_commentary_pipeline,
                    args=(session_id, game_id, voice_style, language, client_id)
                )
                pipeline_thread.daemon = True
                pipeline_thread.start()
                
                # 发送成功响应
                emit('status', {
                    'type': 'started',
                    'data': {
                        'sessionId': session_id,
                        'gameId': game_id,
                        'status': 'running'
                    }
                })
                
            except Exception as e:
                print(f"❌ 启动解说失败: {e}")
                emit('error', {
                    'type': 'error',
                    'data': {'message': f'启动解说失败: {str(e)}'}
                })
        
        @socketio.on('stop')
        def handle_stop():
            """停止解说"""
            client_id = request.sid
            
            # 找到并停止该客户端的所有会话
            sessions_to_stop = []
            for session_id, session in self.game_sessions.items():
                if session.get('client_id') == client_id:
                    sessions_to_stop.append(session_id)
            
            for session_id in sessions_to_stop:
                self.stop_game_session(session_id)
            
            emit('status', {
                'type': 'stopped',
                'data': {'status': 'stopped'}
            })
        
        @socketio.on('pause')
        def handle_pause():
            """暂停解说"""
            client_id = request.sid
            
            for session_id, session in self.game_sessions.items():
                if session.get('client_id') == client_id:
                    session['status'] = 'paused'
            
            emit('status', {
                'type': 'paused',
                'data': {'status': 'paused'}
            })
        
        @socketio.on('resume')
        def handle_resume():
            """恢复解说"""
            client_id = request.sid
            
            for session_id, session in self.game_sessions.items():
                if session.get('client_id') == client_id:
                    session['status'] = 'running'
            
            emit('status', {
                'type': 'resumed',
                'data': {'status': 'running'}
            })
    
    def run_commentary_pipeline(self, session_id: str, game_id: str, voice_style: str, language: str, client_id: str):
        """在单独线程中运行真实的解说pipeline"""
        try:
            print(f"🚀 启动真实解说pipeline: {session_id}")
            
            # 创建NHLPipeline实例
            pipeline = NHLPipeline(game_id)
            self.active_pipelines[session_id] = pipeline
            
            # 在新的事件循环中运行异步pipeline
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                # 初始化agents
                loop.run_until_complete(pipeline.initialize_agents())
                
                # 发送Agent状态更新
                self.socketio.emit('agentStatus', {
                    'type': 'agentStatus',
                    'data': {
                        'dataAgent': 'online',
                        'commentaryAgent': 'online', 
                        'audioAgent': 'online'
                    }
                }, room=client_id)
                
                # 获取数据文件列表
                data_dir = os.path.join(project_root, f"data/data_agent_outputs")
                if not os.path.exists(data_dir):
                    print(f"⚠️ 未找到数据目录: {data_dir}")
                    self.socketio.emit('error', {
                        'type': 'error',
                        'data': {'message': f'未找到数据目录: {data_dir}'}
                    }, room=client_id)
                    return
                
                # 处理实际数据文件 - 查找特定比赛的文件
                data_files = sorted(glob.glob(f"{data_dir}/{game_id}_*.json"))
                if not data_files:
                    print(f"⚠️ 未找到比赛 {game_id} 的数据文件")
                    self.socketio.emit('error', {
                        'type': 'error',
                        'data': {'message': f'未找到比赛 {game_id} 的数据文件'}
                    }, room=client_id)
                    return
                
                print(f"🎯 找到 {len(data_files)} 个数据文件")
                
                # 处理每个时间戳文件
                for data_file in data_files:
                    session = self.game_sessions.get(session_id)
                    if not session or session['status'] == 'stopped':
                        break
                    
                    # 检查暂停状态
                    while session and session['status'] == 'paused':
                        threading.Event().wait(1)
                        session = self.game_sessions.get(session_id)
                        if not session or session['status'] == 'stopped':
                            return
                    
                    print(f"🔄 处理文件: {os.path.basename(data_file)}")
                    
                    # 处理时间戳数据
                    result = loop.run_until_complete(
                        pipeline.process_timestamp(data_file, voice_style, language)
                    )
                    
                    if result['status'] == 'success':
                        commentary = result.get('commentary', '')
                        audio_file = result.get('audio_file', '')
                        
                        if commentary:
                            # 发送解说文本
                            self.socketio.emit('commentary', {
                                'type': 'commentary',
                                'data': {
                                    'text': commentary,
                                    'timestamp': datetime.now().isoformat(),
                                    'style': voice_style,
                                    'language': language
                                }
                            }, room=client_id)
                            
                            # 发送音频数据
                            if audio_file and os.path.exists(audio_file):
                                audio_filename = os.path.basename(audio_file)
                                audio_url = f'/api/audio/{audio_filename}'
                                
                                # 获取音频文件大小和时长估算
                                file_size = os.path.getsize(audio_file)
                                estimated_duration = len(commentary) * 0.05  # 估算时长
                                
                                self.socketio.emit('audio', {
                                    'type': 'audio',
                                    'data': {
                                        'text': commentary,
                                        'style': voice_style,
                                        'url': audio_url,
                                        'duration': estimated_duration,
                                        'size': file_size
                                    }
                                }, room=client_id)
                                
                                print(f"🎵 音频已发送: {audio_filename}")
                        
                        # 发送比赛数据更新
                        with open(data_file, 'r') as f:
                            game_data = json.load(f)
                        
                        self.socketio.emit('gameData', {
                            'type': 'gameData',
                            'data': self.extract_game_info(game_data)
                        }, room=client_id)
                    
                    else:
                        print(f"❌ 处理失败: {result.get('error', '未知错误')}")
                    
                    # 等待一段时间再处理下一个文件
                    threading.Event().wait(2)
                
                # 解说完成
                print(f"✅ 解说pipeline完成: {session_id}")
                
            finally:
                loop.close()
                
        except Exception as e:
            print(f"❌ 解说pipeline错误: {e}")
            import traceback
            traceback.print_exc()
            
            self.socketio.emit('error', {
                'type': 'error',
                'data': {'message': f'解说pipeline错误: {str(e)}'}
            }, room=client_id)
        
        finally:
            # 清理
            if session_id in self.active_pipelines:
                del self.active_pipelines[session_id]
            
            if session_id in self.game_sessions:
                del self.game_sessions[session_id]
            
            self.socketio.emit('status', {
                'type': 'completed',
                'data': {'status': 'completed', 'message': '解说已完成'}
            }, room=client_id)
    
    def extract_game_info(self, game_data: dict) -> dict:
        """从原始比赛数据中提取UI需要的信息"""
        try:
            # 从实际的ADK数据结构中提取信息
            commentary_data = game_data.get('for_commentary_agent', {})
            game_context = commentary_data.get('game_context', {})
            
            # 提取基本比赛信息
            period = game_context.get('period', 1)
            time_remaining = game_context.get('time_remaining', '20:00')
            home_score = game_context.get('home_score', 0)
            away_score = game_context.get('away_score', 0)
            game_situation = game_context.get('game_situation', '比赛进行中')
            
            # 提取最新事件
            high_intensity_events = commentary_data.get('high_intensity_events', [])
            last_event = "比赛进行中"
            if high_intensity_events:
                latest_event = high_intensity_events[-1]
                last_event = latest_event.get('summary', '比赛进行中')
            
            # 提取关键信息
            key_talking_points = commentary_data.get('key_talking_points', [])
            momentum_score = commentary_data.get('momentum_score', 0)
            priority_level = commentary_data.get('priority_level', 1)
            
            # 根据文件名推断队伍信息
            home_team_name, away_team_name = self.get_team_info_from_game_id(game_data.get('game_id', ''))
            
            # 格式化时间显示
            period_name = f"第{period}节" if period <= 3 else "加时赛" if period == 4 else f"第{period-3}次加时"
            
            return {
                'homeTeam': {
                    'name': home_team_name,
                    'score': home_score,
                    'abbreviation': home_team_name.split()[-1][:3].upper()
                },
                'awayTeam': {
                    'name': away_team_name, 
                    'score': away_score,
                    'abbreviation': away_team_name.split()[-1][:3].upper()
                },
                'period': period_name,
                'time': time_remaining,
                'lastEvent': last_event,
                'gameContext': {
                    'situation': game_situation,
                    'momentum': momentum_score,
                    'priority': priority_level
                },
                'keyPoints': key_talking_points[:3],  # 只显示前3个要点
                'events': high_intensity_events[-5:] if high_intensity_events else [],  # 最近5个事件
                'intensity': self._calculate_intensity_level(momentum_score, high_intensity_events)
            }
            
        except Exception as e:
            print(f"⚠️ 提取比赛信息失败: {e}")
            
            # 返回默认信息
            return {
                'homeTeam': {'name': 'Home Team', 'score': 0, 'abbreviation': 'HOME'},
                'awayTeam': {'name': 'Away Team', 'score': 0, 'abbreviation': 'AWAY'},
                'period': '第1节',
                'time': '20:00',
                'lastEvent': '比赛进行中',
                'gameContext': {
                    'situation': '比赛进行中',
                    'momentum': 0,
                    'priority': 1
                },
                'keyPoints': [],
                'events': [],
                'intensity': 'low'
            }
    
    def _calculate_intensity_level(self, momentum_score: int, events: list) -> str:
        """计算比赛强度等级"""
        if momentum_score >= 70 or len(events) >= 3:
            return 'high'
        elif momentum_score >= 40 or len(events) >= 2:
            return 'medium'
        else:
            return 'low'
    
    def get_team_info_from_game_id(self, game_id: str) -> tuple:
        """从比赛ID推断队伍信息"""
        team_mappings = {
            '2024030412': ('Edmonton Oilers', 'Florida Panthers'),
            '2024020123': ('New York Rangers', 'Philadelphia Flyers'),
            '2024020456': ('Edmonton Oilers', 'Calgary Flames')
        }
        
        return team_mappings.get(game_id, ('Home Team', 'Away Team'))
    
    def stop_game_session(self, session_id: str):
        """停止游戏会话"""
        if session_id in self.game_sessions:
            self.game_sessions[session_id]['status'] = 'stopped'
            del self.game_sessions[session_id]
        
        if session_id in self.active_pipelines:
            del self.active_pipelines[session_id]
    
    def run(self):
        """启动服务器"""
        print(f"""
🏒 NHL Commentary Web Client
=============================
📍 服务地址: http://{self.host}:{self.port}
🌐 打开浏览器访问上述地址开始使用
{'✅ 支持真实NHL Pipeline' if PIPELINE_AVAILABLE else '⚠️ NHL Pipeline不可用'}
🎮 键盘快捷键:
   Ctrl+Space: 开始/暂停
   Ctrl+S: 停止
   Ctrl+M: 静音
=============================
        """)
        
        try:
            app, socketio = self.create_app()
            socketio.run(app, host=self.host, port=self.port, debug=False)
        except Exception as e:
            print(f"❌ 服务器启动失败: {e}")
            sys.exit(1)

def main():
    """主函数"""
    print("🏒 NHL Commentary Web Server")
    print("=" * 40)
    
    # 检查依赖
    if not check_dependencies():
        print("⚠️  请先安装必要的依赖包")
        sys.exit(1)
    
    # 检查文件
    required_files = ['index.html', 'styles.css', 'script.js']
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ 缺少必要文件: {', '.join(missing_files)}")
        print("请确保所有文件都在当前目录中")
        sys.exit(1)
    
    # 启动服务器
    server = NHLWebServer()
    try:
        server.run()
    except KeyboardInterrupt:
        print("\n👋 服务器已关闭")
    except Exception as e:
        print(f"❌ 错误: {e}")

if __name__ == '__main__':
    main() 