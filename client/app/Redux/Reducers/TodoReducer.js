import { ActionList } from "Redux/ActionList"

const initState = {
  list: [],
  hash: {},
  idList: [],
}


const reducerAddTodo = (state, action) => {
  const {data} = action.payload;
  return ({
    list: [...state.list, data],
    hash: {
      ...state.hash,
      [data.id]: data,
    },
    idList: [...state.idList, data.id]
  })
}


const reducerDeleteTodo = (state, action) => {
  const {id} = action.payload.data;
  const index = state.idList.indexOf(id);

  state.list.splice(index, 1);
  state.idList.splice(index, 1);
  delete state.hash[id];

  return ({
    list: [...state.list],
    idList: [...state.idList],
    hash: {
      ...state.hash
    },
  })
}


export const TodoReducer = (state=initState, action) => {
  switch (action.type) {

    case ActionList.addTodo:
      return reducerAddTodo(state, action);

    case ActionList.deleteTodo:
      return reducerDeleteTodo(state, action);

    default:
      return state
  }
}
