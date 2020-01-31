import { registerApi } from "./provider";

export const ApiHelper = {
  projects: registerApi({
    url: '/project'
  }),
  project: registerApi({
    url: ({id}) => `/project/${id}`
  }),
  todos: registerApi({
    url: '/todo'
  }),
  todo: registerApi({
    url: ({id}) => `/todo/${id}`
  })
}

export default ApiHelper
