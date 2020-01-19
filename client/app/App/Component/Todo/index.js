import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Todo extends Component {
  render() {
    const {title} = this.props.todo;
    return (
      <div className="todo-short-info">
        <span className="menu"><i className="fa fa-angle-double-right" /></span>
        <span className="checkbox"><input type="checkbox" /></span>
        <span className="title">{title}</span>
        <span className="menu-container">
          <span className="menu move"><i className="fa fa-arrows" /></span>
          <span className="menu"><i className="fa fa-trash" /></span>
          <span className="menu"><i className="fa fa-edit" /></span>
          <span className="menu"><i className="fa fa-plus" /></span>
        </span>
      </div>
    );
  }
}

Todo.propTypes = {
  todo: PropTypes.shape({
    title: PropTypes.string.isRequired
  }).isRequired
};

export default Todo;
