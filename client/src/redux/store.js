import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Reducers
import socketReducer from './reducers/socketReducer';
import pollReducer from './reducers/pollReducer';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
  socket: socketReducer,
  polls: pollReducer,
  user: userReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
