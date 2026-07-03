import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Send, User, Search, CheckCircle, Clock } from 'lucide-react';
import { chatApi, type AdminChat, type AdminChatMessage } from '../lib/api';

export default function AdminChats() {
  const [chats, setChats] = useState<AdminChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<AdminChat | null>(null);
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    loadChats();
    const interval = setInterval(loadChats, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (selectedChat) loadMessages(selectedChat.id);
  }, [selectedChat?.id]);

  const loadChats = async () => {
    try {
      const data = await chatApi.list();
      setChats(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const loadMessages = async (chatId: number) => {
    try {
      const msgs = await chatApi.messages(chatId);
      setMessages(msgs);
      await chatApi.reply(chatId, ''); // mark as read via unread endpoint
    } catch { /* ignore */ }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selectedChat || sending) return;
    setSending(true);
    try {
      const msg = await chatApi.reply(selectedChat.id, reply.trim());
      setMessages(prev => [...prev, msg]);
      setReply('');
    } catch { /* ignore */ }
    setSending(false);
  };

  const handleClose = async (chatId: number) => {
    try {
      await chatApi.close(chatId);
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, status: 'closed' } : c));
      if (selectedChat?.id === chatId) {
        setSelectedChat(prev => prev ? { ...prev, status: 'closed' } : null);
      }
    } catch { /* ignore */ }
  };

  const filtered = chats.filter(c =>
    c.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.guest_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Live Chat</h1>
          <p className="text-sm text-neutral-500">Manage customer conversations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <div className="bg-white border border-neutral-200 rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-neutral-100">
            <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-2">
              <Search size={14} className="text-neutral-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="bg-transparent text-sm outline-none w-full" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-neutral-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-neutral-400">No conversations</div>
            ) : (
              filtered.map(chat => (
                <button key={chat.id} onClick={() => setSelectedChat(chat)}
                  className={`w-full text-left p-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${selectedChat?.id === chat.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-neutral-800 truncate">{chat.guest_name}</p>
                        {chat.status === 'open' ? (
                          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        ) : (
                          <CheckCircle size={12} className="text-neutral-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 truncate">{chat.guest_email}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={10} className="text-neutral-400" />
                        <p className="text-[10px] text-neutral-400">
                          {chat.last_message_at ? new Date(chat.last_message_at).toLocaleString() : 'No messages'}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{selectedChat.guest_name}</p>
                    <p className="text-xs text-neutral-500">{selectedChat.guest_email} · {selectedChat.guest_phone || 'No phone'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedChat.status === 'open' && (
                    <button onClick={() => handleClose(selectedChat.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      Close Chat
                    </button>
                  )}
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${selectedChat.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                    {selectedChat.status}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
                {messages.map(msg => {
                  const isAdmin = msg.sender_type === 'admin';
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        {isAdmin ? <MessageSquare size={12} className="text-blue-600" /> : <User size={12} className="text-blue-600" />}
                      </div>
                      <div className={`max-w-[70%] ${isAdmin ? 'text-right' : ''}`}>
                        <p className="text-[10px] text-neutral-400 mb-0.5">{msg.sender_name}</p>
                        <div className={`inline-block px-3 py-2 rounded-2xl text-xs ${
                          isAdmin
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-sm'
                        }`}>
                          {msg.message}
                        </div>
                        <p className="text-[9px] text-neutral-400 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input */}
              {selectedChat.status === 'open' && (
                <div className="p-3 border-t border-neutral-100 flex items-center gap-2">
                  <input value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                    placeholder="Type a reply..."
                    className="flex-1 text-sm px-3 py-2.5 bg-neutral-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-200" />
                  <button onClick={handleReply} disabled={!reply.trim() || sending}
                    className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition-colors cursor-pointer">
                    <Send size={14} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-6">
              <div>
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={24} className="text-blue-400" />
                </div>
                <p className="text-sm font-semibold text-neutral-800 mb-1">Select a Conversation</p>
                <p className="text-xs text-neutral-500">Choose a chat from the list to start replying</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
