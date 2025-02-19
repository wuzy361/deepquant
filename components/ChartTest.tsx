import React, { useState, useEffect } from 'react';
import CandlestickChart from './CandlestickChart';
import { generateMockData } from '../utils/mockKLineData';
import { KLineData } from './CandlestickChart';

const ChartTest = () => {
  const [data, setData] = useState<KLineData[]>([]);

  useEffect(() => {
    setData(generateMockData(100, 100));
  }, []);

  if (data.length === 0) {
    return <div>正在加载数据...</div>;
  }

  return <CandlestickChart data={data} />;
};

export default ChartTest; 