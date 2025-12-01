import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ChannelsSidebar } from '@/components/ChannelsSidebar';
import { useToast } from '@/hooks/use-toast';
import type { Channel } from '@/types';

export const ChannelsLayout: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const { channelId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const channelsData = await api.getChannels();
      setChannels(channelsData);

      // Load member counts for each channel
      const counts: Record<string, number> = {};
      for (const channel of channelsData) {
        const members = await api.getChannelMembers(channel.id);
        counts[channel.id] = members.length;
      }
      setMemberCounts(counts);

      // Navigate to first channel if none selected
      if (!channelId && channelsData.length > 0) {
        navigate(`/channels/${channelsData[0].id}`);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
      toast({
        title: 'Error',
        description: 'Failed to load channels',
        variant: 'destructive',
      });
    }
  };

  const handleCreateChannel = async (name: string) => {
    if (!user) return;

    try {
      const newChannel = await api.createChannel(name, user.id);
      setChannels((prev) => [...prev, newChannel]);
      toast({ title: 'Channel created', description: `#${name} is ready!` });
      navigate(`/channels/${newChannel.id}`);
    } catch (error) {
      toast({
        title: 'Failed to create channel',
        description: error instanceof Error ? error.message : 'Could not create channel',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ChannelsSidebar
        channels={channels}
        activeChannelId={channelId}
        onChannelSelect={(id) => navigate(`/channels/${id}`)}
        onCreateChannel={handleCreateChannel}
        memberCounts={memberCounts}
      />
      <Outlet />
    </div>
  );
};
