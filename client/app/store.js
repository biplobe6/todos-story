
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import RootReducer from 'Redux/Reducers/RootReducer';


const getDevStore = () => createStore(
  RootReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

const getDefaultStore = () => createStore(
  RootReducer,
  applyMiddleware(thunk)
)

export const store = window.__REDUX_DEVTOOLS_EXTENSION__ ? getDevStore() : getDefaultStore()


export default store