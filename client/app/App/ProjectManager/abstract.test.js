import { TestCasesAuto, Test } from '../../Utils/TestCases';
import {
  AbstractProjectManager,
} from '.';


export const MixinAbstractProjectManagerCases = (_TestCases=TestCasesAuto) => class extends _TestCases {
  getPrm(){
    return new AbstractProjectManager()
  }

  testShouldBeInstansiable(){
    return ({
      test: () => it('Should be instansiable', () => {
        const prm = this.getPrm()
        expect(prm).toBeInstanceOf(AbstractProjectManager)
      })
    })
  }

  // ==================================[ progress ]==================================
  PROGRESS_GROUP = "'progress'"

  testProgressShouldNotBeUndefined(){
    return ({
      group: this.PROGRESS_GROUP,
      test: () => it('Should not be undefined', () => {
        const prm = this.getPrm()
        expect(prm.progress).not.toBeUndefined()
      })
    })
  }

  // ===================================[ todos ]====================================
  TODOS_GROUP = "'todos'"

  testTodos1(){
    return ({
      group: this.TODOS_GROUP,
      test: () => it('Should not be undefined', () => {
        const prm = this.getPrm()
        expect(prm.todos).not.toBeUndefined()
      })
    })
  }

  testTodos2(){
    return ({
      group: this.TODOS_GROUP,
      test: () => it('Should be array', () => {
        const prm = this.getPrm()
        expect(prm.todos.length).not.toBeUndefined()
      })
    })
  }

  // =================================[ addTodo() ]==================================
  ADD_TODO_GROUP = "'addTodo()'"

  testAddTodo(){
    return ({
      group: this.ADD_TODO_GROUP,
      test: () => it('Should not be undefined', () => {
        const prm = this.getPrm()
        expect(prm.addTodo).not.toBeUndefined()
      })
    })
  }

  testAddTodo2(){
    return ({
      group: this.ADD_TODO_GROUP,
      test: () => it('Should add todo in todo list.', () => {
        const prm = this.getPrm()
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
  }

  // ===========================[ addTodo() with parent ]============================
  ADD_TODO_WITH_PARENT_GROUP = "'addTodo()' with parent"

  testAddTodo3(){
    return ({
      group: this.ADD_TODO_WITH_PARENT_GROUP,
      test: () => it('Should not add todo in todo list without parent.', () => {
        const prm = this.getPrm()
        prm.addTodo({
          alias: 2,
          title: 'Hello world',
          parent: 1,
          position: 1
        })

        expect(prm.todos.length).not.toBeGreaterThan(0)
      })
    })
  }

  testAddTodo4(){
    return ({
      group: this.ADD_TODO_WITH_PARENT_GROUP,
      test: () => it('Should add todo as subTask', () => {
        const prm = this.getPrm()
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
  }

  // ================================[ deleteTodo() ]================================
  DELETE_TODO_GROUP = "'deleteTodo()'"

  testDeleteTodo(){
    return ({
      group: this.DELETE_TODO_GROUP,
      test: () => it('Should delete todo from todo list.', () => {
        const prm = this.getPrm()
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
    })
  }

  testDeleteTodo2(){
    return ({
      group: this.DELETE_TODO_GROUP,
      test: () => it('Should delete todo from subTask', () => {
        const prm = this.getPrm()
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
  }


  // ================================[ updateTodo() ]================================
  UPDATE_TODO_GROUP = "'updateTodo()'"

  testUpdateTodo(){
    return ({
      group: this.UPDATE_TODO_GROUP,
      test: () => it('Should update todo', () => {
        const prm = this.getPrm()
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
    })
  }

  testUpdateTodo2(){
    return ({
      group: this.UPDATE_TODO_GROUP,
      test: () => it("Should update todo without destroying child", () => {
        const prm = this.getPrm()
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
    })
  }

  testUpdateTodo3(){
    return ({
      group: this.UPDATE_TODO_GROUP,
      test: () => it("Should update todo's location", () => {
        const prm = this.getPrm()
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
  }
}



describe("'AbstractProjectManager'", () => {
  Test(
    MixinAbstractProjectManagerCases()
  )()
})
