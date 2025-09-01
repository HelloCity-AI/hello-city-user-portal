import type { User } from '@/types/User.types';
import axios from 'axios';

export const createUser = async (newUser: User) => {
  // 获取访问令牌
  const tokenResponse = await fetch('/api/auth/token');
  let accessToken = '';

  if (tokenResponse.ok) {
    const tokenData = await tokenResponse.json();
    accessToken = tokenData.accessToken || '';
  }

  // 创建FormData对象来匹配后端的multipart/form-data要求
  const formData = new FormData();

  // 添加必需字段
  formData.append('Username', newUser.userId || 'defaultUsername'); // 使用userId作为username，或者可以添加单独的username字段
  formData.append('Email', newUser.Email);

  // 添加可选字段
  if (newUser.Gender) {
    formData.append('Gender', newUser.Gender.toString());
  }
  if (newUser.nationality) {
    formData.append('Nationality', newUser.nationality);
  }
  if (newUser.city) {
    formData.append('City', newUser.city);
  }
  if (newUser.preferredLanguage) {
    formData.append('PreferredLanguage', newUser.preferredLanguage.toString());
  }

  // 如果有头像文件，也可以添加
  // if (newUser.Avatar && newUser.Avatar instanceof File) {
  //   formData.append('File', newUser.Avatar);
  // }

  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
    Accept: '*/*',
  };

  // 如果有访问令牌，添加到请求头
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`, formData, {
    headers,
  });
  return response;
};

// Used in demo, currently unused, waiting for new ticket
export const fetchUser = async (newUserId: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${newUserId}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
  });
  return response;
};
