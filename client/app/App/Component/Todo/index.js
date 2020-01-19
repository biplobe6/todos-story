import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AcitonDeleteTodo } from 'Redux/Actions/TodoAction';
import { connect } from 'react-redux';

class Todo extends Component {
  constructor(props) {
    super(props);

    this.deleteTodo = this.deleteTodo.bind(this);
  }

  deleteTodo(){
    const {deleteTodo, todo} = this.props;
    deleteTodo(todo)
  }

  render() {
    const {title} = this.props.todo;
    return (
      <div className="todo-short-info">
        <span className="menu"><i className="fa fa-angle-double-right" /></span>
        <span className="checkbox"><input type="checkbox" /></span>
        <span className="title">{title}</span>
        <span className="menu-container">
          <span className="menu move"><i className="fa fa-arrows" /></span>
          <span
            className="menu"
            onClick={this.deleteTodo}>
            <i className="fa fa-trash" />
          </span>
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


const mapDispatchToProps = {
  deleteTodo: AcitonDeleteTodo
}
export default connect(null, mapDispatchToProps)(
  Todo
);
