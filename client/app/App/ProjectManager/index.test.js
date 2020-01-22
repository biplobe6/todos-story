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
        }
        prm.addTodo(parentParentTodo)

        const parentTodo = {
          id: 2,
          project: 1,
          parent: 1,
          title: "parent todo",
        }
        prm.addTodo(parentTodo)

        const todo = {
          id: 3,
          project: 1,
          parent: 2,
          title: "child todo",
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
        }
        prm.addTodo(todo)

        const parentTodo = {
          id: 2,
          title: "parent todo",
          parent: 1,
          project: project.id,
        }
        prm.addTodo(parentTodo)

        const parentParentTodo = {
          id: 1,
          title: "parent parent todo",
          project: project.id,
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
    let prm;
    beforeAll(() => {
      prm = new ProjectManager()
      prm.addProject({
        id: 2,
        title: 'Hello world'
      })
    })

    it('Should not be undefined.', () => {
      expect(prm.addTodo).not.toBeUndefined()
    })

    it('Should be callable.', () => {
      expect(() => {
        prm.addTodo({
          id: 2,
          project: 2,
          title: "Sample todo",
        })
      }).not.toThrow()
    })

    it('Should add todo in "todoList".', () => {
      const projectInfo = prm.list[0]
      expect(projectInfo.todoList.length).not.toBe(0)
    })

    describe('Todo with parent', () => {
      let project
      beforeAll(() => {
        prm.addTodo({
          id: 3,
          project: 2,
          title: "Sample todo 2",
          parent: 2,
        })
        project = prm.list[0]
      })

      it('Should not be in "todoList"', () => {
        expect(project.todoList.length).not.toBeGreaterThan(1)
      })

      it('Should add todo as subTask', () => {
        const firstTodo = project.todoList[0]
        expect(firstTodo.subTask.length).toBeGreaterThan(0)
      })

      describe('Todo with child first', () => {
        beforeAll(() => {
          prm.addTodo({
            id: 9,
            project: 2,
            title: "Sample todo 9",
            parent: 4,
          })
        })

        it('Should not be in "list"', () => {
          expect(project.todoList.length).not.toBeGreaterThan(1)
        })

        it('Should appear after parent todo is added', () => {
          prm.addTodo({
            id: 4,
            project: 2,
            title: "Sample todo 4"
          })
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
      }
      prm.addTodo(todo1)

      const todo2 = {
        id: 2,
        project: project.id,
        parent: todo1.id,
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
        title: "todo 1"
      })

      prm.updateTodo({
        id: 1,
        project: 1,
        title: "todo 1.1"
      })

      const addedTodo1 = prm.list[0].todoList[0]
      expect(addedTodo1.title).toBe('todo 1.1')
    })

    it('Should update todo (with parent without distroying child)', () => {
      const prm = new ProjectManager()
      prm.addProject({
        id: 1
      })
      prm.addTodo({
        id: 1,
        project: 1,
      })
      prm.addTodo({
        id: 2,
        project: 1,
      })
      prm.addTodo({
        id: 3,
        project: 1,
        parent: 1,
      })
      prm.addTodo({
        id: 4,
        project: 1,
        parent: 3,
      })
      prm.addTodo({
        id: 5,
        project: 1,
        parent: 3,
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
      })
      expect(addedTodo1.subTask.length).not.toBeGreaterThan(0)
      expect(addedTodo2.subTask.length).toBeGreaterThan(0)

      const updateTodo = prm.list[0].todoList[1].subTask[0]
      expect(updateTodo.parent).toBe(2)
      expect(updateTodo.subTask.length).toBe(2)
    })
  })
})
