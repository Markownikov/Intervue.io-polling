require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST"]
}));
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// Store polls and results
let activePoll = null;
let pollQueue = []; // Queue for upcoming polls
let pollResults = {};
let students = {};
let teachers = {}; // Add a teachers object to track teacher connections
let pollHistory = [];
let pollTimer = null;
const defaultPollTime = 60; // 60 seconds default

io.on('connection', (socket) => {
  console.log('New client connected');

  // Teacher registration
  socket.on('registerTeacher', (data) => {
    teachers[socket.id] = {
      name: data.name || 'Teacher',
      id: socket.id
    };
    console.log(`Teacher registered with ID: ${socket.id}`);
    
    // If there is poll history, send it to the newly connected teacher
    socket.emit('pollHistory', pollHistory);
  });

  // Student registration
  socket.on('registerStudent', (studentName) => {
    if (!students[socket.id]) {
      students[socket.id] = {
        name: studentName,
        id: socket.id
      };
      console.log(`Student registered: ${studentName}`);
      socket.emit('registrationSuccess', { name: studentName, id: socket.id });
      io.emit('updateStudentList', Object.values(students));

      // If there is an active poll, send it to the newly connected student
      if (activePoll) {
        socket.emit('newPoll', activePoll);
      }
    }
  });  // Teacher actions
  socket.on('createPoll', (pollData) => {
    const pollId = Date.now().toString();
    const newPoll = {
      ...pollData,
      id: pollId,
      createdAt: new Date(),
      timeLimit: pollData.timeLimit || defaultPollTime,
      correctAnswer: pollData.correctAnswer || null
    };
    
    console.log('New poll created:', newPoll);
    
    // If there's no active poll, start this one immediately
    if (!activePoll) {
      activePoll = newPoll;
      
      // Reset poll results
      pollResults = {};
      
      // Broadcast new poll to all connected clients
      io.emit('newPoll', activePoll);
      
      // Start timer for poll
      clearTimeout(pollTimer);
      pollTimer = setTimeout(() => {
        endPoll();
      }, activePoll.timeLimit * 1000);
    } 
    // Otherwise, add to queue
    else {
      pollQueue.push(newPoll);
      console.log(`Poll added to queue. Queue size: ${pollQueue.length}`);
      
      // Send updated poll queue to teachers
      Object.keys(teachers).forEach(teacherId => {
        const teacherSocket = io.sockets.sockets.get(teacherId);
        if (teacherSocket) {
          teacherSocket.emit('pollQueueUpdated', pollQueue);
        }
      });
    }
    
    // Send confirmation to teacher
    socket.emit('pollCreated', { 
      pollId: newPoll.id, 
      queued: !!activePoll && activePoll.id !== newPoll.id
    });
  });  // Student submits answer
  socket.on('submitAnswer', (data) => {
    if (activePoll && students[socket.id]) {
      // Check if the answer is correct
      const isCorrect = activePoll.correctAnswer === data.answer;
      
      pollResults[socket.id] = {
        studentId: socket.id,
        studentName: students[socket.id].name,
        answer: data.answer,
        questionId: activePoll.id,
        isCorrect: isCorrect
      };
      
      console.log(`Answer received from ${students[socket.id].name}: ${data.answer} (${isCorrect ? 'correct' : 'incorrect'})`);
      
      // Send individual feedback to the student
      socket.emit('answerFeedback', { 
        isCorrect, 
        correctAnswer: activePoll.correctAnswer,
        questionId: activePoll.id
      });
      
      // Send updated results to everyone
      io.emit('pollResults', formatPollResults());
    }
  });

  // Kick student
  socket.on('kickStudent', (studentId) => {
    if (students[studentId]) {
      const studentSocket = io.sockets.sockets.get(studentId);
      if (studentSocket) {
        studentSocket.emit('kicked');
        studentSocket.disconnect(true);
      }
      delete students[studentId];
      io.emit('updateStudentList', Object.values(students));
    }
  });  // Chat message
  socket.on('chatMessage', (message) => {
    // Check if message is from a student
    if (students[socket.id]) {
      io.emit('newChatMessage', {
        sender: students[socket.id].name,
        message: message.text,
        timestamp: new Date()
      });
    } 
    // Check if message is from a teacher
    else if (teachers[socket.id] && message.text) {
      io.emit('newChatMessage', {
        sender: teachers[socket.id].name,
        message: message.text,
        timestamp: new Date()
      });
    }
    // Handle messages from unknown sources with valid text
    else if (message.text) {
      io.emit('newChatMessage', {
        sender: 'User',
        message: message.text,
        timestamp: new Date()
      });
    }
  });

  // Request poll history
  socket.on('getPollHistory', () => {
    socket.emit('pollHistory', pollHistory);
  });
  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (students[socket.id]) {
      delete students[socket.id];
      io.emit('updateStudentList', Object.values(students));
    }
    if (teachers[socket.id]) {
      delete teachers[socket.id];
    }
  });
});

// Helper functions
function allStudentsAnswered() {
  if (!activePoll || Object.keys(students).length === 0) {
    return true;
  }

  // Check if at least one student has answered instead of requiring all students
  const answeredStudents = Object.keys(pollResults).length;
  return answeredStudents > 0; // Allow poll to end if at least one student has answered
}

function endPoll() {
  if (activePoll) {
    const results = formatPollResults();
    
    // Save to poll history
    pollHistory.push({
      ...activePoll,
      results: results
    });
    
    // Broadcast final results
    io.emit('pollEnded', { poll: activePoll, results: results });
    
    // Clear active poll
    activePoll = null;
    
    // Start next poll if there's one in the queue
    if (pollQueue.length > 0) {
      activePoll = pollQueue.shift();
      pollResults = {};
      
      // Broadcast the next poll
      io.emit('newPoll', activePoll);
      
      // Start timer for the next poll
      clearTimeout(pollTimer);
      pollTimer = setTimeout(() => {
        endPoll();
      }, activePoll.timeLimit * 1000);
      
      // Send updated queue to teachers
      Object.keys(teachers).forEach(teacherId => {
        const teacherSocket = io.sockets.sockets.get(teacherId);
        if (teacherSocket) {
          teacherSocket.emit('pollQueueUpdated', pollQueue);
        }
      });
    }
  }
}

function formatPollResults() {
  if (!activePoll) return {};

  // Initialize result counters for each option
  const resultCounts = {};
  const correctCounts = {};
  activePoll.options.forEach(option => {
    resultCounts[option] = 0;
    correctCounts[option] = 0;
  });
  
  // Count results
  Object.values(pollResults).forEach(result => {
    if (resultCounts[result.answer] !== undefined) {
      resultCounts[result.answer]++;
      
      // Count correct answers
      if (result.isCorrect) {
        correctCounts[result.answer]++;
      }
    }
  });
  
  // Calculate percentages
  const totalAnswers = Object.values(pollResults).length;
  const formattedResults = {};
  
  Object.keys(resultCounts).forEach(option => {
    const count = resultCounts[option];
    const percentage = totalAnswers === 0 ? 0 : Math.round((count / totalAnswers) * 100);
    const isCorrect = option === activePoll.correctAnswer;
    formattedResults[option] = { 
      count, 
      percentage, 
      isCorrect
    };
  });
  
  // Add detailed results for teacher view
  formattedResults.details = {
    totalAnswers,
    correctAnswer: activePoll.correctAnswer,
    individualResults: Object.values(pollResults)
  };
  
  return formattedResults;
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
