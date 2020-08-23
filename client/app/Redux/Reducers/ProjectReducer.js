import { ActionList } from "Redux/ActionList"
import { ProjectManagerFmtp } from "App/ProjectManager";

const initState = {
  prms: {},
  list: [],
  draggingTodo: null,
}


const createProjectManager = () => {
  const prm = new ProjectManagerFmtp()
  prm.ascOrder = false
  return prm
}

const reducerGetProjectList = (state, action) => {
  const {data} = action.payload;
  const prms = {}
  const projectList = data.map(project => {
    const prm = createProjectManager()
    prms[project.alias] = prm
    return ({
      ...project,
      prm,
    })
  })

  return ({
    ...state,
    list: [...projectList],
    prms,
  })
}


const reducerAddProject = (state, action) => {
  const {data} = action.payload;
  const prm = createProjectManager()
  const project = {
    ...data,
    prm,
  }
  return ({
    ...state,
    prms: {
      ...state.prm,
      [data.alias]: prm
    },
    list: [...state.list, project],
  })
}


const reducerDeleteProject = (state, action) => {
  const {data} = action.payload;
  delete state.prms[data.alias]

  const projectList = state.list.filter(project => (
    project.alias != data.alias
  ))

  return ({
    ...state,
    prms: {...state.prms},
    list: [...projectList],
  })
}


const reducerUpdateProject = (state, action) => {
  const {data} = action.payload;
  const projectIndex = state.list.findIndex(project => (
    project.alias == data.alias
  ))
  state.list[projectIndex] = {
    ...state.list[projectIndex],
    ...data
  }

  return ({
    ...state,
    list: [...state.list],
  })
}


const reducerGetTodos = (state, action) => {
  const {data, project} = action.payload;
  const {prms, list} = state;
  const prm = createProjectManager()
  const projectIndex = list.findIndex(oldProject => (
    oldProject.alias == project.alias
  ))

  list[projectIndex] = {
    ...project,
    prm,
  }

  data.forEach(todo => {
    prm.addTodo(todo)
  })

  return ({
    ...state,
    prms: {
      ...prms,
      [project.alias]: prm,
    },
    list: [...list],
  })
}


const reducerAddTodo = (state, action) => {
  const {data} = action.payload;
  const prm = state.prms[data.project]
  prm.addTodo(data);
  return ({
    ...state,
    list: [...state.list],
  })
}



const reducerDeleteTodo = (state, action) => {
  const {data} = action.payload;
  const prm = state.prms[data.project];
  prm.deleteTodo(data);

  return ({
    ...state,
    list: [...state.list],
  })
}



const reducerUpdateTodo = (state, action) => {
  const {data} = action.payload;
  const prm = state.prms[data.project];
  prm.updateTodo(data);

  return ({
    ...state,
    list: [...state.list],
  })
}


const reducerDraggingTodo = (state, action) => {
  return ({
    ...state,
    draggingTodo: action.payload.data
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

    case ActionList.draggingTodo:
      return reducerDraggingTodo(state, action);

    case ActionList.moveTodo:
      return reducerUpdateTodo(state, action);

    default:
      return state
  }
}
