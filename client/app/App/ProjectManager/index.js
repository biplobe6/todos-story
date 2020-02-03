import { sortByPosition } from './position';


export class ProjectManager {
  constructor() {
    this.list = [];
    this.todosHash = {};
    this.projectsHash = {};
  }

  getProject({alias}){
    return this.projectsHash[alias]
  }

  getTodo({alias}){
    return this.todosHash[alias]
  }

  updateProject(projectData){
    const project = Object.assign({}, projectData)
    const oldProject = this.getProject(project)
    Object.assign(oldProject, project)
    this.projectsHash[oldProject.alias] = oldProject;
    this.updateEntry(oldProject)
  }

  addProject(projectData){
    const project = Object.assign({}, projectData)
    project.todoList = []
    project.progress = 0;
    this.projectsHash[project.alias] = project;
    this.list.push(project)
    this.updateEntry(project)
  }

  addProjectList(projectList=[]){
    projectList.forEach(project => {
      this.addProject(project)
    })
  }

  deleteProject({alias}){
    const projectIndex = this.list.findIndex(project => (
      project.alias == alias
    ))
    this.list.splice(projectIndex, 1)
    delete this.projectsHash[alias]
  }

  updateEntry(entryData){
    const entry = entryData.project ? (
      this.todosHash[entryData.alias]
    ) : this.projectsHash[entryData.alias]
    const date = new Date().getTime()
    const newData = {
      updatedAt: date,
      key: `${entry.alias}-${date}`
    }

    const updateObject = (obj) => {
      if(obj.parent){
        updateObject(
          this.todosHash[obj.parent]
        )
      } else if(obj.project){
        updateObject(
          this.projectsHash[obj.project]
        )
      }
      if(obj.todoList){
        obj.todoList = [...obj.todoList]
        sortByPosition(obj.todoList)
      }
      if(obj.subTask){
        obj.subTask = [...obj.subTask]
        sortByPosition(obj.subTask)
      }
      Object.assign(obj, newData)
    }
    updateObject(entry)
    return newData
  }

  updateTodoProgress(todo){
    if(typeof todo.progress == 'number'){
      if(todo.done){
        todo.progress = 100
      } else {
        todo.progress = 0;
        const todoList = todo.subTask || todo.todoList
        const percentage = 100 / todoList.length
        todoList.forEach(subTask => {
          todo.progress += subTask.done ? percentage : (
            percentage * (subTask.progress / 100)
          )
        })
        todo.progress = Math.round(todo.progress)
      }
    } else {
      todo.progress = todo.done ? 100 : 0
    }
    if(todo.parent){
      const parentTodo = this.todosHash[todo.parent]
      this.updateTodoProgress(parentTodo)
    } else if(todo.project){
      const project = this.projectsHash[todo.project]
      const projectPercentage = 100 / project.todoList.length
      project.progress = 0;
      project.todoList.forEach(eachProject => {
        project.progress += projectPercentage * (eachProject.progress / 100)
      })
      project.progress = Math.round(project.progress)
    }
  }

  addTodo(todoData){
    const todo =Object.assign({}, todoData)
    const project = this.getProject({alias: todo.project})

    const hashedTodo = this.todosHash[todo.alias];
    if(hashedTodo){
      Object.assign(todo, hashedTodo)
    }
    this.todosHash[todo.alias] = todo;

    if(!todo.subTask){
      todo.subTask = []
    }

    if(!todo.parent){
      project.todoList.push(todo)
    } else {
      let parentTodo = this.todosHash[todo.parent]
      if(!parentTodo){
        parentTodo = {
          subTask: [],
        }
        this.todosHash[todo.parent] = parentTodo;
      }
      parentTodo.subTask.push(todo)
    }

    this.updateTodoProgress(todo)
    this.updateEntry(todo)
  }

  deleteTodo({alias}){
    const todo = this.todosHash[alias]
    let todoIndex;
    if(todo.parent) {
      const parentTodo = this.todosHash[todo.parent]
      todoIndex = parentTodo.subTask.findIndex(targetTodo => (
        targetTodo.alias == todo.alias
      ))
      parentTodo.subTask.splice(todoIndex, 1)
      this.updateTodoProgress(parentTodo)
      this.updateEntry(parentTodo)
    } else if(todo.project){
      const project = this.getProject({alias: todo.project})
      todoIndex = project.todoList.findIndex(targetTodo => (
        targetTodo.alias == todo.alias
      ))
      project.todoList.splice(todoIndex, 1)
      this.updateTodoProgress(project)
      this.updateEntry(project)
    }
    delete this.todosHash[todo.alias]
  }

  updateTodo(todo){
    let todoIndex
    const oldTodo = Object.assign({}, this.todosHash[todo.alias]);
    const newTodo = Object.assign({}, oldTodo, todo);

    const updatePosition = (
      oldTodo.parent != newTodo.parent
    ) || (
      oldTodo.project != newTodo.project
    )

    if(updatePosition){
      this.deleteTodo({alias: todo.alias})
      this.addTodo(newTodo)
    } else {
      if(oldTodo.parent){
        const parentTodo = this.todosHash[oldTodo.parent]
        todoIndex = parentTodo.subTask.findIndex(targetTodo => (
          targetTodo.alias == oldTodo.alias
        ))
        parentTodo.subTask[todoIndex] = newTodo
      } else {
        const project = this.projectsHash[oldTodo.project]
        todoIndex = project.todoList.findIndex(targetTodo => (
          targetTodo.alias == oldTodo.alias
        ))
        project.todoList[todoIndex] = newTodo
      }
      this.todosHash[todo.alias] = newTodo
      this.updateTodoProgress(newTodo)
      this.updateEntry(newTodo);
    }
  }
}



export default ProjectManager

