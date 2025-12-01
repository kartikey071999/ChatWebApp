export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Channel {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  channel_id: string;
  content: string;
  created_at: string;
  sender?: User;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChannelMember {
  user_id: string;
  channel_id: string;
  joined_at: string;
  user?: User;
}

export interface WSMessage {
  type: 'message' | 'user_joined' | 'user_left';
  id?: string;
  sender_id?: string;
  content?: string;
  created_at?: string;
  user_id?: string;
  online_users?: string[];
}
