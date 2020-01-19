import ApiHelper from "App/Utils/ApiHelper"

export const ActionAddTodo = (data) => (dispatch) => {
  const onSuccess = (response) => {
    data.onSuccess(response)
  }
  const onError = (error) => {
    console.error(error)
    data.onError(error)
  }

  ApiHelper.todo.post(
    data.getPayload()
  ).then(onSuccess).catch(onError)
}
