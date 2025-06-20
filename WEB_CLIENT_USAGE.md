# 🏒 NHL Live Commentary Web Client 使用指南

## 🎯 概述

这是一个完整的实时NHL解说流媒体系统，包含专业的Web客户端界面，可以接收和播放AI生成的NHL解说音频。

## 🚀 快速开始

### 方法1：演示模式（推荐用于测试）

1. **启动WebSocket服务器**：
   ```bash
   python3 demo_websocket_with_real_audio.py
   ```

2. **打开Web客户端**：
   - 在浏览器中打开 `web_client.html`
   - 或者直接双击 `web_client.html` 文件

3. **连接到服务器**：
   - 点击 "🔗 Connect" 按钮
   - 状态指示灯应该变为绿色
   - 查看日志确认连接成功

### 方法2：完整Pipeline模式

1. **运行完整pipeline**：
   ```bash
   python3 live_commentary_pipeline.py GAME_ID DURATION_MINUTES
   ```

2. **打开Web客户端并连接**（同方法1步骤2-3）

## 🎮 Web Client 界面说明

### 📊 连接状态面板
- **状态指示灯**：
  - 🔴 红色 = 断开连接
  - 🟡 黄色 = 正在连接
  - 🟢 绿色 = 已连接
- **连接控制**：
  - "🔗 Connect" - 连接到WebSocket服务器
  - "❌ Disconnect" - 断开连接
  - "🗑️ Clear Logs" - 清除日志记录

### 🔊 音频控制面板
- **音量控制**：滑动条调节音量（0-100%）
- **播放控制**：
  - "▶️ Play" - 开始播放音频队列
  - "⏸️ Pause" - 暂停当前播放
  - "⏹️ Stop" - 停止播放并清空队列

### 🏒 比赛信息面板
- **队伍信息**：显示对战双方（如 FLA @ EDM）
- **统计数据**：
  - **Segments** - 接收到的解说段数
  - **Played** - 已播放的音频数
  - **Connected** - 连接持续时间
- **当前解说**：显示正在播放的解说员和内容

### 📝 日志面板
- **实时日志**：显示连接状态、音频接收、错误信息
- **颜色编码**：
  - 🟢 绿色 = 信息日志
  - 🟡 黄色 = 警告日志
  - 🔴 红色 = 错误日志

## 🔧 故障排除

### 常见问题

#### 1. **连接失败**
**现象**：点击Connect按钮后状态显示"Connection Error"
**解决方案**：
- 确保WebSocket服务器正在运行
- 检查服务器地址是否为 `ws://localhost:8765`
- 尝试刷新页面重新连接

#### 2. **音频解码错误**
**现象**：日志显示 "Audio playback error: Unable to decode audio data"
**解决方案**：
- 这通常是因为服务器发送了空音频数据
- 等待服务器生成真实音频数据
- 检查服务器端TTS功能是否正常

#### 3. **无音频播放**
**现象**：收到音频段但没有声音
**解决方案**：
- 检查浏览器音频权限
- 确保音量不为0
- 点击页面任意位置激活Audio Context
- 尝试手动点击Play按钮

#### 4. **TTS生成失败**
**现象**：服务器日志显示API密钥错误
**解决方案**：
```bash
# 确保API密钥正确设置
export GOOGLE_API_KEY="your-api-key-here"
# 或在.env文件中设置
echo "GOOGLE_API_KEY=your-api-key-here" >> .env
```

## 🎵 音频数据流程

```
WebSocket服务器 → 生成TTS音频 → Base64编码 → 发送到Web Client → 解码 → 播放
```

### 数据格式

#### 音频段消息格式：
```json
{
  "type": "audio_segment",
  "audio_id": "unique_id",
  "speaker": "Alex Chen",
  "text": "解说内容文本",
  "voice_style": "enthusiastic",
  "timestamp": "2025-06-19T12:30:00.000Z",
  "segment_index": 0,
  "duration_estimate": 3.0,
  "pause_after": 0.5,
  "audio_data": "base64_encoded_wav_data",
  "has_audio": true
}
```

#### 解说文本消息格式：
```json
{
  "type": "commentary_text",
  "speaker": "Mike Rodriguez",
  "text": "解说内容文本",
  "emotion": "analytical",
  "timestamp": "2025-06-19T12:30:00.000Z",
  "segment_index": 1
}
```

## 🛠️ 开发者信息

### Web Client 技术栈
- **HTML5 + CSS3**：现代化响应式界面
- **JavaScript ES6+**：客户端逻辑
- **WebSocket API**：实时通信
- **Web Audio API**：音频播放和处理

### 文件结构
```
adk_hackathon/
├── web_client.html                    # 🌐 主Web客户端
├── demo_websocket_with_real_audio.py  # 🎬 带真实音频的演示
├── demo_websocket_with_mock_audio.py  # 🎭 模拟音频演示
├── test_websocket_server.py           # 🧪 WebSocket测试工具
└── live_commentary_pipeline.py       # 🏒 完整Pipeline（已集成WebSocket）
```

### 自定义配置

#### WebSocket端口配置
```bash
# 修改默认端口（在pipeline_config.py中）
export WEBSOCKET_PORT=8080
export WEBSOCKET_HOST=0.0.0.0  # 允许外部连接
```

#### 音频设置
```bash
# 音频缓冲区大小
export AUDIO_BUFFER_SIZE=200

# 音频延迟设置
export AUDIO_BUFFER_DELAY=10
```

## 🎯 使用技巧

1. **最佳体验**：使用Chrome或Firefox浏览器
2. **网络**：确保在本地网络环境中运行
3. **音频**：首次使用时允许浏览器音频权限
4. **多客户端**：可以同时打开多个Web客户端连接到同一服务器
5. **日志监控**：保持日志面板打开以监控连接状态

## 📞 支持

如有问题，请检查：
1. 服务器端日志输出
2. 浏览器开发者控制台
3. Web Client日志面板
4. 网络连接状态

---

🎉 **享受AI驱动的NHL实时解说体验！** 🏒