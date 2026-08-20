import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  ArrowLeft, 
  MessageSquare, 
  CheckCheck, 
  Clock, 
  ShieldCheck,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import API from '../services/api';

const ChatPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [request, setRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/requests/${requestId}`);
      if (res.data.success) {
        setRequest(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load request details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  useEffect(() => {
    if (socket && user && requestId) {
      socket.emit('join_request', { requestId, userId: user._id });

      const handleMessageHistory = (history) => {
        setMessages(history);
      };

      const handleReceiveMessage = (msg) => {
        setMessages((prev) => [...prev, msg]);
      };

      const handleUserTyping = ({ userName }) => {
        setTypingUser(userName);
      };

      const handleUserStopTyping = () => {
        setTypingUser('');
      };

      const handleRequestUpdated = (updatedReq) => {
        setRequest(updatedReq);
      };

      socket.on('message_history', handleMessageHistory);
      socket.on('receive_message', handleReceiveMessage);
      socket.on('user_typing', handleUserTyping);
      socket.on('user_stop_typing', handleUserStopTyping);
      socket.on('request_updated', handleRequestUpdated);

      return () => {
        socket.off('message_history', handleMessageHistory);
        socket.off('receive_message', handleReceiveMessage);
        socket.off('user_typing', handleUserTyping);
        socket.off('user_stop_typing', handleUserStopTyping);
        socket.off('request_updated', handleRequestUpdated);
      };
    }
  }, [socket, user, requestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;

    socket.emit('send_message', {
      requestId,
      senderId: user._id,
      text: text.trim()
    });

    socket.emit('stop_typing', { requestId });
    setText('');
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (socket) {
      socket.emit('typing', { requestId, userName: user.name });
      setTimeout(() => {
        socket.emit('stop_typing', { requestId });
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!request) {
    return <div className="text-center py-20">Request or Chat Room not found.</div>;
  }

  const isRequester = request.requesterId?._id === user?._id;
  const counterParty = isRequester ? request.providerId : request.requesterId;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* CHAT CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* CHAT HEADER */}
        <div className="bg-white border-b border-slate-200 p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => navigate('/requests')}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <img
              src={counterParty?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={counterParty?.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-brand-100"
            />

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-slate-900 text-base">{counterParty?.name}</h3>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  ⚡ {request.proposedHours} Credits
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-md">
                Topic: <span className="font-bold text-slate-800">{request.skillName}</span> ({request.status})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-block text-xs font-bold text-slate-500">
              Status: <span className="uppercase text-brand-600 font-extrabold">{request.status}</span>
            </span>
          </div>
        </div>

        {/* MESSAGES LIST AREA */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#FAF8F5] space-y-4">
          
          {/* System Notification Badge inside chat */}
          <div className="text-center py-2">
            <span className="inline-flex items-center space-x-1.5 bg-slate-200/80 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Real-time end-to-end chat active for request #{request._id.slice(-6)}</span>
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="text-center text-xs text-slate-400 py-10">
              No messages exchanged yet. Say hello to discuss schedule & location!
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.senderId?._id === user?._id || msg.senderId === user?._id;

              return (
                <div
                  key={msg._id || index}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md space-y-1 ${isMine ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-sm font-medium leading-relaxed ${
                        isMine
                          ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-br-none shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className={`flex items-center space-x-1 text-[10px] text-slate-400 px-1 ${
                      isMine ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {typingUser && (
            <div className="text-xs text-slate-500 italic flex items-center space-x-1">
              <span>{typingUser} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* CHAT INPUT FORM */}
        <form onSubmit={handleSendMessage} className="bg-white border-t border-slate-200 p-3 sm:p-4 flex items-center space-x-3">
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            placeholder={`Message ${counterParty?.name.split(' ')[0]}...`}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />

          <button
            type="submit"
            disabled={!text.trim()}
            className="p-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition shadow-md disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </div>

    </div>
  );
};

export default ChatPage;
