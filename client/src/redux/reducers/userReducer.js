import { SET_USER_TYPE, SET_USER_DATA, SET_STUDENT_LIST } from '../actions/userActions';

const initialState = {
  userType: null,
  userData: null,
  studentList: []
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_TYPE:
      return {
        ...state,
        userType: action.payload
      };
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload
      };
    case SET_STUDENT_LIST:
      return {
        ...state,
        studentList: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;
