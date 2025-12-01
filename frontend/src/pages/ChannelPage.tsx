import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { api } from '@/lib/api';
import { MessageList } from '@/components/MessageList';
import { MessageComposer } from '@/components/MessageComposer';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Hash, Users, Wifi, WifiOff } from 'lucide-react';
import type { Message, Channel, User, ChannelMember } from '@/types';

export const ChannelPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<ChannelMember[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  const handleMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      // Check if message already exists (dedupe by id)
      if (prev.some((m) => m.id === message.id)) {
        return prev.map((m) => (m.id === message.id ? message : m));
      }
      return [...prev, message];
    });
  }, []);

  const handleUserJoined = useCallback((userId: string, onlineUsersList: string[]) => {
    setOnlineUsers(onlineUsersList);
    console.log(`User ${userId} joined. Online:`, onlineUsersList);
  }, []);

  const handleUserLeft = useCallback((userId: string, onlineUsersList: string[]) => {
    setOnlineUsers(onlineUsersList);
    console.log(`User ${userId} left. Online:`, onlineUsersList);
  }, []);

  const { isConnected, sendMessage } = useWebSocket({
    channelId: channelId!,
    userId: user!.id,
    onMessage: handleMessage,
    onUserJoined: handleUserJoined,
    onUserLeft: handleUserLeft,
  });

  useEffect(() => {
    if (!channelId || !user) return;

    const loadChannelData = async () => {
      try {
        setIsLoading(true);

        // Load channel info
        const channelData = await api.getChannel(channelId);
        setChannel(channelData);

        // Load members
        const membersData = await api.getChannelMembers(channelId);
        setMembers(membersData);
        setIsMember(membersData.some((m) => m.user_id === user.id));

        // Load users
        const usersData = await api.getUsers();
        const usersMap = usersData.reduce((acc, u) => {
          acc[u.id] = u;
          return acc;
        }, {} as Record<string, User>);
        setUsers(usersMap);

        // Load message history
        const messagesData = await api.getMessages(channelId);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error loading channel:', error);
        toast({
          title: 'Error',
          description: 'Failed to load channel data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadChannelData();
  }, [channelId, user, toast]);

  const handleSendMessage = async (content: string) => {
    if (!user || !channelId) return;

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      sender_id: user.id,
      channel_id: channelId,
      content,
      created_at: new Date().toISOString(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      sendMessage(content);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      toast({
        title: 'Failed to send',
        description: 'Could not send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleJoinChannel = async () => {
    if (!user || !channelId) return;

    try {
      await api.joinChannel(channelId, user.id);
      setIsMember(true);
      toast({ title: 'Joined channel', description: 'You can now send messages.' });
      
      // Reload members
      const membersData = await api.getChannelMembers(channelId);
      setMembers(membersData);
    } catch (error) {
      toast({
        title: 'Failed to join',
        description: 'Could not join channel',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading channel...</p>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="h-14 border-b border-border px-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold text-lg">{channel.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{members.length}</span>
          </div>
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((member) => {
              const memberUser = users[member.user_id];
              if (!memberUser) return null;
              return (
                <Avatar
                  key={member.user_id}
                  name={memberUser.name}
                  size="sm"
                  online={onlineUsers.includes(member.user_id)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Messages */}
      {!isMember ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              You're not a member of this channel yet
            </p>
            <Button onClick={handleJoinChannel}>Join Channel</Button>
          </div>
        </div>
      ) : (
        <>
          <MessageList messages={messages} currentUserId={user!.id} users={users} />
          <MessageComposer onSend={handleSendMessage} disabled={!isConnected} />
        </>
      )}
    </div>
  );
};
