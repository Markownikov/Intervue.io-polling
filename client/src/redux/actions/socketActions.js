// Socket action types
export const SET_SOCKET = 'SET_SOCKET';

// Socket actions
export const setSocket = (socket) => ({
  type: SET_SOCKET,
  payload: socket
});
