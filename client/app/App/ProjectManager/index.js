


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
      }
      if(obj.subTask){
        obj.subTask = [...obj.subTask]
      }
      Object.assign(obj, newData)
    }
    updateObject(entry)
    return newData
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

    this.updateEntry(todo)
  }

  deleteTodo(todo){
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
      this.updateEntry(parentTodo)
    }
    delete this.todosHash[todo.id]
  }

  updateTodo(todo){
    const oldTodo = Object.assign({}, this.todosHash[todo.id])
    const newTodo = Object.assign({}, oldTodo, todo)
    this.deleteTodo(oldTodo)
    this.addTodo(newTodo)
  }
}



export default ProjectManager

