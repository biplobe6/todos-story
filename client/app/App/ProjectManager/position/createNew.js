
export const DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  CHILD: 'child',
}

export class SamePositionException extends Error {
  constructor(position) {
    const name = 'SamePositionException';
    const message = `at index '${position}'`;

    super(message)
    this.position = position;
    this.name = name;
    this.message = message;
  }
}


export const isSameParent = ({todoToMove, referenceTodo, direction}) => (
  direction == DIRECTION.CHILD ? false : (
    todoToMove.parent == referenceTodo.parent
  )
)

const getReferenceTodoDetails = ({referenceTodo, todoToMove, targetTodoList}) => {
  const todoIndex = targetTodoList.findIndex(todo => (
    todo.alias == todoToMove.alias
  ))

  const refrenceTodoPosition = referenceTodo.position;
  const refrenceTodoIndex = targetTodoList.findIndex(todo => (
    todo.alias == referenceTodo.alias
  ))

  const previousTodoIndex = refrenceTodoIndex - 1
  const previousTodo = targetTodoList[previousTodoIndex]
  const previousTodoPosition = (
    previousTodo || {position: null}
  ).position

  const nextTodoIndex = refrenceTodoIndex + 1
  const nextTodo = targetTodoList[nextTodoIndex]
  const nextTodoPosition = (
    nextTodo || {position: null}
  ).position

  return ({
    nextTodo,
    nextTodoIndex,
    nextTodoPosition,

    todoIndex,

    refrenceTodoIndex,
    refrenceTodoPosition,

    previousTodo,
    previousTodoIndex,
    previousTodoPosition,
  })
}



const positionInUpDirection = (args) => {
  const {
    previousTodoPosition,
    todoIndex,
    previousTodoIndex,
    refrenceTodoPosition
  } = getReferenceTodoDetails(args);

  const sameParent = isSameParent(args)

  if(sameParent && todoIndex != -1){
    if(todoIndex == previousTodoIndex){
      throw new SamePositionException(todoIndex)
    }
  }

  return (previousTodoPosition == null) ? (
    refrenceTodoPosition / 2
  ) : (
    (refrenceTodoPosition + previousTodoPosition) / 2
  )
}

const positionInDownDirection = (args) => {
  const {
    nextTodoPosition,
    todoIndex,
    nextTodoIndex,
    refrenceTodoPosition,
  } = getReferenceTodoDetails(args);

  const sameParent = isSameParent(args);

  if(sameParent && todoIndex != -1){
    if(todoIndex == nextTodoIndex){
      throw new SamePositionException(todoIndex)
    }
  }

  return (nextTodoPosition == null) ? (
    refrenceTodoPosition + 1
  ) : (
    (refrenceTodoPosition + nextTodoPosition) / 2
  )
}

const positionAsChild = (args) => {
  return 1
}



const positionByDirection = {
  [DIRECTION.UP]: positionInUpDirection,
  [DIRECTION.DOWN]: positionInDownDirection,
  [DIRECTION.CHILD]: positionAsChild,
}




export const createNewPosition = (args) => {
  const {direction} = args;
  let position = null;

  position = positionByDirection[direction](args)

  return position
}



