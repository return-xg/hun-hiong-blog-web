import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import router from '@/router';

/** Ant Design 主题 Token 配置 — 清新文艺风格 */
const themeConfig = {
  token: {
    colorPrimary: '#5BA4A4',
    colorLink: '#5BA4A4',
    colorLinkHover: '#4A8F8F',
    colorSuccess: '#52C41A',
    colorWarning: '#E8836B',
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#FAFCF8',
    colorText: '#2D3436',
    colorTextSecondary: '#7F8C8D',
    colorBorder: '#E8F0E8',
    colorBorderSecondary: '#F0F5F0',
    borderRadius: 10,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    controlHeight: 40,
    fontSize: 14,
  },
};

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
