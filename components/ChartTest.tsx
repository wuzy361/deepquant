import React, { useState, useEffect } from 'react';
import CandlestickChart from './CandlestickChart';
import useRealTimeData from '../hooks/useRealTimeData';
import { generateMockData } from '../utils/mockKLineData';
import { CONFIG } from '../src/config';
import { KLineData } from '../types';

const ChartTest = () => {
  const [dataSource, setDataSource] = useState<'mock' | 'real'>(
    CONFIG.USE_MOCK_DATA ? 'mock' : 'real'
  );
  const [mockData, setMockData] = useState<KLineData[]>([]);
  const realTimeData = useRealTimeData();

  // 初始化模拟数据
  useEffect(() => {
    if (dataSource === 'mock') {
      setMockData(generateMockData(
        CONFIG.MOCK_DATA.BASE_PRICE, 
        CONFIG.MOCK_DATA.PERIODS
      ));
    }
  }, [dataSource]);

  // 切换数据源
  const toggleDataSource = () => {
    setDataSource(prev => prev === 'mock' ? 'real' : 'mock');
  };

  const data = dataSource === 'mock' ? mockData : realTimeData;

  return (
    <div>
      <div style={{ margin: '10px', padding: '10px' }}>
        <button 
          onClick={toggleDataSource}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          当前数据源: {dataSource === 'mock' ? '模拟数据' : '实时数据'}
        </button>
      </div>
      
      {data.length === 0 ? (
        <div>正在加载数据...</div>
      ) : (
        <CandlestickChart data={data} />
      )}
    </div>
  );
};

export default ChartTest; 