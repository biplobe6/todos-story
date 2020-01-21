import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ActionModalTurnOn } from 'Redux/Actions/ModalAction';

const ButtonAddProject = ({turnOnModal}) => {
  return (
    <button
      title="Add Project"
      id="add-project-button"
      data-target-modal="project"
      data-back-drop="true"
      onClick={turnOnModal}>
      <div className="content">+</div>
    </button>
  );
};

ButtonAddProject.propTypes = {
};


const mapDispatchToProps = {
  turnOnModal: ActionModalTurnOn,
}
export default connect(null, mapDispatchToProps)(
  ButtonAddProject
);
