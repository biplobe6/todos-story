import { sortByPosition } from './position';

export class MetaProjectManager {
  constructor() {
    this.todos = []
    this.todosHash = {}
    this.updatedAt = (new Date()).getTime()
    this.progress = 0
  }

  updateProgress(todos, container){}

  updateRootProgress(){}

  updateParentProgress(alias){}

  addToProgress(todo){}

  sort(todos){}

  sortAll(){}
}

export class AbstractProjectManager extends MetaProjectManager {
  sortAll(){
    const updateData = (todos) => {
      this.sort(todos)
      todos.forEach(todo => {
        todo.updatedAt = this.updatedAt
        updateData(todo.subTask)
      });
    }
    this.updatedAt = (new Date()).getTime()
    updateData(this.todos)
  }

  setUpdatedAt({alias}={}, newData){
    const data = newData || {
      updatedAt: (new Date()).getTime()
    }

    const todo = this.todosHash[alias]
    if(todo){
      Object.assign(todo, data)
      const parentTodo = this.todosHash[todo.parent]
      if(parentTodo && parentTodo.alias){
        this.setUpdatedAt(parentTodo, data)
      } else {
        this.updatedAt = data.updatedAt
      }
    } else {
      this.updatedAt = data.updatedAt
    }
  }

  getTodo({alias}){
    return this.todosHash[alias]
  }

  addTodo(todoData){
    const todo = Object.assign({}, todoData)
    const hashedTodo = this.todosHash[todo.alias]

    if(hashedTodo){
      Object.assign(todo, hashedTodo)
    } else {
      this.todosHash[todo.alias] = todo
    }

    if(!todo.subTask){
      todo.subTask = []
    }

    if(!todo.parent){
      this.todos.push(todo)
      this.sort(this.todos)
    } else {
      let parentTodo = this.todosHash[todo.parent]
      if(!parentTodo){
        parentTodo = {
          subTask: []
        }
        this.todosHash[todo.parent] = parentTodo
      }
      parentTodo.subTask.push(todo)
      this.sort(parentTodo.subTask)
    }
    this.addToProgress(todo)
    this.setUpdatedAt(todo)
  }

  deleteTodo({alias}){
    const todo = this.todosHash[alias]
    let todoIndex
    if(todo.parent){
      const parentTodo = this.todosHash[todo.parent]
      todoIndex = parentTodo.subTask.findIndex(currentTodo => (
        currentTodo.alias == alias
      ))
      parentTodo.subTask.splice(todoIndex, 1)
      this.updateParentProgress(todo.parent)
      this.setUpdatedAt({alias: todo.parent})
    } else {
      todoIndex = this.todos.findIndex(currentTodo => (
        currentTodo.alias == alias
      ))
      this.todos.splice(todoIndex, 1)
      this.updateRootProgress()
      this.setUpdatedAt()
    }
    delete this.todosHash[alias]
  }


  updateTodo(todoData){
    const oldTodo = this.todosHash[todoData.alias]
    const todo = Object.assign({}, oldTodo, todoData)

    this.deleteTodo({alias: todo.alias})
    this.addTodo(todo)
  }
}

export const MixinTimerProgress = (ProjectManager=AbstractProjectManager) => class extends ProjectManager {
  updateProgress(todos, container){
    container.progress = 0
    let totalWeight = 0
    todos.forEach(({duration}) => {
      totalWeight += duration
    });
    todos.forEach(({progress, duration}) => {
      container.progress += (duration / totalWeight) * progress
    })
  }

  updateRootProgress(){
    this.updateProgress(
      this.todos,
      this
    )
  }

  updateParentProgress(alias){
    const todo = this.todosHash[alias]
    this.updateProgress(
      todo.subTask,
      todo
    )
    if(todo.parent){
      this.updateParentProgress(todo.parent)
    } else {
      this.updateRootProgress()
    }
  }

  addDefaultProgressHigh(todo){
    todo.progress = 100
  }

  addToProgress(todo){
    if(todo.done){
      this.addDefaultProgressHigh(todo)
    } else {
      this.updateProgress(
        todo.subTask,
        todo
      )
    }
    if(todo.parent){
      this.updateParentProgress(todo.parent)
    } else {
      this.updateRootProgress()
    }
  }
}


export const MixinFmtTimerProgress = (ProjectManager=AbstractProjectManager) => {
  return class extends MixinTimerProgress(ProjectManager) {
    updateProgress(todos, container){
      container._progress = 0
      let totalWeight = 0
      todos.forEach(({duration}) => {
        totalWeight += duration
      });
      todos.forEach(({_progress, duration}) => {
        container._progress += (duration / totalWeight) * _progress
      })
      container.progress = parseInt(container._progress * 10) / 10
    }

    addDefaultProgressHigh(todo){
      todo.progress = 100
      todo._progress = 100
    }
  }
}

export const MixinSorting = (ProjectManager=AbstractProjectManager) => class extends ProjectManager {
  constructor(props) {
    super(props);
    this.ascOrder = true
  }

  sort(todos){
    sortByPosition(todos, this.ascOrder)
  }
}

export class ProjectManager extends (
  MixinSorting(
    MixinTimerProgress(
      AbstractProjectManager
    )
  )
) {}


export class ProjectManagerFmtp extends (
  MixinSorting(
    MixinFmtTimerProgress(
      AbstractProjectManager
    )
  )
) {}


export default ProjectManager
