import { useEffect, useState } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { KLineData } from '../components/CandlestickChart';

const useRealTimeData = (url: string) => {
  const [data, setData] = useState<KLineData[]>([]);
  const { lastMessage } = useWebSocket(url);

  useEffect(() => {
    if (lastMessage?.data) {
      const newData = JSON.parse(lastMessage.data);
      setData(prev => {
        const newSeries = [...prev.slice(-100), newData]; // 保持最新100条数据
        return newSeries;
      });
    }
  }, [lastMessage]);

  return data;
}; 