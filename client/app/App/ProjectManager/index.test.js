import {
  AbstractProjectManager,
  ProjectManager
} from '.';
import { useFakeTimers } from 'sinon';
const {expect} = global;



describe("'AbstractProjectManager'", () => {
  it('Should be instansiable', () => {
    const prm = new AbstractProjectManager()
    expect(prm).toBeInstanceOf(AbstractProjectManager)
  })

  // ==================================[ progress ]==================================
  describe("'progress'", () => {
    it('Should not be undefined', () => {
      const prm = new AbstractProjectManager()
      expect(prm.progress).not.toBeUndefined()
    })
  })

  // ===================================[ todos ]====================================
  describe("'todos'", () => {
    it('Should not be undefined', () => {
      const prm = new AbstractProjectManager()
      expect(prm.todos).not.toBeUndefined()
    })

    it('Should be array', () => {
      const prm = new AbstractProjectManager()
      expect(prm.todos.length).not.toBeUndefined()
    })
  })

  // =================================[ addTodo() ]==================================
  describe("'addTodo()'", () => {
    it('Should not be undefined', () => {
      const prm = new AbstractProjectManager()
      expect(prm.addTodo).not.toBeUndefined()
    })

    it('Should add todo in todo list.', () => {
      const prm = new AbstractProjectManager()
      prm.addTodo({
        alias: 1,
        title: 'Hello world',
        position: 1
      })
      prm.addTodo({
        alias: 2,
        title: 'Hello world 2',
        position: 2
      })

      expect(prm.todos.length).not.toBe(0)
      expect(prm.todos.length).toBe(2)
    })
  })

  // ===========================[ addTodo() with parent ]============================
  describe("'addTodo()' with parent", () => {
    it('Should not add todo in todo list without parent.', () => {
      const prm = new AbstractProjectManager()
      prm.addTodo({
        alias: 2,
        title: 'Hello world',
        parent: 1,
        position: 1
      })

      expect(prm.todos.length).not.toBeGreaterThan(0)
    })

    it('Should add todo as subTask', () => {
      const prm = new AbstractProjectManager()
      prm.addTodo({
        alias: 1,
        title: "Hello world",
        position: 1,
      })

      prm.addTodo({
        alias: 2,
        title: "Hello world 2",
        position: 1,
        parent: 1
      })

      expect(prm.todos.length).not.toBeGreaterThan(1)
      const todo1 = prm.todos[0]
      expect(todo1.subTask.length).toBeGreaterThan(0)
    })
  })

  // ================================[ deleteTodo() ]================================
  describe("'deleteTodo()'", () => {
    it('Should delete todo from todo list.', () => {
      const prm = new AbstractProjectManager()
      prm.addTodo({
        alias: 1,
        title: "Hello world",
        position: 1
      })
      expect(prm.todos.length).toBe(1)
      // End of Setup.

      // Expectation.
      prm.deleteTodo({
        alias: 1
      })
      expect(prm.todos.length).toBe(0)
    })

    it('Should delete todo from subTask', () => {
      const prm = new AbstractProjectManager()
      prm.addTodo({
        alias: 1,
        title: "Hello world",
        position: 1
      })
      prm.addTodo({
        alias: 2,
        title: "Hello world 2.1",
        position: 1,
        parent: 1
      })
      expect(prm.todos.length).toBe(1)
      expect(prm.todos[0].subTask.length).toBe(1)
      // End of Setup

      // Expectation.
      prm.deleteTodo({alias: 2})
      expect(prm.todos.length).toBe(1)
      expect(prm.todos[0].subTask.length).toBe(0)
    })
  })

  // ================================[ updateTodo() ]================================
  describe("'updateTodo()'", () => {
    it('Should update todo', () => {
      const prm = new AbstractProjectManager()
      prm.addTodo({
        alias: 1,
        title: "hello world",
        position: 1
      })
      expect(prm.todos.length).toBe(1)
      // End of Setup

      // Expectation.
      prm.updateTodo({
        alias: 1,
        title: "Hello world",
        position: 1
      })
      expect(prm.todos[0].title).toBe('Hello world')
    })

    it("Should update todo without destroying child", () => {
      const prm = new AbstractProjectManager()
      prm.addTodo({
        alias: 2,
        title: "Hello world",
        position: 1,
        parent: 1
      })
      prm.addTodo({
        alias: 1,
        title: "Hello worl",
        position: 1,
      })
      expect(prm.todos.length).toBe(1)
      expect(prm.todos[0].subTask.length).toBe(1)
      // End of Setup

      // Expectation.
      prm.updateTodo({
        alias: 1,
        title: "Hello world",
        position: 1
      })
      expect(prm.todos[0].subTask.length).toBe(1)
      expect(prm.todos[0].title).toBe("Hello world")
    })

    it("Should update todo's location", () => {
      const prm = new AbstractProjectManager()
      prm.addTodo({
        alias: 1,
        title: "Hello world",
        position: 1
      })
      prm.addTodo({
        alias: 2,
        title: "Hello world",
        position: 2
      })
      prm.addTodo({
        alias: 3,
        title: "hello world",
        position: 1,
        parent: 2
      })
      prm.addTodo({
        alias: 4,
        title: "Hello world",
        position: 2,
        parent: 3
      })
      expect(prm.todos.length).toBe(2)
      expect(prm.todos[1].subTask.length).toBe(1)
      expect(prm.todos[0].subTask.length).toBe(0)
      expect(prm.todos[1].subTask[0].subTask.length).toBe(1)
      // End of Setup

      // Expectation.
      prm.updateTodo({
        alias: 3,
        title: "Hello world",
        position: 1,
        parent: 1
      })
      expect(prm.todos.length).toBe(2)
      expect(prm.todos[0].subTask.length).toBe(1)
      expect(prm.todos[1].subTask.length).toBe(0)
      expect(prm.todos[0].subTask[0].subTask.length).toBe(1)
    })
  })
})



