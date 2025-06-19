import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES, setStudentList, kickStudent } from '../redux/actions/userActions';
import { 
  createPoll, 
  fetchPollHistory, 
  setActivePoll, 
  setPollResults, 
  setPollHistory,
  setPollQueue
} from '../redux/actions/pollActions';
import chatIcon from '../assets/chat-icon.svg';
import './TeacherView.css';

// Components
import PollForm from '../components/PollForm';
import PollResults from '../components/PollResults';
import StudentList from '../components/StudentList';
import PollHistory from '../components/PollHistory';
import ChatBox from '../components/ChatBox';

const TeacherView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const { userType } = useSelector(state => state.user);
  const { socket } = useSelector(state => state.socket);
  const { activePoll, pollResults, pollHistory, pollQueue } = useSelector(state => state.polls);
  const { studentList } = useSelector(state => state.user);
    const [showHistory, setShowHistory] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatUnread, setChatUnread] = useState(false);
  
  // Check if user is authorized as teacher
  useEffect(() => {
    const storedType = localStorage.getItem('userType');
    
    if (storedType !== USER_TYPES.TEACHER) {
      navigate('/');
    }
  }, [navigate, userType]);
  
  // Register teacher with the server
  useEffect(() => {
    if (socket) {
      socket.emit('registerTeacher', { name: 'Teacher' });
    }
  }, [socket]);
    // Set up socket listeners
  useEffect(() => {
    if (socket) {
      // Get initial poll history
      dispatch(fetchPollHistory());
      
      // Listen for new poll
      socket.on('newPoll', (poll) => {
        dispatch(setActivePoll(poll));
      });
      
      // Listen for poll results updates
      socket.on('pollResults', (results) => {
        dispatch(setPollResults(results));
      });
      
      // Listen for poll ended
      socket.on('pollEnded', ({ poll, results }) => {
        dispatch(setActivePoll(null));
        dispatch(setPollResults(results));
      });
      
      // Listen for student list updates
      socket.on('updateStudentList', (students) => {
        dispatch(setStudentList(students));
      });
      
      // Listen for poll queue updates
      socket.on('pollQueueUpdated', (queue) => {
        dispatch(setPollQueue(queue));
      });
      
      // Listen for poll creation confirmation
      socket.on('pollCreated', (data) => {
        console.log('Poll created:', data);
      });
      
      // Listen for poll history
      socket.on('pollHistory', (history) => {
        dispatch(setPollHistory(history));
      });
      
      // Error handling
      socket.on('pollError', (error) => {
        console.error('Poll error:', error);
        alert(error.message);
      });
      
      // Clean up listeners on unmount
      return () => {
        socket.off('newPoll');
        socket.off('pollResults');
        socket.off('pollEnded');
        socket.off('updateStudentList');
        socket.off('pollHistory');
        socket.off('pollError');
      };
    }
  }, [socket, dispatch]);
  
  // Handle new poll submission
  const handleCreatePoll = (pollData) => {
    dispatch(createPoll(pollData));
  };
  
  // Handle student kick
  const handleKickStudent = (studentId) => {
    dispatch(kickStudent(studentId));
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userType');
    navigate('/');
  };
  
  return (
    <div className="teacher-container">
      <header className="teacher-header">
        <div className="header-title">
          <div className="intervue-hub">Intervue Poll</div>
          <h1>Teacher Dashboard</h1>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>
      
      <div className="teacher-content">
        <div className="left-panel">
          {!activePoll ? (
            <PollForm onSubmit={handleCreatePoll} />
          ) : (
            <div className="active-poll-container">
              <h2>Active Poll</h2>
              <div className="question-display">
                <div className="question-header">Question {activePoll.id}</div>
                <div className="question-text">"{activePoll.question}"</div>
              </div>
              <PollResults results={pollResults} options={activePoll.options} />
            </div>
          )}            <div className="action-buttons">
              <button className="ask-question-btn">
                + Ask a new question
              </button>
              
              <div className="view-buttons">
                {showHistory ? (
                  <button onClick={() => {setShowHistory(false); setShowQueue(false);}} className="view-history-btn">
                    Hide Poll History
                  </button>
                ) : (
                  <button onClick={() => {setShowHistory(true); setShowQueue(false);}} className="view-history-btn">
                    <span className="eye-icon">👁️</span> View Poll history
                  </button>
                )}
                
                {showQueue ? (
                  <button onClick={() => {setShowQueue(false); setShowHistory(false);}} className="view-queue-btn">
                    Hide Question Queue
                  </button>
                ) : (
                  <button onClick={() => {setShowQueue(true); setShowHistory(false);}} className="view-queue-btn">
                    <span className="queue-icon">🔄</span> View Queue ({pollQueue.length})
                  </button>
                )}
              </div>
            </div>
            
            {showHistory && (
              <PollHistory pollHistory={pollHistory} />
            )}
            
            {showQueue && pollQueue.length > 0 && (
              <div className="poll-queue">
                <h2>Upcoming Questions ({pollQueue.length})</h2>
                <div className="queue-list">
                  {pollQueue.map((poll, index) => (
                    <div className="queue-item" key={poll.id}>
                      <div className="queue-number">{index + 1}</div>
                      <div className="queue-content">
                        <p className="queue-question">{poll.question}</p>
                        <p className="queue-options">
                          {poll.options.map((option, i) => (
                            <span key={i} className={option === poll.correctAnswer ? 'correct-option' : ''}>
                              {option}{i < poll.options.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
        <div className="right-panel">
          <div className="tab-container">
            <div className="tabs">
              <div className={`tab ${!showChat ? 'active' : ''}`} onClick={() => setShowChat(false)}>
                Participants
              </div>
              <div className={`tab ${showChat ? 'active' : ''}`} onClick={() => setShowChat(true)}>
                Chat
              </div>
            </div>
            
            <div className="tab-content">
              {!showChat ? (
                <StudentList students={studentList} onKickStudent={handleKickStudent} />
              ) : (
                <ChatBox onNewMessage={() => !showChat && setChatUnread(true)} />
              )}
            </div>
          </div>
        </div>
          <div className="chat-icon-container">
          <img 
            src={chatIcon} 
            alt="Chat"
            className={`chat-icon ${showChat ? 'active' : ''} ${chatUnread ? 'unread' : ''}`}
            onClick={() => {
              setShowChat(!showChat);
              if (chatUnread) setChatUnread(false);
            }}
          />
          {showChat && (
            <div className="chat-popup-container mobile-only">
              <div className="chat-popup">
                <div className="chat-popup-header">
                  <h3>Chat</h3>
                  <button onClick={() => setShowChat(false)} className="close-chat">×</button>
                </div>
                <ChatBox onNewMessage={() => !showChat && setChatUnread(true)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
