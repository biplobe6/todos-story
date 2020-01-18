import { ActionList } from "Redux/ActionList"


export const ActionModalTurnOn = (data) => (dispatch) => {
  dispatch({
    type: ActionList.turnOnModal,
    payload: {
      data,
    }
  })
}

