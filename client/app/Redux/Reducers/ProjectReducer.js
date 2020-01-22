import { ActionList } from "Redux/ActionList"

const initState = {
  list: [],
  hash: {},
  idList: [],
  todosHash: {},
}

const reducerGetProjectList = (state, action) => {
  const {data} = action.payload;
  const newState = {
    list: [...data],
    hash: {},
    idList: [],
    todosHash: {},
  }

  newState.list.forEach(project => {
    project.todoList = [];
    newState.hash[project.id] = project;
    newState.idList.push(project.id);
  })

  return newState
}


const reducerAddProject = (state, action) => {
  const {data} = action.payload;
  data.todoList = []
  return ({
    ...state,
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
    ...state,
    list: [...state.list],
    idList: [...state.idList],
    hash: {
      ...state.hash
    },
  })
}


const reducerUpdateProject = (state, action) => {
  const {data} = action.payload;
  data.todoList = [];
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


const updateTodoList = ({todoList, todosHash, todo}) => {
  const hashedTodo = todosHash[todo.id]
  if(hashedTodo){
    Object.assign(todo, hashedTodo)
  }
  todosHash[todo.id] = todo;

  if(!todo.subTask){
    todo.subTask = []
  }

  if(!todo.parent){
    todoList.push(todo)
  } else {
    let parentTodo = todosHash[todo.parent];
    if(!parentTodo){
      parentTodo = {
        subTask: [],
      }
      todosHash[todo.parent] = parentTodo;
    }
    parentTodo.subTask.push(todo);
  }
}



const findProjectById = (id, state) => {
  const projectIndex = state.idList.indexOf(id);
  return state.list[projectIndex];
}

const reducerGetTodos = (state, action) => {
  const {id: projectId} = action.payload.project;
  const project = findProjectById(projectId, state)
  const {data: todoList} = action.payload;

  const newTodoList = []
  const todosHash = {}

  project.todoList = newTodoList;

  todoList.forEach(todo => {
    updateTodoList({
      todo,
      todosHash,
      todoList: newTodoList,
    })
  })

  return ({
    ...state,
    todosHash,
    list: [...state.list],
  })
}


const reducerAddTodo = (state, action) => {
  const {data: addedTodo} = action.payload;
  const {project: projectId} = addedTodo;
  const project = findProjectById(projectId, state)

  if(!project.todoList){
    project.todoList = []
  }

  updateTodoList({
    todo: addedTodo,
    todoList: project.todoList,
    todosHash: state.todosHash,
  })

  return ({
    ...state,
    list: [...state.list],
  })
}



const reducerDeleteTodo = (state, action) => {
  const {data} = action.payload;
  const deletedTodo = state.todosHash[data.id]
  const {project: projectId} = deletedTodo;
  const project = findProjectById(projectId, state)
  let targetIndex;

  if(!deletedTodo.parent){
    targetIndex = project.todoList.findIndex(todo => (
      todo.id == deletedTodo.id
    ))

    project.todoList.splice(targetIndex, 1)
  } else {
    const parentTodo = state.todosHash[deletedTodo.parent]
    targetIndex = parentTodo.subTask.findIndex(todo => (
      todo.id == deletedTodo.id
    ))
    parentTodo.subTask.splice(targetIndex, 1);
  }
  delete state.todosHash[deletedTodo.id]

  return ({
    ...state,
    list: [...state.list],
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

    default:
      return state
  }
}
