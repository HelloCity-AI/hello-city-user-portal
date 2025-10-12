import { all } from 'redux-saga/effects';
import userSaga from './sagas/userSaga';
import conversationSaga from './sagas/conversationSaga';
import checklistSaga from './sagas/checklistSaga';

export default function* rootSaga() {
  yield all([userSaga(), conversationSaga(), checklistSaga()]);
}
