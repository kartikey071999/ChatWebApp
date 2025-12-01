import { API_BASE_URL } from '@/config/api';
import type { User, Channel, Message, ChannelMember } from '@/types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
    params?: Record<string, string>
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;
    
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // User endpoints
  async register(name: string, password: string, role?: 'admin' | 'user'): Promise<User> {
    return this.request<User>('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, password, role }),
    });
  }

  async login(name: string, password: string): Promise<User> {
    return this.request<User>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
    });
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users/');
  }

  async getUser(userId: string): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

  // Channel endpoints
  async getChannels(): Promise<Channel[]> {
    return this.request<Channel[]>('/channels/');
  }

  async getChannel(channelId: string): Promise<Channel> {
    return this.request<Channel>(`/channels/${channelId}`);
  }

  async createChannel(name: string, userId: string): Promise<Channel> {
    return this.request<Channel>('/channels/', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }, { user_id: userId });
  }

  async joinChannel(channelId: string, userId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/channels/${channelId}/join`,
      { method: 'POST' },
      { user_id: userId }
    );
  }

  async getChannelMembers(channelId: string): Promise<ChannelMember[]> {
    return this.request<ChannelMember[]>(`/channels/${channelId}/members`);
  }

  // Message endpoints
  async getMessages(channelId: string, limit = 50): Promise<Message[]> {
    return this.request<Message[]>(`/messages/${channelId}`, {}, { limit: limit.toString() });
  }

  async sendMessage(channelId: string, content: string, userId: string): Promise<Message> {
    return this.request<Message>(`/messages/${channelId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }, { user_id: userId });
  }
}

export const api = new ApiClient();
