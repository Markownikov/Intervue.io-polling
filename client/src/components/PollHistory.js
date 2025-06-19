import React from 'react';
import './PollHistory.css';

const PollHistory = ({ pollHistory }) => {
  if (!pollHistory || pollHistory.length === 0) {
    return (
      <div className="poll-history-container">
        <h2>Poll History</h2>
        <div className="no-history">No previous polls</div>
      </div>
    );
  }
  
  return (
    <div className="poll-history-container">
      <h2>Poll History</h2>
      
      <div className="history-list">
        {pollHistory.map((poll, index) => (
          <div key={index} className="history-item">
            <h3>Question {index + 1}</h3>
            <div className="history-question">"{poll.question}"</div>
            
            <div className="history-results">
              {poll.options.map((option, optIndex) => {
                const result = poll.results[option] || { percentage: 0 };
                
                return (
                  <div key={optIndex} className="history-result-item">
                    <div className="history-option">{option}</div>
                    <div className="history-percentage">{result.percentage}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollHistory;
