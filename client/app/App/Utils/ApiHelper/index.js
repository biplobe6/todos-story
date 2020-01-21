import { registerApi } from "./provider";

export const ApiHelper = {
  projects: registerApi({
    url: '/project'
  }),
  project: registerApi({
    url: ({projectId}) => `/project/${projectId}`
  }),
  todos: registerApi({
    url: '/todo'
  }),
  todo: registerApi({
    url: ({todoId}) => `/todo/${todoId}`
  })
}

export default ApiHelper
