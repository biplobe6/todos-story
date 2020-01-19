import ApiHelper from "App/Utils/ApiHelper"
import { ActionList } from "Redux/ActionList"


export const ActionGetTodos = () => (dispatch) => {
  const onSuccess = (response) => {
    dispatch({
      type: ActionList.getTodos,
      payload: {
        data: response.getData()
      }
    })
  }

  const onError = (error) => {
    console.error(error)
  }

  ApiHelper.todo.get().then(onSuccess).catch(onError)
}

export const ActionAddTodo = (data) => (dispatch) => {
  const onSuccess = (response) => {
    data.onSuccess(response)
    dispatch({
      type: ActionList.addTodo,
      payload: {
        data: response.getData()
      }
    })
  }
  const onError = (error) => {
    console.error(error)
    data.onError(error)
  }

  ApiHelper.todo.post(
    data.getPayload()
  ).then(onSuccess).catch(onError)
}


