import ApiHelper from "App/Utils/ApiHelper"
import { ActionList } from "Redux/ActionList"
import store from 'Root/store';



const getPosition = ({project, parent}) => {
  const state = store.getState()['project']
  const {prm} = state;


  const todoList = typeof parent == 'number' ? (
    prm.getTodo({id: parent}).subTask
  ) : (
    prm.getProject({id: project}).todoList
  )

  let position = 1;
  todoList.forEach(todo => {
    if(todo.position >= position){
      position = (todo.position + 1)
    }
  });

  return position
}


export const ActionGetTodos = (project) => (dispatch) => {
  const onSuccess = (response) => {
    dispatch({
      type: ActionList.getTodos,
      payload: {
        project,
        data: response.getData(),
      }
    })
  }

  const onError = (error) => {
    console.error(error)
  }

  ApiHelper.todos.get({
    project: project.id,
  }).then(onSuccess).catch(onError)
}

export const ActionAddTodo = (data) => (dispatch) => {
  const payload = {
    ...data.payload,
    position: getPosition(data.payload)
  }
  const onSuccess = (response) => {
    if(data.onSuccess){
      data.onSuccess(response)
    }
    dispatch({
      type: ActionList.addTodo,
      payload: {
        data: response.getData()
      }
    })
  }
  const onError = (error) => {
    console.error(error)
    if(data.onError){
      data.onError(error)
    }
  }

  ApiHelper.todos.post(
    payload
  ).then(onSuccess).catch(onError)
}


export const ActionEditTodo = (data) => (dispatch) => {
  const {payload} = data;

  const onSuccess = response => {
    dispatch({
      type: ActionList.updateTodo,
      payload: {
        data: response.getData()
      }
    })
    data.onSuccess(response)
  }

  const onError = (error) => {
    console.error(error)
  }

  ApiHelper.todo.patch(payload, {
    todoId: payload.id,
  }).then(onSuccess).catch(onError)
}


export const AcitonDeleteTodo = (data) => (dispatch) => {
  const onSuccess = (response) => {
    dispatch({
      type: ActionList.deleteTodo,
      payload: {
        data,
        response
      }
    })
  }

  const onError = (error) => {
    console.error(error)
  }

  ApiHelper.todo.delete({
    todoId: data.id
  }).then(onSuccess).catch(onError)
}


