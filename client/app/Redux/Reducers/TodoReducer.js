import { ActionList } from "Redux/ActionList"

const initState = []

const reducerGetTodos = (state, action) => {
  const {data} = action.payload;
  return ([...data])
}


const reducerAddTodo = (state, action) => {
  return ([
    ...state,
    action.payload.data
  ])
}


export const TodoReducer = (state=initState, action) => {
  switch (action.type) {
    case ActionList.getTodos:
      return reducerGetTodos(state, action);

    case ActionList.addTodo:
      return reducerAddTodo(state, action);

    default:
      return state
  }
}
