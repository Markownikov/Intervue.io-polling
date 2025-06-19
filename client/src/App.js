import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import './App.css';

// Pages
import TeacherView from './pages/TeacherView';
import StudentView from './pages/StudentView';
import Login from './pages/Login';
import StudentLogin from './pages/StudentLogin';

// Redux actions
import { setSocket } from './redux/actions/socketActions';

const SOCKET_SERVER = 'http://localhost:5000';

function App() {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Initialize socket connection
    const socket = io(SOCKET_SERVER);
    
    socket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
      dispatch(setSocket(socket));
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });
    
    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
  
  if (!isConnected) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Connecting to server...</p>
      </div>
    );
  }
  
  return (
    <div className="app">      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacher" element={<TeacherView />} />
        <Route path="/student" element={<StudentView />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
