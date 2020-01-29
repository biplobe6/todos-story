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



export const ActionOnDragTodo = (data) => (dispatch) => {
  dispatch({
    type: ActionList.draggingTodo,
    payload: {
      data,
    }
  })
}



const createNewPosition = ({referenceTodo, todoList=[], todoToMove, up=false, down=false}) => {
  let position = 0
  const todoIndex = todoList.findIndex(todo => (
    todo.id == referenceTodo.id
  ))

  const isSameParent = (referenceTodo.parent == todoToMove.parent) && (
    referenceTodo.project == todoToMove.project
  )
  const currentPosition = todoToMove.position
  const previousPosition = ((todoList[todoIndex - 1]) || {}).position
  const targetPosition = todoList[todoIndex].position
  const nextPosition = (todoList[todoIndex + 1] || {}).position

  if(down){
    if(currentPosition == nextPosition && isSameParent){
      return currentPosition
    }
    position = (
      targetPosition + (
        nextPosition != undefined ? nextPosition : (
          targetPosition + 1
        )
      )
    ) / 2
  } else if(up) {
    if(currentPosition == previousPosition && isSameParent){
      return currentPosition
    }
    position = (
      targetPosition + (
        previousPosition != undefined ? previousPosition : (
          targetPosition - 1
        )
      )
    ) / 2
  }


  return position;
}






export const ActionOnDropTodo = (data) => (dispatch) => {
  const {direction, referenceTodo, todoToMove} = data;
  const {prm} = store.getState()['project'];

  if(referenceTodo.project != todoToMove.project) return;


  const isSameParent = referenceTodo.parent == todoToMove.parent

  const previousPosition = todoToMove.position;

  const newPosition = createNewPosition({
    todoToMove,
    referenceTodo,
    up: direction == 'up',
    down: direction == 'down',
    todoList: (
      typeof referenceTodo.parent == 'number' ? (
        prm.getTodo({id: referenceTodo.parent}).subTask
      ) : prm.getProject({id: referenceTodo.project}).todoList
    ),
  })

  if(newPosition == previousPosition && isSameParent) return;


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
    (typeof referenceTodo.parent == 'number') && !isSameParent
  ) ? ({
    parent: referenceTodo.parent
  }) : ({})

  ApiHelper.todo.patch({
    id: todoToMove.id,
    position: newPosition,
    ...parentReference,
  }, {
    todoId: todoToMove.id
  }).then(onSuccess).catch(onError)

}


