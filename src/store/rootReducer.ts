import { combineReducers } from 'redux';
import userReducer from './slices/user';
import conversationReducer from './slices/conversation';
import checklistReducer from './slices/checklist';

const rootReducer = combineReducers({
  user: userReducer,
  conversation: conversationReducer,
  checklist: checklistReducer,
});

export default rootReducer;