describe("'ProjectManager'", () => {
  // =================================[ updatedAt ]==================================
  describe("'updatedAt'", () => {
    it("'addTodo()' Should add 'updatedAt' property", () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world"
      })
      expect(prm.todos.length).toBe(1)
      // End of Setup

      // Expectation.
      expect(prm.todos[0].updatedAt).not.toBeUndefined()
    })

    it("'addTodo()' Should update 'updatedAt' of parentTodo", () => {
      const prm = new ProjectManager()
      const firstUpdatedAt = prm.updatedAt
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world"
      })
      expect(prm.todos.length).toBe(1)
      expect(prm.todos[0].updatedAt).not.toBeUndefined()

      const oldUpdatedAt = prm.todos[0].updatedAt
      const clock = useFakeTimers()
      clock.tick(10)
      prm.addTodo({
        alias: 2,
        position: 1,
        title: "Hello world",
        parent: 1,
      })
      expect(prm.todos.length).toBe(1)
      expect(prm.todos[0].subTask.length).toBe(1)
      expect(prm.todos[0].subTask[0].updatedAt).not.toBeUndefined()
      expect(prm.todos[0].updatedAt).not.toBe(oldUpdatedAt)
      expect(prm.updatedAt).not.toBe(firstUpdatedAt)
      expect(prm.updatedAt).not.toBe(oldUpdatedAt)
      clock.restore()
    })

    it("'deleteTodo()' Should update 'updatedAt' of parentTodo", () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world"
      })
      prm.addTodo({
        alias: 2,
        position: 1,
        title: "Hello world",
        parent: 1
      })
      expect(prm.todos.length).toBe(1)
      expect(prm.todos[0].subTask.length).toBe(1)

      const oldUpdatedAt = prm.todos[0].updatedAt
      const clock = useFakeTimers()
      clock.tick(10)
      prm.deleteTodo({
        alias: 2
      })
      expect(prm.todos[0].subTask.length).toBe(0)
      expect(prm.todos.length).toBe(1)
      expect(prm.todos[0].updatedAt).not.toBe(oldUpdatedAt)
      expect(prm.updatedAt).not.toBe(oldUpdatedAt)

      const nextUpdatedAt = prm.todos[0].updatedAt
      clock.tick(20)
      prm.deleteTodo({alias: 1})
      expect(prm.todos.length).toBe(0)
      expect(prm.updatedAt).not.toBe(oldUpdatedAt)
      expect(prm.updatedAt).not.toBe(nextUpdatedAt)
      clock.restore()
    })

    it("'updateTodo()' Should update 'updatedAt'", () => {
      const prm = new ProjectManager()
      const updatedAt = [
        prm.updatedAt
      ]
      prm.addTodo({
        alias: 1,
        title: "Hello world",
        position: 1,
      })
      prm.addTodo({
        alias: 2,
        title: "Hello world",
        position: 2,
      })
      prm.addTodo({
        alias: 3,
        title: "hello world",
        position: 1,
        parent: 2
      })
      prm.addTodo({
        alias: 4,
        title: "Hello world",
        position: 1,
        parent: 3
      })
      expect(prm.todos.length).toBe(2)
      expect(prm.todos[1].subTask.length).toBe(1)
      expect(prm.updatedAt).toBe(prm.todos[1].updatedAt)
      updatedAt.push(prm.updatedAt)
      updatedAt.push(prm.todos[1].subTask[0].updatedAt)

      const clock = useFakeTimers()
      clock.tick(10)

      prm.updateTodo({
        alias: 3,
        title: "Hello world",
        position: 1,
        parent: 1
      })
      expect(prm.todos.length).toBe(2)
      expect(prm.todos[0].subTask.length).toBe(1)
      expect(prm.todos[1].subTask.length).toBe(0)
      updatedAt.push(prm.todos[0].updatedAt)
      expect(updatedAt[3]).toBe(prm.updatedAt)

      expect(updatedAt[0]).not.toBe(prm.updatedAt)
      expect(updatedAt[1]).not.toBe(prm.updatedAt)
      expect(updatedAt[2]).not.toBe(prm.updatedAt)

      expect(updatedAt[0]).not.toBe(prm.todos[0].updatedAt)
      expect(updatedAt[1]).not.toBe(prm.todos[0].updatedAt)
      expect(updatedAt[2]).not.toBe(prm.todos[0].updatedAt)
      clock.restore()
    })
  })

  // ==================================[ progress ]==================================
  describe("'progress'", () => {
    it('Should be added in every todo', () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world"
      })
      expect(prm.todos[0].progress).not.toBeUndefined()
      prm.addTodo({
        alias: 2,
        position: 2,
        title: "Hello world"
      })
      expect(prm.todos[1].progress).not.toBeUndefined()
    })

    it('Should be 0 of todo if todo is not done', () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world",
        done: false
      })
      expect(prm.todos[0].progress).toBe(0)
    })

    it('Should be 100 of todo if todo is done', () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world",
        done: true
      })
      expect(prm.todos[0].progress).toBe(100)
    })


    it("Should be 0 'progress' of 'ProjectManager'", () => {
      const prm = new ProjectManager()
      expect(prm.progress).toBe(0)
    })

    it("Should be 60 'progress' of 'ProjectManager'", () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world",
        done: false,
        duration: 80,
      })
      prm.addTodo({
        alias: 2,
        position: 2,
        title: "Hello world",
        done: true,
        duration: 120
      })
      expect(prm.progress).toBe(60)
    })

    it("Should be 100 'progress' of 'ProjectManager'", () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world",
        done: true,
        duration: 80,
      })
      prm.addTodo({
        alias: 2,
        position: 2,
        title: "Hello world",
        done: true,
        duration: 120
      })
      expect(prm.progress).toBe(100)
    })

    it("Should be 90 'progress' of todo (with subTask)", () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world",
        duration: 120,
        done: true
      })
      expect(prm.progress).toBe(100)
      prm.addTodo({
        alias: 2,
        position: 2,
        title: "Hello world",
        duration: 40,
        done: false,
        d: 2
      })
      prm.addTodo({
        alias: 3,
        position: 1,
        parent: 2,
        title: "Hello world",
        duration: 40,
        done: false
      })
      prm.addTodo({
        alias: 4,
        position: 2,
        parent: 2,
        title: "Hello world",
        duration: 60,
        done: true,
        d: 1
      })
      expect(prm.todos[1].progress).toBe(60)
      expect(prm.progress).toBe(90)
    })

    it("Should be 60 'progress' of todo (with subTask)", () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world",
        done: false,
        duration: 80
      })
      prm.addTodo({
        alias: 2,
        position: 2,
        title: "Hello world",
        done: false,
        duration: 120
      })
      expect(prm.progress).toBe(0)
      expect(prm.todos[1].progress).toBe(0)
      prm.addTodo({
        alias: 3,
        position: 1,
        parent: 2,
        title: "Hello world",
        duration: 80,
        done: false
      })
      prm.addTodo({
        alias: 4,
        position: 2,
        parent: 2,
        title: "Hello world",
        duration: 120,
        done: true
      })
      expect(prm.todos.length).toBe(2)
      expect(prm.todos[1].progress).toBe(60)
      expect(prm.progress).toBe(36)
    })

    it("Should be 0 'progress' of 'ProjectManager' (on delete todo)", () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world",
        duration: 120,
        done: true
      })
      expect(prm.progress).toBe(100)
      prm.addTodo({
        alias: 2,
        position: 2,
        title: "Hello world",
        duration: 40,
        done: false,
      })
      expect(prm.progress).toBe(75)
      prm.updateTodo({
        alias: 2,
        position: 2,
        title: "Hello world",
        duration: 40,
        done: true,
      })
      expect(prm.progress).toBe(100)
      prm.addTodo({
        alias: 3,
        position: 3,
        title: "Hello world",
        duration: 40,
        done: false
      })
      expect(prm.progress).toBe(80)
      prm.deleteTodo({alias: 2})
      expect(prm.progress).toBe(75)
      prm.deleteTodo({alias: 1})
      expect(prm.progress).toBe(0)
    })
  })

  // ==================================[ Sorting ]===================================
  describe("Todo Sorting using 'position'", () => {
    test('Todo Should be sorted', () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 2,
        title: "Hello world",
        duration: 100
      })
      prm.addTodo({
        alias: 2,
        position: 1,
        title: "Hello world",
        duration: 100
      })
      expect(prm.todos[0].alias).toBe(2)
    })

    test('Todo Should be sorted (reverse order)', () => {
      const prm = new ProjectManager()
      prm.ascOrder = false
      prm.addTodo({
        alias: 1,
        position: 1,
        title: "Hello world",
        duration: 100
      })
      prm.addTodo({
        alias: 2,
        position: 2,
        title: "Hello world",
        duration: 100
      })
      expect(prm.todos[0].alias).toBe(2)
    })

    test('All Todo Should be resorted', () => {
      const prm = new ProjectManager()
      prm.addTodo({
        alias: 1,
        position: 2,
        title: "Hello world",
        duration: 100
      })
      prm.addTodo({
        alias: 2,
        position: 1,
        title: "Hello world",
        duration: 100
      })
      prm.addTodo({
        alias: 3,
        position: 4,
        parent: 2,
        title: "Hello world",
        duration: 100
      })
      prm.addTodo({
        alias: 4,
        position: 2,
        parent: 2,
        title: "Hello world",
        duration: 100
      })
      expect(prm.todos[0].alias).toBe(2)
      expect(prm.todos[1].alias).toBe(1)
      expect(prm.todos[0].subTask[0].alias).toBe(4)
      expect(prm.todos[0].subTask[1].alias).toBe(3)
      prm.ascOrder = false
      prm.sortAll()
      expect(prm.todos[0].alias).toBe(1)
      expect(prm.todos[1].alias).toBe(2)
      expect(prm.todos[1].subTask[0].alias).toBe(3)
      expect(prm.todos[1].subTask[1].alias).toBe(4)
    })
  })
})

