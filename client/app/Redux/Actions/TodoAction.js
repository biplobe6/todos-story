import ApiHelper from "App/Utils/ApiHelper"
import { ActionList } from "Redux/ActionList"
import store from 'Root/store';
import { createNewPosition, isSameParent, SamePositionException } from "App/ProjectManager/position/createNew";



const getPosition = ({project, parent}) => {
  const state = store.getState()['project']
  const {prm} = state;


  const todoList = parent ? (
    prm.getTodo({alias: parent}).subTask
  ) : (
    prm.getProject({alias: project}).todoList
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
    project: project.alias,
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
    alias: payload.alias,
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
    alias: data.alias
  }).then(onSuccess).catch(onError)
}



export const ActionOnDragTodo = (data) => (dispatch) => {
  dispatch({
    type: ActionList.draggingTodo,
    payload: {
      data,
    }
  })
}




export const ActionOnDropTodo = (data) => (dispatch) => {
  const {direction, referenceTodo, todoToMove} = data;
  const {prm} = store.getState()['project'];

  if(referenceTodo.project != todoToMove.project) return;


  let newPosition;
  const sameParent = isSameParent(data);

  try {
    newPosition = createNewPosition({
      direction,
      todoToMove,
      referenceTodo,
      targetTodoList: (
        referenceTodo.parent ? (
          prm.getTodo({alias: referenceTodo.parent}).subTask
        ) : prm.getProject({alias: referenceTodo.project}).todoList
      ),
    })
  } catch (error) {
    if(error instanceof SamePositionException){
      return;
    } else {
      throw error
    }
  }


  const onSuccess = (response) => {
    dispatch({
      type: ActionList.moveTodo,
      payload: {
        data: response.getData(),
      }
    })
  }

  const onError = (error) => {
    console.error(error)
  }

  const parentReference = (
    !sameParent
  ) ? ({
    parent: referenceTodo.parent ? (
      referenceTodo.parent
    ) : null
  }) : ({})

  ApiHelper.todo.patch({
    alias: todoToMove.alias,
    position: newPosition,
    ...parentReference,
  }, {
    alias: todoToMove.alias
  }).then(onSuccess).catch(onError)
}


export const ActionToggleTodoStatus = (data) => (dispatch) => {
  const onSuccess = (response) => {
    dispatch({
      type: ActionList.updateTodo,
      payload: {
        data: response.getData()
      }
    })
  }
  const onError = (error) => {
    console.error(error)
  }

  ApiHelper.todo.patch(
    data, {alias: data.alias}
  ).then(onSuccess).catch(onError)
}

