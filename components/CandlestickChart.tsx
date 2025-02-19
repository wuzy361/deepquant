import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent, DataZoomComponent } from 'echarts/components';
import { CandlestickChart as CandlestickChartType } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import type { KLineData } from '../types';

// 按需注册组件
echarts.use([
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  CandlestickChartType,
  CanvasRenderer
]);

interface Props {
  data: KLineData[];
}

const CandlestickChart: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.time),
        scale: true,
        boundaryGap: true,
        axisLine: { onZero: false },
        splitLine: { show: false },
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          }
        },
        min: 'dataMin',
        max: 'dataMax'
      },
      yAxis: {
        scale: true,
        splitLine: { show: true }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          bottom: 60,
          start: 0,
          end: 100
        }
      ],
      series: [
        {
          name: '日K',
          type: 'candlestick',
          data: data.map(item => [item.open, item.close, item.low, item.high]),
          itemStyle: {
            color: '#ef232a',
            color0: '#14b143',
            borderColor: '#ef232a',
            borderColor0: '#14b143'
          }
        }
      ]
    };

    myChart.setOption(option);
    
    return () => {
      myChart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '600px' }} />;
};

export default CandlestickChart; 