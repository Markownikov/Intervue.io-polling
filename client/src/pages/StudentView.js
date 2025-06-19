import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES, setUserData, registerStudent } from '../redux/actions/userActions';
import { submitAnswer, setActivePoll, setPollResults, setAnswerFeedback } from '../redux/actions/pollActions';
import chatIcon from '../assets/chat-icon.svg';
import './StudentView.css';

// Components
import PollQuestion from '../components/PollQuestion';
import PollResults from '../components/PollResults';
import ChatBox from '../components/ChatBox';

const StudentView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userType, userData } = useSelector(state => state.user);
  const { socket } = useSelector(state => state.socket);
  const { activePoll, pollResults } = useSelector(state => state.polls);
  
  const [answered, setAnswered] = useState(false);
  const [kicked, setKicked] = useState(false);  const [timer, setTimer] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatUnread, setChatUnread] = useState(false);
  // Check if user is authorized as student
  useEffect(() => {
    const storedType = localStorage.getItem('userType');
    const storedName = localStorage.getItem('studentName');
    
    if (storedType !== USER_TYPES.STUDENT || !storedName) {
      navigate('/');
    } else if (socket && !userData) {
      // Register with server
      dispatch(registerStudent(storedName));
    }
  }, [navigate, userType, userData, socket, dispatch]);
    // Set up socket listeners
  useEffect(() => {
    if (socket) {
      // Handle registration success
      socket.on('registrationSuccess', (data) => {
        dispatch(setUserData(data));
      });
        // Listen for new poll
      socket.on('newPoll', (poll) => {
        dispatch(setActivePoll(poll));
        setAnswered(false);
        // Clear previous answer feedback when a new poll arrives
        dispatch(setAnswerFeedback(null));
        
        // Set timer for poll
        if (poll.timeLimit) {
          const timeLimit = poll.timeLimit * 1000; // convert to milliseconds
          setTimer(timeLimit);
          
          // Auto-submit after time limit
          const timerId = setTimeout(() => {
            if (!answered) {
              setAnswered(true);
            }
          }, timeLimit);
          
          return () => clearTimeout(timerId);
        }
      });
      
      // Listen for poll results updates
      socket.on('pollResults', (results) => {
        dispatch(setPollResults(results));
      });
      
      // Listen for poll ended
      socket.on('pollEnded', ({ poll, results }) => {
        setAnswered(true);
        dispatch(setPollResults(results));
      });
        // Listen for kick
      socket.on('kicked', () => {
        setKicked(true);
        localStorage.removeItem('studentName');
        localStorage.removeItem('userType');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      });
      
      // Listen for answer feedback
      socket.on('answerFeedback', (feedback) => {        dispatch(setAnswerFeedback(feedback));
      });
      
      // Clean up listeners on unmount
      return () => {
        socket.off('registrationSuccess');
        socket.off('newPoll');
        socket.off('pollResults');
        socket.off('pollEnded');
        socket.off('kicked');
        socket.off('answerFeedback');
      };
    }
  }, [socket, dispatch, answered, navigate]);
  
  // Timer effect
  useEffect(() => {
    if (!timer || answered || !activePoll) return;
    
    let interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1000) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timer, answered, activePoll]);
  
  // Handle answer submission
  const handleAnswer = (answer) => {
    dispatch(submitAnswer(answer));
    setAnswered(true);
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('studentName');
    localStorage.removeItem('userType');
    navigate('/');
  };
  
  // Format time
  const formatTime = (ms) => {
    if (!ms) return '00:00';
    const seconds = Math.floor(ms / 1000);
    return `00:${seconds.toString().padStart(2, '0')}`;
  };
  if (kicked) {
    return (
      <div className="kicked-container">
        <div className="intervue-poll-badge">Intervue Poll</div>
        <h1 className="kicked-title">You've been Kicked out !</h1>
        <p className="kicked-subtitle">Looks like the teacher had removed you from the poll system. Please try again sometime.</p>
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
            <div className="chat-popup-container">
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
    );
  }
  
  return (
    <div className="student-container">
      <header className="student-header">
        <div className="header-title">
          <div className="intervue-hub">Intervue Poll</div>
          <h1>Student View</h1>
          {userData && <p className="student-name">Welcome, {userData.name}</p>}
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>
      
      <div className="student-content">
        <div className="main-panel">
          {activePoll ? (
            <div className="poll-container">
              <div className="timer-bar">
                <div className="question-number">Question {activePoll.id}</div>
                {timer > 0 && !answered && (
                  <div className="timer">{formatTime(timer)}</div>
                )}
              </div>
              
              {!answered ? (
                <PollQuestion 
                  question={activePoll.question}
                  options={activePoll.options}
                  onAnswer={handleAnswer}
                />
              ) : (
                <div className="results-container">
                  <h3 className="question-text">"{activePoll.question}"</h3>
                  <PollResults results={pollResults} options={activePoll.options} />
                </div>
              )}
            </div>          ) : (            <div className="waiting-container">
              <div className="intervue-poll-badge">Intervue Poll</div>
              <div className="spinner-container">
                <div className="loading-spinner"></div>
              </div>
              <p>Wait for the teacher to ask questions..</p>
            </div>
          )}
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
            <div className="chat-popup-container">
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

export default StudentView;
