import { combineReducers } from 'redux';

import { TodoReducer } from './TodoReducer';
import { ModalReducer } from './ModalReducer';


export const RootReducer = combineReducers({
  todo: TodoReducer,
  modals: ModalReducer,
})

export default RootReducer
