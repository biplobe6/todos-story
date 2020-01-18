import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ActionModalTurnOn } from 'Redux/Actions/ModalAction';

const AddTodoButton = ({turnOnModal}) => {
  return (
    <button
      title="Add Todo"
      id="add-todo-button"
      data-target-modal="todo"
      data-back-drop="true"
      onClick={turnOnModal}>
      <div className="content">+</div>
    </button>
  );
};

AddTodoButton.propTypes = {
};


const mapDispatchToProps = {
  turnOnModal: ActionModalTurnOn,
}
export default connect(null, mapDispatchToProps)(
  AddTodoButton
);
