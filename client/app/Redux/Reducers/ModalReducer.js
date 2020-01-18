import { generate as shortId } from 'shortid';
import { ActionList } from "Redux/ActionList"

const initState = {
  data: {},
  order: [],
  activeModal: null,
}


const reducerTurnOnModal = (state, action) => {
  const {dataset, data} = action.payload.data.currentTarget;
  const {targetModal, backDrop} = dataset;
  const modalId = shortId();

  const activeModal = {
    targetModal,
    id: modalId,
    backDrop: Boolean(backDrop == 'true'),
    data: data || null,
  }

  return ({
    ...state,
    activeModal,
    data: {
      ...state.data,
      [modalId]: activeModal
    },
    order: [...state.order, modalId],
  })
}



export const ModalReducer = (state=initState, action) => {
  switch (action.type) {

    case ActionList.turnOnModal:
      return reducerTurnOnModal(state, action)

    default:
      return state
  }
}


