import { TestCasesAuto, Test, TestCases } from '../../Utils/TestCases';
import {
  ProjectManager,
  ProjectManagerFmtp,
} from '.';
import { MixinAbstractProjectManagerCases } from './abstract.test';
import { useFakeTimers } from 'sinon';


export const MixinSimpleProjectManagerCases = (_TestCases=TestCasesAuto) => class extends _TestCases {
  getPrm(){
    return new ProjectManager()
  }

  testShouldBeInstansiable(){
    return ({
      test: () => it('Should be instansiable', () => {
        const prm = this.getPrm()
        expect(prm).toBeInstanceOf(ProjectManager)
      })
    })
  }

  // ==================================[ progress ]==================================
  PROGRESS_GROUP = "'progress'"

  testProgress2(){
    return ({
      group: this.PROGRESS_GROUP,
      test: () => it('Should be added in every todo', () => {
        const prm = this.getPrm()
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
    })
  }

  testProgress3(){
    return ({
      group: this.PROGRESS_GROUP,
      test: () => it('Should be 0 of todo if todo is not done', () => {
        const prm = this.getPrm()
        prm.addTodo({
          alias: 1,
          position: 1,
          title: "Hello world",
          done: false
        })
        expect(prm.todos[0].progress).toBe(0)
      })
    })
  }

  testProgress4(){
    return ({
      group: this.PROGRESS_GROUP,
      test: () => it('Should be 100 of todo if todo is done', () => {
        const prm = this.getPrm()
        prm.addTodo({
          alias: 1,
          position: 1,
          title: "Hello world",
          done: true
        })
        expect(prm.todos[0].progress).toBe(100)
      })
    })
  }

  testProgress5(){
    return ({
      group: this.PROGRESS_GROUP,
      test: () => it("Should be 0 'progress' of 'ProjectManager'", () => {
        const prm = this.getPrm()
        expect(prm.progress).toBe(0)
      })
    })
  }

  testProgress6(){
    return ({
      group: this.PROGRESS_GROUP,
      test: () => it("Should be 60 'progress' of 'ProjectManager'", () => {
        const prm = this.getPrm()
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
    })
  }

  testProgress7(){
    return ({
      group: this.PROGRESS_GROUP,
      test: () => it("Should be 100 'progress' of 'ProjectManager'", () => {
        const prm = this.getPrm()
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
    })
  }

  testProgress8(){
    return ({
      group: this.PROGRESS_GROUP,
      test: () => it("Should be 90 'progress' of todo (with subTask)", () => {
        const prm = this.getPrm()
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
    })
  }

  testProgress9(){
    return ({
      group: this.PROGRESS_GROUP,
      test: () => it("Should be 60 'progress' of todo (with subTask)", () => {
        const prm = this.getPrm()
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
    })
  }

  testProgress10(){
    return ({
      group: this.PROGRESS_GROUP,
      test: () => it("Should be 0 'progress' of 'ProjectManager' (on delete todo)", () => {
        const prm = this.getPrm()
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
  }

  // =================================[ updatedAt ]==================================
  UPDATED_AT_GROUP = "'updatedAt'"

  testUpdatedAt1(){
    return ({
      group: this.UPDATED_AT_GROUP,
      test: () => it("'addTodo()' Should add 'updatedAt' property", () => {
        const prm = this.getPrm()
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
    })
  }

  testUpdatedAt2(){
    return ({
      group: this.UPDATED_AT_GROUP,
      test: () => it("'addTodo()' Should update 'updatedAt' of parentTodo", () => {
        const prm = this.getPrm()
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
    })
  }

  testUpdatedAt3(){
    return ({
      group: this.UPDATED_AT_GROUP,
      test: () => it("'deleteTodo()' Should update 'updatedAt' of parentTodo", () => {
        const prm = this.getPrm()
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
    })
  }

  testUpdatedAt4(){
    return ({
      group: this.UPDATED_AT_GROUP,
      test: () => it("'updateTodo()' Should update 'updatedAt'", () => {
        const prm = this.getPrm()
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
  }

  // ==================================[ Sorting ]===================================
  TODO_SORTING_USING_POSITION = "Todo Sorting using 'position'"

  testTodoSorting1(){
    return ({
      group: this.TODO_SORTING_USING_POSITION,
      test: () => test('Todo Should be sorted', () => {
        const prm = this.getPrm()
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
    })
  }

  testTodoSorting2(){
    return ({
      group: this.TODO_SORTING_USING_POSITION,
      test: () => test('Todo Should be sorted (reverse order)', () => {
        const prm = this.getPrm()
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
    })
  }

  testTodoSorting3(){
    return ({
      group: this.TODO_SORTING_USING_POSITION,
      test: () => test('All Todo Should be resorted', () => {
        const prm = this.getPrm()
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
  }
}


describe("'ProjectManager'", () => {
  Test(
    MixinSimpleProjectManagerCases(
      MixinAbstractProjectManagerCases()
    )
  )()
})



export const MixinSimplePMFmtpCases = (_TestCases=TestCases) => class extends _TestCases {
  getPrm(){
    return new ProjectManagerFmtp()
  }

  testShouldBeInstansiable(){
    return ({
      test: () => it('Should be instansiable', () => {
        const prm = this.getPrm()
        expect(prm).toBeInstanceOf(ProjectManagerFmtp)
      })
    })
  }

  PROGRESS_GROUP = "'progress'"

  testProgress11(){
    return ({
      group: this.PROGRESS_GROUP,
      test: () => it('Should be 33.3', () => {
        const prm = this.getPrm()
        prm.addTodo({
          alias: 1,
          position: 1,
          title: "Hello world 1",
          duration: 100,
          done: true
        })
        expect(prm.progress).toBe(100)

        prm.addTodo({
          alias: 2,
          position: 2,
          title: "hello world 2",
          duration: 100
        })
        expect(prm.progress).toBe(50)

        prm.addTodo({
          alias: 3,
          position: 3,
          title: "hello world 3",
          duration: 100
        })
        expect(prm.progress).toBe(33.3)
      })
    })
  }
}

describe("'ProjectManagerFmtp'", () => {
  Test(
    MixinSimplePMFmtpCases(
      MixinSimpleProjectManagerCases(
        MixinAbstractProjectManagerCases()
      )
    )
  )()
})
