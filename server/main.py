from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime, timedelta
import random
import json
import asyncio

app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源，生产环境建议设置具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局变量保存最新价格，确保数据连续性
last_price = 100.0

def generate_realtime_kline():
    global last_price
    
    # 获取当前时间
    now = datetime.now()
    
    # 生成价格变动
    trend = random.random() - 0.5
    volatility = random.random() * 0.002  # 较小的波动率使变化更平滑
    price_change = last_price * volatility * (1 if trend > 0 else -1)
    
    open_price = last_price
    close_price = open_price + price_change
    high_price = max(open_price, close_price) + random.random() * abs(price_change)
    low_price = min(open_price, close_price) - random.random() * abs(price_change)
    
    # 更新最新价格
    last_price = close_price
    
    # 生成成交量
    volume = int(50000 * (1 + abs(price_change/open_price) * 10))
    
    return {
        "time": now.strftime("%Y-%m-%d %H:%M:%S"),
        "open": round(open_price, 2),
        "close": round(close_price, 2),
        "high": round(high_price, 2),
        "low": round(low_price, 2),
        "volume": volume
    }

# 添加 /kline 路由处理初始数据请求
@app.get("/kline")
async def get_kline_data(periods: int = 100):
    data = []
    for _ in range(periods):
        data.append(generate_realtime_kline())
        await asyncio.sleep(0.01)  # 小延迟避免数据太相似
    return data

@app.websocket("/ws/kline")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connected")
    
    try:
        while True:
            try:
                # 生成新的K线数据
                kline_data = generate_realtime_kline()
                # 发送数据到客户端
                await websocket.send_text(json.dumps(kline_data))
                print(f"Sent data: {kline_data}")
                # 每秒更新一次
                await asyncio.sleep(1)
            except Exception as e:
                print(f"Error during data sending: {e}")
                break  # 出错时退出循环
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        try:
            print("WebSocket disconnected")
            await websocket.close()
        except:
            pass  # 忽略关闭时的错误

# 添加健康检查端点
@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    print("Server starting...")
    # 禁用热重载以避免 WebSocket 连接问题
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=False,  # 禁用热重载
        log_level="info"
    ) 