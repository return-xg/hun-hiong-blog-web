import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { storage } from '@/utils/storage';
import { AUTH_REFRESH_URL } from '@/utils/constants';
import type { Result } from '@/types/api';

import type { LoginVO } from '@/types/auth';

/**
 * 安全解析 JSON，将超出 JS 安全整数范围（>15 位）的数字转为字符串
 * 通过跟踪字符串上下文，确保不会误改字符串值中的数字
 */
function safeJsonParse(text: string): unknown {
  let result = '';
  let inString = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inString) {
      result += ch;
      if (ch === '\\') {
        // 转义字符，直接追加下一个字符
        i++;
        if (i < text.length) {
          result += text[i];
        }
      } else if (ch === '"') {
        inString = false;
      }
      i++;
      continue;
    }

    // 不在字符串内
    if (ch === '"') {
      inString = true;
      result += ch;
      i++;
      continue;
    }

    // 检测数字：JSON 数字以 - 或 0-9 开头
    if (ch === '-' || (ch >= '0' && ch <= '9')) {
      const start = i;
      while (i < text.length && text[i] !== ',' && text[i] !== '}' && text[i] !== ']' && text[i] !== ' ' && text[i] !== '\n' && text[i] !== '\r' && text[i] !== '\t') {
        i++;
      }
      const numStr = text.substring(start, i);
      // 统计纯数字位数（不含负号和小数点）
      const digitCount = numStr.replace(/[-.]/g, '').length;
      if (digitCount > 15) {
        // 超过安全整数范围，转为字符串
        result += `"${numStr}"`;
      } else {
        result += numStr;
      }
      continue;
    }

    result += ch;
    i++;
  }

  return JSON.parse(result);
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [(data: string) => {
    return safeJsonParse(data);
  }],
});

// 是否正在刷新 Token
let isRefreshing = false;
// 等待刷新 Token 的请求队列
let requestQueue: Array<(token: string) => void> = [];

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<Result<unknown>>) => {
    const { data } = response;

    // 如果响应体有 code 字段，按统一格式处理
    if (data.code !== undefined) {
      if (data.code !== 0) {
        message.error(data.message || '请求失败');
        return Promise.reject(new Error(data.message || '请求失败'));
      }
      // code === 0，直接返回 data 部分
      return data as unknown as AxiosResponse;
    }

    // 没有 code 字段，直接返回
    return response;
  },
  async (error) => {
    const { response, config } = error;

    // 401 未授权 或 403 Token 过期，尝试刷新 Token
    if ((response?.status === 401 || response?.status === 403) && !config._isRetry) {
      // 如果是刷新 Token 的请求本身失败了，跳转登录页
      if (config.url === AUTH_REFRESH_URL) {
        storage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 正在刷新，将请求加入队列等待
        return new Promise((resolve) => {
          requestQueue.push((newToken: string) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            config._isRetry = true;
            resolve(request(config));
          });
        });
      }

      isRefreshing = true;
      config._isRetry = true;

      try {
        const refreshTk = storage.getRefreshToken();
        if (!refreshTk) {
          throw new Error('No refresh token');
        }

        // 刷新 Token 接口改为 GET，通过 Authorization 头传递刷新令牌
        const { data } = await axios.get<Result<LoginVO>>(
          `${request.defaults.baseURL}${AUTH_REFRESH_URL}`,
          { headers: { Authorization: `Bearer ${refreshTk}` } }
        );

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        storage.setToken(newAccessToken);
        storage.setRefreshToken(newRefreshToken);

        // 执行队列中的请求
        requestQueue.forEach((cb) => cb(newAccessToken));
        requestQueue = [];

        // 重试当前请求
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return request(config);
      } catch (refreshError) {
        storage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 其他错误
    const errorMsg = response?.data?.message || response?.statusText || '网络错误';
    message.error(errorMsg);
    return Promise.reject(error);
  }
);

export default request;
