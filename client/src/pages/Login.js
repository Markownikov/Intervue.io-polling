import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserType, USER_TYPES } from '../redux/actions/userActions';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Check local storage for student name
  React.useEffect(() => {
    const storedName = localStorage.getItem('studentName');
    const storedType = localStorage.getItem('userType');
    
    if (storedName && storedType === USER_TYPES.STUDENT) {
      dispatch(setUserType(USER_TYPES.STUDENT));
      navigate('/student');
    }
  }, [dispatch, navigate]);
  
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
  
  const handleContinue = () => {
    if (selectedRole === USER_TYPES.TEACHER) {
      dispatch(setUserType(USER_TYPES.TEACHER));
      localStorage.setItem('userType', USER_TYPES.TEACHER);
      navigate('/teacher');
    } else if (selectedRole === USER_TYPES.STUDENT) {
      navigate('/student-login');
    }
  };
  
  return (
    <div className="login-container">
      <div className="intervue-poll-badge">Intervue Poll</div>
      
      <div className="login-content">
        <h1 className="welcome-title">Welcome to the Live Polling System</h1>
        <p className="welcome-subtitle">Please select the role that best describes you to begin using the live polling system</p>
        
        <div className="role-selection">          <div 
            className={`role-card ${selectedRole === USER_TYPES.STUDENT ? 'selected' : ''}`}
            onClick={() => handleRoleSelect(USER_TYPES.STUDENT)}
          >
            <h2>I'm a Student</h2>
            <p>Submit answers and view live poll results in real-time.</p>
          </div><div 
            className={`role-card ${selectedRole === USER_TYPES.TEACHER ? 'selected' : ''}`}
            onClick={() => handleRoleSelect(USER_TYPES.TEACHER)}
          >
            <h2>I'm a Teacher</h2>
            <p>Create and manage polls, ask questions, and monitor your students' responses in real-time.</p>
          </div>
        </div>
        
        <button 
          className="continue-button" 
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Login;
