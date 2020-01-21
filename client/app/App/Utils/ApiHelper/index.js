import { registerApi } from "./provider";

export const ApiHelper = {
  todos: registerApi({
    url: '/todo'
  }),
  todo: registerApi({
    url: ({todoId}) => `/todo/${todoId}`
  })
}

export default ApiHelper
