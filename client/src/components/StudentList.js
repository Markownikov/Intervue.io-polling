import React from 'react';
import './StudentList.css';

const StudentList = ({ students, onKickStudent }) => {  if (!students || students.length === 0) {
    return (
      <div className="student-list-container">
        <div className="no-students">No students connected</div>
      </div>
    );
  }
  
  return (
    <div className="student-list-container">
      
      <div className="student-list-header">
        <div className="name-column">Name</div>
        <div className="action-column">Action</div>
      </div>
      
      <div className="student-list">
        {students.map((student) => (
          <div key={student.id} className="student-item">
            <div className="student-name">{student.name}</div>
            <div className="student-action">
              <button 
                className="kick-btn" 
                onClick={() => onKickStudent(student.id)}
              >
                Kick out
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
