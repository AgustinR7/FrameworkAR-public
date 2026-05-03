import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, TextField, Avatar, Badge } from '@mui/material';
import { MessageCircle, X, Search, Sparkles, Send, ChevronLeft, Bot } from 'lucide-react';
import { useAuth } from '../../../context/AuthProvider';
import { useTranslation } from 'react-i18next';
import { config } from '../../../config';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  username: string;
  email: string;
  profile?: { firstName: string | null; lastName: string | null };
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

const getDisplayName = (u: User): string => {
  const first = u.profile?.firstName?.trim();
  const last = u.profile?.lastName?.trim();
  if (first || last) return [first, last].filter(Boolean).join(' ');
  return u.username;
};

const FloatingChat: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'ai' | 'chat'>('list');
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeChatUserRef = useRef<User | null>(null);

  // Keep ref in sync so socket handler always has the latest value
  useEffect(() => {
    activeChatUserRef.current = activeChatUser;
  }, [activeChatUser]);

  // Load users
  useEffect(() => {
    if (isOpen && view === 'list' && user) {
      axios.get(`${config.apiUrl}/api/chat/users`, { withCredentials: true })
        .then(res => setUsers(res.data))
        .catch(err => console.error(err));
    }
  }, [isOpen, view, user]);

  // Connect socket
  useEffect(() => {
    if (user) {
      socketRef.current = io(config.socketUrl, { withCredentials: true });
      socketRef.current.emit('register', user.id);

      socketRef.current.on('onlineUsers', (userIds: string[]) => {
        setOnlineUsers(new Set(userIds));
      });

      socketRef.current.on('userOnline', (userId: string) => {
        setOnlineUsers(prev => new Set([...prev, userId]));
      });

      socketRef.current.on('userOffline', (userId: string) => {
        setOnlineUsers(prev => { const s = new Set(prev); s.delete(userId); return s; });
      });

      socketRef.current.on('receiveMessage', (msg: Message) => {
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

        // If the message is from someone other than the active chat, add unread badge
        if (msg.senderId !== user.id && msg.senderId !== activeChatUserRef.current?.id) {
          setUnreadCounts(prev => ({
            ...prev,
            [msg.senderId]: (prev[msg.senderId] || 0) + 1
          }));
        }
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [user]);

  const openChatWithUser = async (targetUser: User) => {
    setActiveChatUser(targetUser);
    setView('chat');
    setUnreadCounts(prev => { const n = { ...prev }; delete n[targetUser.id]; return n; });
    try {
      const convRes = await axios.get(`${config.apiUrl}/api/chat/conversation/${targetUser.id}`, { withCredentials: true });
      const convId = convRes.data.id;
      setConversationId(convId);
      const msgRes = await axios.get(`${config.apiUrl}/api/chat/messages/${convId}`, { withCredentials: true });
      setMessages(msgRes.data);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChatUser || !conversationId || !user) return;
    socketRef.current?.emit('sendMessage', {
      conversationId,
      senderId: user.id,
      receiverId: activeChatUser.id,
      content: newMessage.trim()
    });
    setNewMessage('');
  };

  if (!user) return null;

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
  const filteredUsers = users.filter(u =>
    getDisplayName(u).toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 48, zIndex: 9999 }}>
      {/* Floating button */}
      {!isOpen && (
        <Badge badgeContent={totalUnread} color="error" max={99}>
          <IconButton
            onClick={() => setIsOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, var(--color-ai-purple), var(--color-ai-blue))',
              color: 'white',
              width: 60,
              height: 60,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <MessageCircle size={32} />
          </IconButton>
        </Badge>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Box
          sx={{
            width: 350,
            height: 500,
            background: 'rgba(25, 25, 25, 0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            animation: 'slideUp 0.3s ease-out forwards',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          {/* Header */}
          <Box sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: view === 'ai' ? 'linear-gradient(135deg, rgba(204,153,255,0.1), rgba(204,255,255,0.1))' : 'transparent'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {view !== 'list' && (
                <IconButton size="small" onClick={() => setView('list')} sx={{ color: 'white' }}>
                  <ChevronLeft size={20} />
                </IconButton>
              )}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', lineHeight: 1.2 }}>
                  {view === 'list' ? t('chat.title') : view === 'ai' ? t('chat.ai') : getDisplayName(activeChatUser!)}
                </Typography>
                {view === 'chat' && activeChatUser && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{
                      width: 8, height: 8, borderRadius: '50%',
                      bgcolor: onlineUsers.has(activeChatUser.id) ? '#4caf50' : '#757575'
                    }} />
                    <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                      {onlineUsers.has(activeChatUser.id) ? t('chat.online') : t('chat.offline')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* Views */}
          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* List view */}
            {view === 'list' && (
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

                {/* AI Option */}
                <Box
                  onClick={() => setView('ai')}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2, p: 2,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--color-ai-purple), var(--color-ai-blue))',
                    cursor: 'pointer', transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}
                >
                  <Box sx={{ background: 'rgba(255,255,255,0.2)', p: 1, borderRadius: '50%' }}>
                    <Sparkles size={24} color="white" />
                  </Box>
                  <Box>
                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>{t('chat.aiOption')}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>{t('chat.aiSubtitle')}</Typography>
                  </Box>
                </Box>

                <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', my: 1 }} />

                <TextField
                  fullWidth size="small"
                  placeholder={t('chat.search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <Search size={18} style={{ color: 'rgba(255,255,255,0.5)', marginRight: 8 }} />,
                    sx: { borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }
                  }}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  {filteredUsers.map(u => {
                    const isOnline = onlineUsers.has(u.id);
                    const unread = unreadCounts[u.id] || 0;
                    return (
                      <Box
                        key={u.id}
                        onClick={() => openChatWithUser(u)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 2, p: 1.5,
                          borderRadius: '12px', cursor: 'pointer',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                            {getDisplayName(u).charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{
                            position: 'absolute', bottom: 1, right: 1,
                            width: 10, height: 10, borderRadius: '50%',
                            bgcolor: isOnline ? '#4caf50' : '#757575',
                            border: '2px solid rgba(25,25,25,0.85)'
                          }} />
                        </Box>
                        <Typography sx={{ color: 'white', flex: 1 }}>{getDisplayName(u)}</Typography>
                        {unread > 0 && (
                          <Box sx={{
                            bgcolor: 'error.main', color: 'white',
                            borderRadius: '50%', width: 20, height: 20,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', fontWeight: 'bold'
                          }}>
                            {unread > 9 ? '9+' : unread}
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', mt: 2 }}>
                      {t('chat.noUsers')}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            {/* AI in progress */}
            {view === 'ai' && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}>
                <Bot size={64} style={{ color: 'var(--color-ai-cyan)', marginBottom: 16 }} />
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                  {t('chat.wip')} 🛠️
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {t('chat.wipDesc')}
                </Typography>
              </Box>
            )}

            {/* Chat P2P */}
            {view === 'chat' && (
              <>
                <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
                  {messages.map((msg, i) => {
                    const isMe = msg.senderId === user.id;
                    return (
                      <Box key={msg.id || i} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <Box sx={{
                          maxWidth: '75%', p: 1.5, borderRadius: '16px',
                          borderBottomRightRadius: isMe ? '4px' : '16px',
                          borderBottomLeftRadius: !isMe ? '4px' : '16px',
                          background: isMe ? 'rgba(255,255,255,0.1)' : 'var(--color-ai-lilac)',
                          color: isMe ? 'white' : '#1a1a1a',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          <Typography sx={{ fontSize: '0.9rem' }}>{msg.content}</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </Box>

                <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth size="small"
                    placeholder={t('chat.placeholder')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    InputProps={{ sx: { borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.05)', color: 'white' } }}
                  />
                  <IconButton
                    onClick={handleSendMessage}
                    sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                  >
                    <Send size={18} />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FloatingChat;
