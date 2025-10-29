// src/api/index.js
import client from './client';
import { API_CONFIG, buildUrl } from './config';

export const call = async (endpoint, { params, data, ...rest } = {}) => {
  const { method, url } = typeof endpoint === 'function' ? endpoint() : endpoint;
   console.log('🔧 API CALL DEBUG:');
  console.log('Endpoint:', endpoint);
  console.log('Method:', method);
  console.log('URL:', url);
  console.log('Params:', params);
  console.log('Data:', data);
  console.log('Rest:', rest);
  try {
    const response = await client({
      method,
      url: buildUrl(url),
      params,
      data,
      ...rest,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Let your components handle errors
  }
};

export default { call, ...API_CONFIG };