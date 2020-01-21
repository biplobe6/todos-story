import ApiHelper from "App/Utils/ApiHelper"
import { ActionList } from "Redux/ActionList"



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
    projectId: data.id
  }).then(onSuccess).catch(onError)
}

