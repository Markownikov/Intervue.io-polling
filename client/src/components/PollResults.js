import React from 'react';
import './PollResults.css';

const PollResults = ({ results, options }) => {
  // Handle case when no results yet
  if (!results || !options || Object.keys(results).length === 0) {
    return (
      <div className="poll-results no-results">
        <p>No answers submitted yet</p>
      </div>
    );
  }
  
  return (
    <div className="poll-results">
      {options.map((option, index) => {
        const result = results[option] || { percentage: 0 };
        
        return (
          <div key={index} className="result-item">
            <div className="result-option">
              <div className="option-dot">{index + 1}</div>
              <span className="option-text">{option}</span>
            </div>
            
            <div className="result-bar-container">
              <div 
                className="result-bar"
                style={{ width: `${result.percentage}%` }}
              ></div>
              <span className="percentage">{result.percentage}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PollResults;
