import { combineReducers } from 'redux';
import userReducer from './slices/user';
import conversationReducer from './slices/conversation';

const rootReducer = combineReducers({
  user: userReducer,
  conversation: conversationReducer,
});

export default rootReducer;
