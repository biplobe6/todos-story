import { combineReducers } from 'redux';

import { ProjectReducer } from './ProjectReducer';
import { TodoReducer } from './TodoReducer';
import { ModalReducer } from './ModalReducer';


export const RootReducer = combineReducers({
  project: ProjectReducer,
  todo: TodoReducer,
  modals: ModalReducer,
})

export default RootReducer
