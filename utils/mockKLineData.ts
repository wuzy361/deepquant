import { KLineData } from '../components/CandlestickChart';

export const generateMockData = (basePrice: number, periods: number): KLineData[] => {
  const data: KLineData[] = [];
  
  // 设置当前交易日的开始时间（9:30）
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(9, 30, 0, 0);
  
  // 如果当前时间早于9:30，使用前一天的数据
  if (now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() < 30)) {
    startTime.setDate(startTime.getDate() - 1);
  }
  
  let currentTime = startTime.getTime();
  let lastClose = basePrice;
  
  for (let i = 0; i < periods; i++) {
    const currentDate = new Date(currentTime);
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    
    // 跳过非交易时间（午休 11:30-13:00）
    if (hour === 11 && minute >= 30) {
      currentTime = currentDate.setHours(13, 0, 0, 0);
    }
    
    // 跳过非交易时间（收盘后 15:00-次日9:30）
    if (hour >= 15) {
      currentDate.setDate(currentDate.getDate() + 1);
      currentTime = currentDate.setHours(9, 30, 0, 0);
    }
    
    const open = lastClose;
    const trend = Math.random() - 0.5;
    const volatility = (Math.random() * 0.02);
    const priceChange = open * volatility * (trend > 0 ? 1 : -1);
    const close = open + priceChange;
    
    const high = Math.max(open, close) + Math.random() * Math.abs(priceChange);
    const low = Math.min(open, close) - Math.random() * Math.abs(priceChange);
    
    const volumeBase = 50000;
    const volumeChange = Math.abs(priceChange / open);
    const volume = Math.floor(volumeBase * (1 + volumeChange * 10));
    
    // 格式化时间为本地时间字符串
    const timeStr = new Date(currentTime).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    data.push({
      time: timeStr,
      open: Number(open.toFixed(2)),
      close: Number(close.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      volume: volume
    });
    
    lastClose = close;
    currentTime += 60 * 1000; // 每分钟一个数据点
  }
  
  return data;
}; 