import React from 'react';
import PropTypes from 'prop-types';

const AddTodoButton = props => {
  return (
    <button
      id="add-todo-button"
      title="Add Todo">
      <div className="content">+</div>
    </button>
  );
};

AddTodoButton.propTypes = {
};

export default AddTodoButton;
