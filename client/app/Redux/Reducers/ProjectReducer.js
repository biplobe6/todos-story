import { ActionList } from "Redux/ActionList"

const initState = {
  list: [],
  hash: {},
  idList: [],
}

const reducerGetProjectList = (state, action) => {
  const {data} = action.payload;
  const newState = {
    list: [...data],
    hash: {},
    idList: [],
  }

  newState.list.forEach(todo => {
    newState.hash[todo.id] = todo;
    newState.idList.push(todo.id);
  })

  return newState
}


const reducerAddProject = (state, action) => {
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


const reducerDeleteProject = (state, action) => {
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


const reducerUpdateProject = (state, action) => {
  const {data} = action.payload;
  const dataIndex = state.idList.indexOf(data.id)

  state.list[dataIndex] = data;

  return ({
    ...state,
    list: [...state.list],
    hash: {
      ...state.hash,
      [data.id]: data,
    },
  })
}


export const ProjectReducer = (state=initState, action) => {
  switch (action.type) {
    case ActionList.getProjectList:
      return reducerGetProjectList(state, action);

    case ActionList.addProject:
      return reducerAddProject(state, action);

    case ActionList.updateProject:
      return reducerUpdateProject(state, action);

    case ActionList.deleteProject:
      return reducerDeleteProject(state, action);

    default:
      return state
  }
}
