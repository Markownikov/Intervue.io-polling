import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './PollQuestion.css';

const PollQuestion = ({ question, options, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const { answerFeedback } = useSelector(state => state.polls);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption) {
      onAnswer(selectedOption);
    }
  };    return (
    <div className="poll-question">
      <h3 className="question-text">"{question}"</h3>
      
      {answerFeedback ? (
        <div className={`feedback-container ${answerFeedback.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-icon">
            {answerFeedback.isCorrect ? '✓' : '✗'}
          </div>
          <div className="feedback-text">
            {answerFeedback.isCorrect 
              ? 'Correct Answer!' 
              : `Incorrect. The correct answer is: ${answerFeedback.correctAnswer}`
            }
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="options">
            {options.map((option, index) => (
              <div 
                key={index} 
                className={`option-item ${selectedOption === option ? 'selected' : ''}`}
                onClick={() => setSelectedOption(option)}
              >
                <div className="option-indicator">
                  {index + 1}
                </div>
                <div className="option-text">{option}</div>
              </div>
            ))}
          </div>
          
          <div className="submit-container">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!selectedOption}
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PollQuestion;
