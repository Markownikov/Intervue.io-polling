// Poll action types
export const SET_ACTIVE_POLL = 'SET_ACTIVE_POLL';
export const SET_POLL_RESULTS = 'SET_POLL_RESULTS';
export const POLL_ENDED = 'POLL_ENDED';
export const SET_POLL_HISTORY = 'SET_POLL_HISTORY';
export const SET_POLL_QUEUE = 'SET_POLL_QUEUE';
export const SET_ANSWER_FEEDBACK = 'SET_ANSWER_FEEDBACK';

// Poll actions
export const setActivePoll = (poll) => ({
  type: SET_ACTIVE_POLL,
  payload: poll
});

export const setPollResults = (results) => ({
  type: SET_POLL_RESULTS,
  payload: results
});

export const pollEnded = (data) => ({
  type: POLL_ENDED,
  payload: data
});

export const setPollHistory = (history) => ({
  type: SET_POLL_HISTORY,
  payload: history
});

export const setPollQueue = (queue) => ({
  type: SET_POLL_QUEUE,
  payload: queue
});

export const setAnswerFeedback = (feedback) => ({
  type: SET_ANSWER_FEEDBACK,
  payload: feedback
});

// Thunk actions for interaction with socket
export const createPoll = (pollData) => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (socket) {
    socket.emit('createPoll', pollData);
  }
};

export const submitAnswer = (answer) => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (socket) {
    socket.emit('submitAnswer', { answer });
  }
};

export const fetchPollHistory = () => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (socket) {
    socket.emit('getPollHistory');
  }
};
