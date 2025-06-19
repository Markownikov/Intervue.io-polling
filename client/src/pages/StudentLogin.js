import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserType, USER_TYPES, setUserData, registerStudent } from '../redux/actions/userActions';
import './StudentLogin.css';

const StudentLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [studentName, setStudentName] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Check local storage for student name on first load
  useEffect(() => {
    const storedName = localStorage.getItem('studentName');
    const storedType = localStorage.getItem('userType');
    
    if (storedName && storedType === USER_TYPES.STUDENT) {
      setStudentName(storedName);
      dispatch(setUserType(USER_TYPES.STUDENT));
      dispatch(setUserData({ name: storedName }));
      navigate('/student');
    }
  }, [dispatch, navigate]);
  
  const handleContinue = () => {
    if (!studentName.trim()) {
      setNameError('Please enter your name');
      return;
    }
    
    dispatch(setUserType(USER_TYPES.STUDENT));
    dispatch(setUserData({ name: studentName }));
    dispatch(registerStudent(studentName));
    
    localStorage.setItem('userType', USER_TYPES.STUDENT);
    localStorage.setItem('studentName', studentName);
    
    navigate('/student');
  };
  
  return (
    <div className="student-login-container">
      <div className="intervue-poll-badge">Intervue Poll</div>
      
      <div className="student-login-content">
        <h1 className="welcome-title">Enter Your Name</h1>
        <p className="welcome-subtitle">Please enter your name to join the live polling session</p>
        
        <div className="student-name-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your name"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                setNameError('');
              }}
              className={nameError ? 'error' : ''}
            />
            {nameError && <div className="error-message">{nameError}</div>}
          </div>
          
          <button 
            className="continue-button" 
            onClick={handleContinue}
            disabled={!studentName.trim()}
          >
            Join Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
