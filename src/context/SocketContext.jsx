import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && user && user._id) {
      socket.emit('join_user', user._id);

      const handleNewRequest = (data) => {
        addNotification({
          id: Date.now(),
          type: 'info',
          title: 'New Skill Request',
          message: data.message
        });
      };

      const handleStatusChange = (data) => {
        addNotification({
          id: Date.now(),
          type: 'success',
          title: 'Request Updated',
          message: data.message
        });
        refreshUser();
      };

      const handleCreditsTransferred = (data) => {
        addNotification({
          id: Date.now(),
          type: data.type === 'earned' ? 'success' : 'info',
          title: data.type === 'earned' ? 'Credits Earned! 🎉' : 'Credits Sent',
          message: data.message
        });
        refreshUser();
      };

      socket.on('new_request', handleNewRequest);
      socket.on('status_change', handleStatusChange);
      socket.on('credits_transferred', handleCreditsTransferred);

      return () => {
        socket.off('new_request', handleNewRequest);
        socket.off('status_change', handleStatusChange);
        socket.off('credits_transferred', handleCreditsTransferred);
      };
    }
  }, [socket, user]);

  const addNotification = (notif) => {
    setNotifications(prev => [notif, ...prev.slice(0, 4)]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, removeNotification, addNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
