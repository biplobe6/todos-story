import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AcitonDeleteTodo } from 'Redux/Actions/TodoAction';
import DetailsView from './DetailsView';
import EditView from './EditView';
import TodoList from '../TodoList';

class Todo extends Component {
  constructor(props) {
    super(props);

    this.deleteTodo = this.deleteTodo.bind(this);
    this.toggleDetailsViewHandler = this.toggleDetailsViewHandler.bind(this);
    this.clickHandlerEdit = this.clickHandlerEdit.bind(this);

    this.state = {
      editView: false,
      detailsView: false,
      subMenuExpended: false,
    }
  }

  deleteTodo(){
    const {deleteTodo, todo} = this.props;
    deleteTodo(todo)
  }

  toggleDetailsViewHandler(event){
    this.setState(({detailsView}) => ({
      detailsView: !detailsView,
    }))
  }

  clickHandlerEdit(event){
    this.setState(({editView}) => ({
      editView: !editView,
    }))
  }

  render() {
    const {todo, project} = this.props;
    const {title, id, subTask} = todo;
    const {editView, detailsView, subMenuExpended} = this.state;
    return (
      <Fragment>
        <div className="todo-short-info">
          <div className="left menu-container">
            <span className="menu">
              <i className={`fa fa-angle-double-${subMenuExpended ? 'down' : 'right'}`} />
            </span>
            <span className="menu checkbox"><input type="checkbox" /></span>
          </div>
          <div className="todo-info">
            {(
              editView && (
                <EditView />
              )
            ) || (
              detailsView && (
                <DetailsView
                  todo={todo}
                  toggleHandler={this.toggleDetailsViewHandler} />
              )
            ) || (
              <div
                title="Click for todo details"
                onClick={this.toggleDetailsViewHandler}
                className="short-view title">
                <span>[#{id}] </span><span>{title}</span>
              </div>
            )}
          </div>
          <div className="right menu-container">
            <span title="Add Subtask" className="menu"><i className="fa fa-plus" /></span>
            <span onClick={this.clickHandlerEdit} className="menu">
              {(
                editView && <i title="Close" className="fa fa-window-close" />
              ) || (
                <i title="Edit" className="fa fa-edit" />
              )}
            </span>
            <span
              title="Delete"
              onClick={this.deleteTodo}
              className="menu"><i className="fa fa-trash" /></span>
            <span title="Move" className="menu move"><i className="fa fa-arrows" /></span>
          </div>
        </div>
        {subTask && subTask.length > 0 && (
          <div className="todo-list">
            <TodoList
              project={project}
              todoList={subTask} />
          </div>
        )}
      </Fragment>
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
