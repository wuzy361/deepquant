export const CONFIG = {
  USE_MOCK_DATA: true,  // true使用模拟数据，false使用实时数据
  MOCK_DATA: {
    BASE_PRICE: 100,
    PERIODS: 100
  },
  API: {
    BASE_URL: 'http://localhost:8000',
    WS_URL: 'ws://localhost:8000/ws/kline'
  }
}; 