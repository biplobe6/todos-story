import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AcitonDeleteTodo } from 'Redux/Actions/TodoAction';
import { connect } from 'react-redux';
import DetailsView from './DetailsView';

class Todo extends Component {
  constructor(props) {
    super(props);

    this.deleteTodo = this.deleteTodo.bind(this);
    this.toggleDetailsViewHandler = this.toggleDetailsViewHandler.bind(this);

    this.state = {
      expended: false,
      subMenuExpended: false,
    }
  }

  deleteTodo(){
    const {deleteTodo, todo} = this.props;
    deleteTodo(todo)
  }

  toggleDetailsViewHandler(event){
    this.setState(({expended}) => ({
      expended: !expended,
    }))
  }

  render() {
    const {todo} = this.props;
    const {title} = todo;
    const {expended, subMenuExpended} = this.state;
    return (
      <div className="todo-short-info">
        <div className="left menu-container">
          <span className="menu">
            <i className={`fa fa-angle-double-${subMenuExpended ? 'down' : 'right'}`} />
          </span>
          <span className="menu checkbox"><input type="checkbox" /></span>
        </div>
        <div className="todo-info">
          {(expended && (
            <DetailsView
              todo={todo}
              toggleHandler={this.toggleDetailsViewHandler} />
          )) || (
            <div
              onClick={this.toggleDetailsViewHandler}
              className="short-view title">{title}</div>
          )}
        </div>
        <div className="right menu-container">
          <span className="menu"><i className="fa fa-plus" /></span>
          <span className="menu"><i className="fa fa-edit" /></span>
          <span
            className="menu"
            onClick={this.deleteTodo}>
            <i className="fa fa-trash" />
          </span>
          <span className="menu move"><i className="fa fa-arrows" /></span>
        </div>
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
