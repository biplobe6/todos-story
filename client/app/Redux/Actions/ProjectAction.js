import ApiHelper from "App/Utils/ApiHelper"
import { ActionList } from "Redux/ActionList"


















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


