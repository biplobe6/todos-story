import ApiHelper from "App/Utils/ApiHelper"
import { ActionList } from "Redux/ActionList"
import { ActionGetTodos } from "./TodoAction"



export const ActionGetProjectList = () => (dispatch) => {
  const onSuccess = (response) => {
    dispatch({
      type: ActionList.getProjectList,
      payload: {
        data: response.getData()
      }
    })
  }

  const onError = (error) => {
    console.error(error)
  }

  ApiHelper.projects.get().then(onSuccess).catch(onError)
}












export const ActionAddProject = (data) => (dispatch) => {
  const onSuccess = (response) => {
    data.onSuccess(response)
    dispatch({
      type: ActionList.addProject,
      payload: {
        data: response.getData()
      }
    })
  }
  const onError = (error) => {
    console.error(error)
    data.onError(error)
  }

  ApiHelper.projects.post(
    data.getPayload()
  ).then(onSuccess).catch(onError)
}





export const ActionUpdateProject = (data) => (dispatch) => {
  const onSuccess = (response) => {
    data.onSuccess(response)
    dispatch({
      type: ActionList.updateProject,
      payload: {
        data: response.getData(),
        oldData: data.oldPayload(),
      }
    })
  }
  const onError = (error) => {
    console.error(error)
    data.onError(error)
  }

  ApiHelper.project.put(
    data.getPayload(),
    {alias: data.oldPayload().alias},
  ).then(onSuccess).catch(onError)
}


export const ActionExportProject = (alias) => (dispatch) => {
  const onError = (error) => {
    console.error(error)
  }

  ApiHelper.projectExport.get({
    alias,
  }).catch(onError)
}


export const ActionImportProject = (alias) => (dispatch) => {
  const onSuccess = (response) => {
    ActionGetTodos({
      alias,
    })(dispatch)
  }

  const onError = (error) => {
    console.error(error)
  }

  ApiHelper.projectImport.get({
    alias,
  }).then(onSuccess).catch(onError)
}


export const ActionDeleteProject = (data) => (dispatch) => {
  const onSuccess = (response) => {
    dispatch({
      type: ActionList.deleteProject,
      payload: {
        data,
        response
      }
    })
  }

  const onError = (error) => {
    console.error(error)
  }
  ApiHelper.project.delete({
    alias: data.alias
  }).then(onSuccess).catch(onError)
}

