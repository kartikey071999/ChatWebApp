import React, { useEffect, useRef } from 'react';
import { Avatar } from '@/components/Avatar';
import { format, isToday, isYesterday } from 'date-fns';
import type { Message, User } from '@/types';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  users: Record<string, User>;
}

const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  }
  return format(date, 'MMM dd HH:mm');
};

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, users }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);

  useEffect(() => {
    if (scrollRef.current && wasAtBottomRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      wasAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 50;
    }
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {messages.map((message, index) => {
        const sender = users[message.sender_id];
        const isOwn = message.sender_id === currentUserId;
        const showAvatar = !isOwn && (
          index === 0 ||
          messages[index - 1].sender_id !== message.sender_id
        );

        return (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.status === 'sending' && 'opacity-60'
            )}
          >
            {!isOwn && (
              <div className="flex-shrink-0">
                {showAvatar && sender ? (
                  <Avatar name={sender.name} size="sm" />
                ) : (
                  <div className="w-8" />
                )}
              </div>
            )}

            <div className={cn('flex-1', isOwn && 'flex justify-end')}>
              <div className={cn('max-w-lg', isOwn && 'text-right')}>
                {showAvatar && sender && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">
                      {sender.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatMessageTime(message.created_at)}
                    </span>
                  </div>
                )}
                <div
                  className={cn(
                    'inline-block px-4 py-2 rounded-lg',
                    isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground border border-border'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
