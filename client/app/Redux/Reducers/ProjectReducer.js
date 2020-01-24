import { ActionList } from "Redux/ActionList"
import ProjectManager from "App/ProjectManager";

const initState = {
  prm: new ProjectManager(),
  list: [],
}

const reducerGetProjectList = (state, action) => {
  const {data} = action.payload;
  const {prm} = state;
  prm.addProjectList(data);

  return ({
    ...state,
    list: [...prm.list],
  })
}


const reducerAddProject = (state, action) => {
  const {data} = action.payload;
  const {prm} = state;
  prm.addProject(data);
  return ({
    ...state,
    list: [...prm.list],
  })
}


const reducerDeleteProject = (state, action) => {
  const {data} = action.payload;
  const {prm} = state;

  prm.deleteProject(data)
  return ({
    ...state,
    list: [...prm.list],
  })
}


const reducerUpdateProject = (state, action) => {
  const {data} = action.payload;
  const {prm} = state;

  prm.updateProject(data)
  return ({
    ...state,
    list: [...prm.list],
  })
}


const reducerGetTodos = (state, action) => {
  const {data} = action.payload;
  const {prm} = state;

  data.forEach(todo => {
    if(prm.todosHash[todo.id]){
      prm.updateTodo(todo)
    } else {
      prm.addTodo(todo)
    }
  })

  return ({
    ...state,
    list: [...prm.list],
  })
}


const reducerAddTodo = (state, action) => {
  const {data} = action.payload;
  const {prm} = state;

  prm.addTodo(data);
  return ({
    ...state,
    list: [...prm.list],
  })
}



const reducerDeleteTodo = (state, action) => {
  const {data} = action.payload;
  const {prm} = state;
  prm.deleteTodo(data);

  return ({
    ...state,
    list: [...prm.list],
  })
}



const reducerUpdateTodo = (state, action) => {
  const {data} = action.payload;
  const {prm} = state;
  prm.updateTodo(data);

  return ({
    ...state,
    list: [...prm.list],
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

    case ActionList.getTodos:
      return reducerGetTodos(state, action);

    case ActionList.addTodo:
      return reducerAddTodo(state, action);

    case ActionList.deleteTodo:
      return reducerDeleteTodo(state, action);

    case ActionList.updateTodo:
      return reducerUpdateTodo(state, action);

    default:
      return state
  }
}
