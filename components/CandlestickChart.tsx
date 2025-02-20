import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent, DataZoomComponent, MarkLineComponent } from 'echarts/components';
import { CandlestickChart as CandlestickChartType } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import type { KLineData } from '../types';

// 按需注册组件
echarts.use([
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  CandlestickChartType,
  MarkLineComponent,
  CanvasRenderer
]);

interface Props {
  data: KLineData[];
}

const CandlestickChart: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts>();

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    setChartInstance(chart);

    // 监听屏幕旋转和窗口大小变化
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // 更新图表配置
  useEffect(() => {
    if (!chartInstance) return;

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '5%'
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
        }
      },
      yAxis: {
        scale: true,
        splitLine: { show: true }
      },
      series: [
        {
          name: 'K线',
          type: 'candlestick',
          data: data.map(item => [item.open, item.close, item.low, item.high]),
          itemStyle: {
            color: '#ef232a',
            color0: '#14b143',
            borderColor: '#ef232a',
            borderColor0: '#14b143'
          },
          markLine: {
            symbol: ['none', 'none'],
            silent: true,
            data: [
              {
                name: '最高价',
                type: 'max',
                valueDim: 'highest',
                label: {
                  show: true  // 隐藏标签
                },
                lineStyle: {
                  color: '#ef232a',
                  type: 'dashed',
                  width: 1
                }
              },
              {
                name: '最低价',
                type: 'min',
                valueDim: 'lowest',
                label: {
                  show: true  // 隐藏标签
                },
                lineStyle: {
                  color: '#14b143',
                  type: 'dashed',
                  width: 1
                }
              }
            ]
          }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          bottom: 10,
          height: 30
        }
      ]
    };

    chartInstance.setOption(option);
  }, [data, chartInstance]);

  return (
    <div 
      ref={chartRef} 
      style={{
        width: '100%',
        height: window.innerHeight * (window.innerWidth > window.innerHeight ? 0.9 : 0.7),
        touchAction: 'none',
        padding: '10px',
        backgroundColor: '#fff'
      }} 
    />
  );
};

export default CandlestickChart; 