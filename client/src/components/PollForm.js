import React, { useState } from 'react';
import './PollForm.css';

const PollForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState('Which planet is known as the Red Planet?"');
  const [options, setOptions] = useState(['Mars', 'Venus', 'Jupiter', 'Saturn']);
  const [timeLimit, setTimeLimit] = useState(60);
  const [correctAnswer, setCorrectAnswer] = useState('Mars');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please enter at least 2 options');
      return;
    }
    
    if (!correctAnswer || !validOptions.includes(correctAnswer)) {
      alert('Please select a valid correct answer');
      return;
    }
    
    // Submit poll data
    onSubmit({
      question,
      options: validOptions,
      timeLimit,
      correctAnswer
    });
    
    // Reset form
    // setQuestion('');
    // setOptions(['', '', '', '']);
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  return (
    <div className="poll-form-container">
      <h2>Create New Poll</h2>
      
      <form onSubmit={handleSubmit} className="poll-form">
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here"
            required
          />
        </div>
          <div className="form-group">
          <label>Options:</label>          <div className="options-container">
            {options.map((option, index) => (
              <div className="option-row" key={index}>
                <div className="option-number">{index + 1}</div>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="option-input"
                />
                <div 
                  className={`correct-answer-toggle ${option === correctAnswer ? 'selected' : ''}`}
                  onClick={() => option.trim() && setCorrectAnswer(option)}
                  title="Set as correct answer"
                >
                  {option === correctAnswer ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
          <div className="form-group">
          <label htmlFor="timeLimit">Time Limit:</label>
          <div className="time-limit-selector">
            <select
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
            >
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
              <option value="90">90 seconds</option>
              <option value="120">2 minutes</option>
              <option value="300">5 minutes</option>
            </select>
          </div>
        </div>
        
        <button type="submit" className="create-poll-btn">Create Poll</button>
      </form>
    </div>
  );
};

export default PollForm;
