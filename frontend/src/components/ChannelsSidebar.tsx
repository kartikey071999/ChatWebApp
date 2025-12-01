import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hash, Plus, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Channel } from '@/types';

interface ChannelsSidebarProps {
  channels: Channel[];
  activeChannelId?: string;
  onChannelSelect: (channelId: string) => void;
  onCreateChannel: (name: string) => void;
  memberCounts: Record<string, number>;
}

export const ChannelsSidebar: React.FC<ChannelsSidebarProps> = ({
  channels,
  activeChannelId,
  onChannelSelect,
  onCreateChannel,
  memberCounts,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      onCreateChannel(newChannelName.trim());
      setNewChannelName('');
      setIsCreateOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Channels</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onChannelSelect(channel.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                activeChannelId === channel.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Hash className="w-4 h-4" />
              <span className="flex-1 text-left truncate">{channel.name}</span>
              {memberCounts[channel.id] && (
                <span className="text-xs text-muted-foreground">
                  {memberCounts[channel.id]}
                </span>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-sidebar-border space-y-2">
        {user?.role === 'admin' && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create Channel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Channel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Channel name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateChannel()}
                />
                <Button onClick={handleCreateChannel} className="w-full">
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => navigate('/settings')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};
