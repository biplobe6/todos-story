import { registerApi } from "./provider";

export const ApiHelper = {
  projects: registerApi({
    url: '/project'
  }),
  project: registerApi({
    url: ({alias}) => `/project/${alias}`
  }),
  projectExport: registerApi({
    url: ({alias}) => `/project/export/${alias}`
  }),
  projectImport: registerApi({
    url: ({alias}) => `/project/import/${alias}`
  }),
  todos: registerApi({
    url: '/todo'
  }),
  todo: registerApi({
    url: ({alias}) => `/todo/${alias}`
  })
}

export default ApiHelper
