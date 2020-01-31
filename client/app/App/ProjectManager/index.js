import { sortByPosition } from './position';


export class ProjectManager {
  constructor() {
    this.list = [];
    this.todosHash = {};
    this.projectsHash = {};
  }

  getProject({id}){
    return this.projectsHash[id]
  }

  getTodo({id}){
    return this.todosHash[id]
  }

  updateProject(projectData){
    const project = Object.assign({}, projectData)
    const oldProject = this.getProject(project)
    Object.assign(oldProject, project)
    this.projectsHash[oldProject.id] = oldProject;
    this.updateEntry(oldProject)
  }

  addProject(projectData){
    const project = Object.assign({}, projectData)
    project.todoList = []
    project.progress = 0;
    this.projectsHash[project.id] = project;
    this.list.push(project)
    this.updateEntry(project)
  }

  addProjectList(projectList=[]){
    projectList.forEach(project => {
      this.addProject(project)
    })
  }

  deleteProject({id}){
    const projectIndex = this.list.findIndex(project => (
      project.id == id
    ))
    this.list.splice(projectIndex, 1)
    delete this.projectsHash[id]
  }

  updateEntry(entryData){
    const entry = entryData.project ? (
      this.todosHash[entryData.id]
    ) : this.projectsHash[entryData.id]
    const date = new Date().getTime()
    const newData = {
      updatedAt: date,
      key: `${entry.id}-${date}`
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
        todo.progress = 0
        const percentage = 100 / todo.subTask.length
        todo.subTask.forEach(subTask => {
          todo.progress += subTask.done ? percentage : (
            percentage * (subTask.progress / 100)
          )
        })
        todo.progress = Math.round(todo.progress)
      }
    } else {
      todo.progress = todo.done ? 100 : 0
    }
    if(typeof todo.parent == 'number'){
      const parentTodo = this.todosHash[todo.parent]
      this.updateTodoProgress(parentTodo)
    } else if(typeof todo.project == 'number'){
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
    const project = this.getProject({id: todo.project})

    const hashedTodo = this.todosHash[todo.id];
    if(hashedTodo){
      Object.assign(todo, hashedTodo)
    }
    this.todosHash[todo.id] = todo;

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

  deleteTodo({id}){
    const todo = this.todosHash[id]
    let todoIndex;
    if(!todo.parent){
      const project = this.getProject({id: todo.project})
      todoIndex = project.todoList.findIndex(targetTodo => (
        targetTodo.id == todo.id
      ))
      project.todoList.splice(todoIndex, 1)
      this.updateEntry(project)
    } else {
      const parentTodo = this.todosHash[todo.parent]
      todoIndex = parentTodo.subTask.findIndex(targetTodo => (
        targetTodo.id == todo.id
      ))
      parentTodo.subTask.splice(todoIndex, 1)
      this.updateTodoProgress(parentTodo)
      this.updateEntry(parentTodo)
    }
    delete this.todosHash[todo.id]
  }

  updateTodo(todo){
    let todoIndex
    const oldTodo = Object.assign({}, this.todosHash[todo.id]);
    const newTodo = Object.assign({}, oldTodo, todo);

    const updatePosition = (
      oldTodo.parent != newTodo.parent
    ) || (
      oldTodo.project != newTodo.project
    )

    if(updatePosition){
      this.deleteTodo(oldTodo)
      this.addTodo(newTodo)
    } else {
      if(oldTodo.parent){
        const parentTodo = this.todosHash[oldTodo.parent]
        todoIndex = parentTodo.subTask.findIndex(targetTodo => (
          targetTodo.id == oldTodo.id
        ))
        parentTodo.subTask[todoIndex] = newTodo
      } else {
        const project = this.projectsHash[oldTodo.project]
        todoIndex = project.todoList.findIndex(targetTodo => (
          targetTodo.id == oldTodo.id
        ))
        project.todoList[todoIndex] = newTodo
      }
      this.todosHash[todo.id] = newTodo
      this.updateTodoProgress(newTodo)
      this.updateEntry(newTodo);
    }
  }
}



export default ProjectManager

