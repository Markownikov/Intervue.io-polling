// User action types
export const SET_USER_TYPE = 'SET_USER_TYPE';
export const SET_USER_DATA = 'SET_USER_DATA';
export const REGISTER_STUDENT = 'REGISTER_STUDENT';
export const SET_STUDENT_LIST = 'SET_STUDENT_LIST';

// User types
export const USER_TYPES = {
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT'
};

// User actions
export const setUserType = (userType) => ({
  type: SET_USER_TYPE,
  payload: userType
});

export const setUserData = (userData) => ({
  type: SET_USER_DATA,
  payload: userData
});

export const setStudentList = (students) => ({
  type: SET_STUDENT_LIST,
  payload: students
});

// Thunk actions for interaction with socket
export const registerStudent = (name) => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (socket) {
    socket.emit('registerStudent', name);
  }
};

export const kickStudent = (studentId) => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (socket) {
    socket.emit('kickStudent', studentId);
  }
};

export const sendChatMessage = (text) => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (socket) {
    socket.emit('chatMessage', { text });
  }
};
