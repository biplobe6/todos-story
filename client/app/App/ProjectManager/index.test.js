import ProjectManager from '.';


describe("Project Manger", () => {
  it('Should not be undefined.', () => {
    expect(ProjectManager).not.toBeUndefined()
  })

  it('Should be instantiable.', () => {
    expect(() => {
      const prm = new ProjectManager();
    }).not.toThrow()
  })

  it('Should be a class.', () => {
    const prm = new ProjectManager()
    expect(prm).toBeInstanceOf(ProjectManager)
  })

  it('Should hava a property called "list".', () => {
    const prm = new ProjectManager()
    expect(prm.list).not.toBeUndefined()
    expect(prm.list.length).not.toBeUndefined()
  })

  describe('"updateEntry" method', () => {
    it('Should not be undefined.', () => {
      const prm = new ProjectManager()
      expect(prm.updateEntry).not.toBeUndefined()
    })

    it('Should be callable.', () => {
      const prm = new ProjectManager()
      const project = {
        id: 2
      }
      prm.addProject(project)
      expect(() => {
        prm.updateEntry({
          id: 2
        })
      }).not.toThrow()
    })

    describe('Should update data', () => {
      it('Should update updatedAt and key.', () => {
        const prm = new ProjectManager()
        const project = {
          id: 1,
          title: 'project 1',
        }
        prm.addProject(project)
        const addedProject = prm.list[0]
        expect(addedProject.key).not.toBeUndefined()
        expect(addedProject.updatedAt).not.toBeUndefined()
      })

      it('Should update todo with project.', () => {
        const prm = new ProjectManager()
        const project = {
          id: 1,
          title: 'project 1',
        }
        const todo = {
          id: 1,
          project: 1,
          title: "todo 1",
          position: 10,
        }
        prm.addProject(project)
        prm.addTodo(todo)
        const { updatedAt } = prm.updateEntry(todo)

        const addedProject = prm.list[0]
        const addedTodo = addedProject.todoList[0]

        expect(addedProject.key).not.toBeUndefined()
        expect(addedProject.updatedAt).toBe(updatedAt)

        expect(addedTodo.key).not.toBeUndefined()
        expect(addedTodo.updatedAt).toBe(updatedAt)
      })

      it('Should update todo with parent todo and project.', () => {
        const prm = new ProjectManager()
        const project = {
          id: 1,
          title: 'project 1',
        }
        prm.addProject(project)

        const parentParentTodo = {
          id: 1,
          project: 1,
          title: "parent parent todo",
          position: 10,
        }
        prm.addTodo(parentParentTodo)

        const parentTodo = {
          id: 2,
          project: 1,
          parent: 1,
          title: "parent todo",
          position: 10,
        }
        prm.addTodo(parentTodo)

        const todo = {
          id: 3,
          project: 1,
          parent: 2,
          title: "child todo",
          position: 10,
        }
        prm.addTodo(todo)

        const {updatedAt} = prm.updateEntry(todo)

        const addedProject = prm.list[0]
        expect(addedProject.key).not.toBeUndefined()
        expect(addedProject.updatedAt).toBe(updatedAt)

        const addedParentParentTodo = addedProject.todoList[0]
        expect(addedParentParentTodo.key).not.toBeUndefined()
        expect(addedParentParentTodo.updatedAt).toBe(updatedAt)

        const addedParentTodo = addedParentParentTodo.subTask[0]
        expect(addedParentTodo.key).not.toBeUndefined()
        expect(addedParentTodo.updatedAt).toBe(updatedAt)

        const addedTodo = addedParentTodo.subTask[0]
        expect(addedTodo.key).not.toBeUndefined()
        expect(addedTodo.updatedAt).toBe(updatedAt)
      })

      it('Should update todo and should be able to handle random order', () => {
        const prm = new ProjectManager()
        const project = {
          id: 1,
          title: "project 1",
        }
        prm.addProject(project)

        const todo = {
          id: 3,
          title: "todo 3",
          parent: 2,
          project: project.id,
          position: 10,
        }
        prm.addTodo(todo)

        const parentTodo = {
          id: 2,
          title: "parent todo",
          parent: 1,
          project: project.id,
          position: 10,
        }
        prm.addTodo(parentTodo)

        const parentParentTodo = {
          id: 1,
          title: "parent parent todo",
          project: project.id,
          position: 10,
        }
        prm.addTodo(parentParentTodo)

        const {updatedAt} = prm.updateEntry(todo)

        const addedProject = prm.list[0]
        expect(addedProject.key).not.toBeUndefined()
        expect(addedProject.updatedAt).toBe(updatedAt)

        const addedParentParentTodo = addedProject.todoList[0]
        expect(addedParentParentTodo.key).not.toBeUndefined()
        expect(addedParentParentTodo.updatedAt).toBe(updatedAt)

        const addedParentTodo = addedParentParentTodo.subTask[0]
        expect(addedParentTodo.key).not.toBeUndefined()
        expect(addedParentTodo.updatedAt).toBe(updatedAt)

        const addedTodo = addedParentTodo.subTask[0]
        expect(addedTodo.key).not.toBeUndefined()
        expect(addedTodo.updatedAt).toBe(updatedAt)
      })
    })
  })

  describe('"addProject" method', () => {
    const prm = new ProjectManager()

    it('Should not be undefined.', () => {
      expect(prm.addProject).not.toBeUndefined()
    })

    it('Should be callable.', () => {
      expect(() => {
        prm.addProject({
          id: 2
        })
      }).not.toThrow()
    })

    it('Should add project in list.', () => {
      expect(prm.list[0]).not.toBeUndefined()
    })

    it('Should add project in list with property called "todoList".', () => {
      expect(
        prm.list[0].todoList
      ).not.toBeUndefined()
    })
  })

  describe('"addProjectList" method', () => {
    const prm = new ProjectManager()

    it('Should not be undefined.', () => {
      expect(prm.addProjectList).not.toBeUndefined()
    })

    it('Should be callable.', () => {
      expect(() => {
        prm.addProjectList([{
          id: 2
        }])
      }).not.toThrow()
    })

    it('Should add project in list.', () => {
      expect(prm.list[0]).not.toBeUndefined()
    })

    it('Should add project in list with property called "todoList".', () => {
      expect(
        prm.list[0].todoList
      ).not.toBeUndefined()
    })
  })

  describe('"updateProject" method', () => {
    const prm = new ProjectManager()
    prm.addProject({
      id: 2,
      title: 'Hello world'
    })

    it('Should not be undefined.', () => {
      expect(prm.updateProject).not.toBeUndefined()
    })

    it('Should be callable.', () => {
      expect(() => {
        prm.updateProject({
          id: 2,
          title: 'Hello world 2'
        })
      }).not.toThrow()
    })

    it('Should update project in list.', () => {
      expect(prm.list[0].title).toBe('Hello world 2')
    })

    it('Should update project without distroying "todoList".', () => {
      expect(
        prm.list[0].todoList
      ).not.toBeUndefined()
    })
  })

  describe('"deleteProject" method', () => {
    it('Should not be undefined.', () => {
      const prm = new ProjectManager()
      expect(prm.deleteProject).not.toBeUndefined()
    })

    it('Should be callable.', () => {
      const prm = new ProjectManager()
      prm.addProject({
        id: 1,
        title: "Sample project 1"
      })
      expect(() => {
        prm.deleteProject({
          id: 1
        })
      }).not.toThrow()
    })

    it('Should delete project from list.', () => {
      const prm = new ProjectManager()
      const project = {
        id: 1,
        title: "project 1"
      }
      prm.addProject(project)
      prm.deleteProject({
        id: project.id,
      })

      expect(prm.list.length).not.toBeGreaterThan(0)
    })
  })

  describe('"getProject" method', () => {
    const prm = new ProjectManager()
    prm.addProject({
      id: 2,
      title: 'Hello world'
    })

    it('Should not be undefined.', () => {
      expect(prm.getProject).not.toBeUndefined()
    })

    it('Should be callable.', () => {
      expect(() => {
        prm.getProject({
          id: 2,
        })
      }).not.toThrow()
    })

    it('Should return details info of project from list.', () => {
      const projectInfo = prm.getProject({id: 2})
      expect(projectInfo.title).not.toBeUndefined()
      expect(projectInfo.todoList).not.toBeUndefined()
    })
  })

  describe('"addTodo" method', () => {
    it('Should not be undefined.', () => {
      const prm = new ProjectManager()
      expect(prm.addTodo).not.toBeUndefined()
    })

    it('Should be callable.', () => {
      const prm = new ProjectManager()
      prm.addProject({
        id: 2,
        title: 'Hello world'
      })
      expect(() => {
        prm.addTodo({
          id: 2,
          project: 2,
          title: "Sample todo",
          position: 1
        })
      }).not.toThrow()
    })

    it('Should add todo in "todoList".', () => {
      const prm = new ProjectManager()
      prm.addProject({
        id: 2,
        title: 'Hello world'
      })
      prm.addTodo({
        id: 2,
        project: 2,
        title: "Sample todo",
        position: 1,
      })
      const projectInfo = prm.list[0]
      expect(projectInfo.todoList.length).not.toBe(0)
    })

    it('Should add todo in sorted position', () => {
      const prm = new ProjectManager()
      prm.addProject({
        id: 1,
        title: "Project 1"
      })
      prm.addTodo({
        id: 1,
        project: 1,
        title: "Todo 1",
        position: 1,
      })
      prm.addTodo({
        id: 2,
        project: 1,
        title: "Todo 1",
        position: 0.75,
      })
      prm.addTodo({
        id: 3,
        project: 1,
        title: "Todo 1",
        position: 3,
      })
      prm.addTodo({
        id: 4,
        project: 1,
        title: "Todo 1",
        position: 4,
      })
      prm.addTodo({
        id: 5,
        project: 1,
        title: "Todo 1",
        position: 0.5,
      })


      const todoList = prm.list[0].todoList
      expect(todoList.length).toBe(5)
      expect(todoList[0].id).toBe(5)
      expect(todoList[1].id).toBe(2)
      expect(todoList[2].id).toBe(1)
      expect(todoList[3].id).toBe(3)
      expect(todoList[4].id).toBe(4)
    })


    it('Should add todo and subTask also should be sorted', () => {
      const prm = new ProjectManager()
      prm.addProject({
        id: 1,
        title: "Project 1"
      })

      prm.addTodo({
        id: 1,
        position: 2,
        project: 1,
        title: "Todo 1",
      })
      prm.addTodo({
        id: 2,
        position: 1,
        project: 1,
        title: "Todo 2",
      })

      prm.addTodo({
        id: 3,
        position: 3,
        project: 1,
        parent: 2,
        title: "Todo 2.1",
      })

      prm.addTodo({
        id: 4,
        position: 4,
        project: 1,
        parent: 2,
        title: "Todo 2.2",
      })

      prm.addTodo({
        id: 5,
        position: 3.5,
        project: 1,
        parent: 2,
        title: "Todo 2.3",
      })

      prm.addTodo({
        id: 6,
        position: 2.5,
        project: 1,
        parent: 2,
        title: "Todo 2.4",
      })

      const {todoList} = prm.list[0];
      expect(todoList.length).toBe(2);

      expect(todoList[0].id).toBe(2)
      expect(todoList[1].id).toBe(1)

      const {subTask} = todoList[0];
      expect(subTask.length).toBe(4)

      expect(subTask[0].id).toBe(6)
      expect(subTask[1].id).toBe(3)
      expect(subTask[2].id).toBe(5)
      expect(subTask[3].id).toBe(4)

      prm.updateTodo({
        id: 3,
        position: 5,
        project: 1,
        parent: 2,
        title: "Todo 2.1.2",
      })

      const newSubTask = prm.list[0].todoList[0].subTask;
      expect(newSubTask.length).toBe(4)
      expect(newSubTask[0].id).toBe(6)
      expect(newSubTask[1].id).toBe(5)
      expect(newSubTask[2].id).toBe(4)
      expect(newSubTask[3].id).toBe(3)
    })

    describe('Todo with parent', () => {
      it('Should not be in "todoList"', () => {
        const prm = new ProjectManager()
        prm.addProject({
          id: 2,
          title: 'Hello world'
        })
        prm.addTodo({
          id: 3,
          project: 2,
          title: "Sample todo 2",
          parent: 2,
          position: 1
        })
        const project = prm.list[0]
        expect(project.todoList.length).not.toBeGreaterThan(1)
      })

      it('Should add todo as subTask', () => {
        const prm = new ProjectManager()
        prm.addProject({
          id: 2,
          title: 'Hello world'
        })
        prm.addTodo({
          id: 3,
          project: 2,
          title: "Sample todo 2",
          parent: 2,
          position: 1
        })
        prm.addTodo({
          id: 2,
          project: 2,
          title: "Sample todo 2",
          position: 1
        })
        const project = prm.list[0]
        const firstTodo = project.todoList[0]
        expect(firstTodo.subTask.length).toBeGreaterThan(0)
      })

      describe('Todo with child first', () => {
        it('Should not be in "list"', () => {
          const prm = new ProjectManager()
          prm.addProject({
            id: 2,
            title: 'Hello world'
          })
          prm.addTodo({
            id: 2,
            project: 2,
            title: "Sample todo 2",
            position: 1,
          })
          prm.addTodo({
            id: 9,
            project: 2,
            title: "Sample todo 9",
            parent: 4,
            position: 1,
          })
          const project = prm.list[0]
          expect(project.todoList.length).not.toBeGreaterThan(1)
        })

        it('Should appear after parent todo is added', () => {
          const prm = new ProjectManager()
          prm.addProject({
            id: 2,
            title: 'Hello world'
          })
          prm.addTodo({
            id: 2,
            project: 2,
            title: "Sample todo 2",
            position: 1,
          })
          prm.addTodo({
            id: 9,
            project: 2,
            title: "Sample todo 9",
            parent: 4,
            position: 1,
          })
          prm.addTodo({
            id: 4,
            project: 2,
            title: "Sample todo 4",
            position: 2,
          })
          const project = prm.list[0]
          expect(project.todoList.length).toBe(2)
        })
      })
    })
  })

  describe('"deleteTodo" method', () => {
    it('Should not be undefined.', () => {
      const prm = new ProjectManager()
      expect(prm.deleteTodo).not.toBeUndefined()
    })

    it('Should delete todo from "todoList".', () => {
      const prm = new ProjectManager()
      const project = {
        id: 1
      }
      prm.addProject(project)

      const todo = {
        id: 1,
        project: project.id,
        position: 1
      }
      prm.addTodo(todo)
      let updatedProject = prm.list[0]
      expect(updatedProject.todoList.length).toBeGreaterThan(0)

      prm.deleteTodo(todo)
      updatedProject = prm.list[0]
      expect(updatedProject.todoList.length).not.toBeGreaterThan(0)
    })

    it('Should delete todo from "subTask".', () => {
      const prm = new ProjectManager()
      const project = {
        id: 1
      }
      prm.addProject(project)

      const todo1 = {
        id: 1,
        project: project.id,
        position: 1,
      }
      prm.addTodo(todo1)

      const todo2 = {
        id: 2,
        project: project.id,
        parent: todo1.id,
        position: 2,
      }
      prm.addTodo(todo2)
      const addedTodo1 = prm.list[0].todoList[0]
      expect(addedTodo1.subTask.length).toBeGreaterThan(0)

      prm.deleteTodo(todo2)
      expect(addedTodo1.subTask.length).not.toBeGreaterThan(0)
      const addedProject = prm.list[0]
      expect(addedProject.todoList.length).toBe(1)
    })
  })

  describe('"updateTodo" method', () => {
    it('Should not be undefined', () => {
      const prm = new ProjectManager()
      expect(prm.updateTodo).not.toBeUndefined()
    })

    it('Should update todo.', () => {
      const prm = new ProjectManager()
      prm.addProject({
        id: 1
      })
      prm.addTodo({
        id: 1,
        project: 1,
        title: "todo 1",
        position: 1,
      })

      prm.updateTodo({
        id: 1,
        project: 1,
        title: "todo 1.1",
        position: 1,
      })

      const addedTodo1 = prm.list[0].todoList[0]
      expect(addedTodo1.title).toBe('todo 1.1')
    })

    it('Should update todo in proper order', () => {
      const prm = new ProjectManager()
      prm.addProject({
        id: 1,
        title: "Project 1"
      })
      prm.addTodo({
        id: 1,
        project: 1,
        title: "Todo 1",
        position: 1
      })
      prm.addTodo({
        id: 2,
        project: 1,
        title: "Todo 2",
        position: 2
      })

      prm.updateTodo({
        id: 1,
        project: 1,
        title: "Todo 1.2",
        position: 1
      })

      expect(prm.list[0].todoList[0].id).toBe(1)
    })

    it('Should update todo (with parent without distroying child)', () => {
      const prm = new ProjectManager()
      prm.addProject({
        id: 1
      })
      prm.addTodo({
        id: 1,
        project: 1,
        position: 1,
      })
      prm.addTodo({
        id: 2,
        project: 1,
        position: 2,
      })
      prm.addTodo({
        id: 3,
        project: 1,
        parent: 1,
        position: 1,
      })
      prm.addTodo({
        id: 4,
        project: 1,
        parent: 3,
        position: 1,
      })
      prm.addTodo({
        id: 5,
        project: 1,
        parent: 3,
        position: 2,
      })

      const addedTodo3 = prm.list[0].todoList[0].subTask[0]
      expect(addedTodo3.parent).toBe(1)
      expect(addedTodo3.subTask.length).toBe(2)

      const addedTodo1 = prm.list[0].todoList[0]
      expect(addedTodo1.subTask.length).toBeGreaterThan(0)

      const addedTodo2 = prm.list[0].todoList[1]
      expect(addedTodo2.subTask.length).not.toBeGreaterThan(0)

      prm.updateTodo({
        id: 3,
        project: 1,
        parent: 2,
        position: 1,
      })
      expect(addedTodo1.subTask.length).not.toBeGreaterThan(0)
      expect(addedTodo2.subTask.length).toBeGreaterThan(0)

      const updateTodo = prm.list[0].todoList[1].subTask[0]
      expect(updateTodo.parent).toBe(2)
      expect(updateTodo.subTask.length).toBe(2)
    })
  })
})
