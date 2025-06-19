import { 
  SET_ACTIVE_POLL, 
  SET_POLL_RESULTS, 
  POLL_ENDED, 
  SET_POLL_HISTORY, 
  SET_POLL_QUEUE,
  SET_ANSWER_FEEDBACK
} from '../actions/pollActions';

const initialState = {
  activePoll: null,
  pollResults: {},
  pollHistory: [],
  pollQueue: [],
  answerFeedback: null
};

const pollReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_POLL:
      return {
        ...state,
        activePoll: action.payload
      };
    case SET_POLL_RESULTS:
      return {
        ...state,
        pollResults: action.payload
      };
    case POLL_ENDED:
      return {
        ...state,
        activePoll: null,
        pollResults: action.payload.results
      };    case SET_POLL_HISTORY:
      return {
        ...state,
        pollHistory: action.payload
      };
    case SET_POLL_QUEUE:
      return {
        ...state,
        pollQueue: action.payload
      };
    case SET_ANSWER_FEEDBACK:
      return {
        ...state,
        answerFeedback: action.payload
      };
    default:
      return state;
  }
};

export default pollReducer;
