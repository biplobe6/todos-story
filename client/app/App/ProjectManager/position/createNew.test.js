import { createNewPosition, DIRECTION, SamePositionException } from './createNew';
const {expect} = global;



describe('createNewPosition()', () => {
  it('Should not be undefined', () => {
    const todoList = [{
      alias: 1,
      position: 1,
      project: 1
    }, {
      alias: 2,
      position: 2,
      project: 1
    }]
    expect(createNewPosition({
      todoToMove: todoList[0],
      referenceTodo: todoList[1],
      targetTodoList: todoList,
      direction: DIRECTION.DOWN,
    })).not.toBeUndefined()
  })


  it('Should return (currentValue + 2) in 1 step down direction', () => {
    const todoList = [{
      alias: 1,
      position: 1,
      project: 1
    }, {
      alias: 2,
      position: 2,
      project: 1
    }]
    const position = createNewPosition({
      todoToMove: todoList[0],
      referenceTodo: todoList[1],
      targetTodoList: todoList,
      direction: DIRECTION.DOWN,
    })

    expect(position).toBe(3)
  })


  it('Should return middle value in down direction', () => {
    const todoList = [{
      alias: 1,
      position: 1,
      project: 1
    }, {
      alias: 2,
      position: 2,
      project: 1
    }, {
      alias: 3,
      position: 3,
      project: 1
    }]
    const position = createNewPosition({
      todoToMove: todoList[0],
      referenceTodo: todoList[1],
      targetTodoList: todoList,
      direction: DIRECTION.DOWN,
    })

    expect(position).toBe(2.5)
  })


  it('Should return top value in up direction', () => {
    const todoList = [{
      alias: 1,
      position: 1,
      project: 1
    }, {
      alias: 2,
      position: 2,
      project: 1
    }, {
      alias: 3,
      position: 3,
      project: 1
    }]
    const position = createNewPosition({
      todoToMove: todoList[2],
      referenceTodo: todoList[0],
      targetTodoList: todoList,
      direction: DIRECTION.UP,
    })

    expect(position).toBe(0.5)
  })


  it('Should return middle value in up direction', () => {
    const todoList = [{
      alias: 1,
      position: 1,
      project: 1
    }, {
      alias: 2,
      position: 2,
      project: 1
    }, {
      alias: 3,
      position: 3,
      project: 1
    }]
    const position = createNewPosition({
      todoToMove: todoList[2],
      referenceTodo: todoList[1],
      targetTodoList: todoList,
      direction: DIRECTION.UP,
    })

    expect(position).toBe(1.5)
  })


  it('Should throw error in up direction', () => {
    const todoList = [{
      alias: 1,
      position: 1,
      project: 1
    }, {
      alias: 2,
      position: 2,
      project: 1
    }, {
      alias: 3,
      position: 3,
      project: 1
    }]

    expect(() => {
      createNewPosition({
        todoToMove: todoList[0],
        referenceTodo: todoList[1],
        targetTodoList: todoList,
        direction: DIRECTION.UP,
      })
    }).toThrowError(SamePositionException)

    expect(() => {
      createNewPosition({
        todoToMove: todoList[1],
        referenceTodo: todoList[2],
        targetTodoList: todoList,
        direction: DIRECTION.UP,
      })
    }).toThrowError(SamePositionException)
  })


  it('Should throw error in down direction', () => {
    const todoList = [{
      alias: 1,
      position: 1,
      project: 1
    }, {
      alias: 2,
      position: 2,
      project: 1
    }, {
      alias: 3,
      position: 3,
      project: 1
    }]

    expect(() => {
      createNewPosition({
        todoToMove: todoList[2],
        referenceTodo: todoList[1],
        targetTodoList: todoList,
        direction: DIRECTION.DOWN,
      })
    }).toThrowError(SamePositionException)

    expect(() => {
      createNewPosition({
        todoToMove: todoList[1],
        referenceTodo: todoList[0],
        targetTodoList: todoList,
        direction: DIRECTION.DOWN,
      })
    }).toThrowError(SamePositionException)
  })
})


