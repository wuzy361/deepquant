import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { KLineData } from '../types';
import { CONFIG } from '../src/config';

const useRealTimeData = () => {
  const [data, setData] = useState<KLineData[]>([]);
  
  // 使用 WebSocket 连接
  const { lastMessage } = useWebSocket(CONFIG.API.WS_URL, {
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 1000,  // 减少重连间隔
    reconnectAttempts: 50,    // 增加重试次数
    retryOnError: true,
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: (error) => console.error('WebSocket error:', error)
  });

  // 初始加载数据
  useEffect(() => {
    fetch(`${CONFIG.API.BASE_URL}/kline`)
      .then(res => res.json())
      .then(initialData => setData(initialData))
      .catch(err => console.error('Failed to fetch initial data:', err));
  }, []);

  // 处理实时数据更新
  useEffect(() => {
    if (lastMessage?.data) {
      try {
        const newData = JSON.parse(lastMessage.data);
        setData(prev => {
          // 保持最新的100个数据点
          const newSeries = [...prev, newData].slice(-100);
          return newSeries;
        });
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    }
  }, [lastMessage]);

  return data;
};

export default useRealTimeData; 