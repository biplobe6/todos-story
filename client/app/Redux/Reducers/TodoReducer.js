import { ActionList } from "Redux/ActionList"

const initState = {
  list: [],
  hash: {},
  idList: [],
}


export const TodoReducer = (state=initState, action) => {
  switch (action.type) {
    default:
      return state
  }
}
