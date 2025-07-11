import { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export function useApi<T = any>(url: string, config?: AxiosRequestConfig) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const request = async (body?: any, method: 'get' | 'post' | 'put' | 'delete' = 'post') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        url,
        method,
        data: body,
        ...config,
      });
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, request };
}
