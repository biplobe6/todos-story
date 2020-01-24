import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AcitonDeleteTodo } from 'Redux/Actions/TodoAction';
import TodoList from '../TodoList';
import TodoAddEditView from './AddEditView';

class Todo extends Component {
  constructor(props) {
    super(props);

    this.deleteTodo = this.deleteTodo.bind(this);
    this.toggleDetailsViewHandler = this.toggleDetailsViewHandler.bind(this);
    this.toggleEditView = this.toggleEditView.bind(this);
    this.toggleAddView = this.toggleAddView.bind(this);

    this.state = {
      addView: false,
      editView: false,
      detailsView: false,
      subMenuExpended: false,
    }
  }

  deleteTodo(){
    const confirmation = confirm("Do you want to delete this?")
    if(!confirmation) return;

    const {deleteTodo, todo} = this.props;
    deleteTodo(todo)
  }

  toggleDetailsViewHandler(event){
    this.setState(({detailsView}) => ({
      detailsView: !detailsView,
    }))
  }

  toggleEditView(event){
    this.setState(({editView}) => ({
      editView: !editView,
    }))
  }

  toggleAddView(event){
    this.setState(({addView}) => ({
      addView: !addView
    }))
  }

  render() {
    const {todo, project} = this.props;
    const {title, id, story, subTask} = todo;
    const {addView, editView, detailsView, subMenuExpended} = this.state;
    return (
      <Fragment>
        {!editView && (
          <div className="todo-short-info">
            <div className="left menu-container">
              <span className="menu">
                <i className={`fa fa-angle-double-${subMenuExpended ? 'down' : 'right'}`} />
              </span>
              <span className="menu checkbox"><input type="checkbox" /></span>
            </div>
            <div className="todo-info">
              <div
                title={story}
                className="short-view title"
                onDoubleClick={this.toggleEditView}
                onClick={this.toggleDetailsViewHandler}>
                <span>[#{id}] </span>
                <span>{title}</span>
              </div>
              {detailsView && (
                <div className="story">{story}</div>
              )}
            </div>
            {addView && (
              <TodoAddEditView
                parent={todo}
                project={project}
                closeView={this.toggleAddView} />
            )}
            <div className="right menu-container">
              <span className="menu" onClick={this.toggleAddView}>
                {addView && (
                  <i title="Close" className="fa fa-window-close" />
                ) || (
                  <i title="Add Subtask" className="fa fa-plus" />
                )}
              </span>
              <span onClick={this.toggleEditView} className="menu">
                <i title="Edit" className="fa fa-edit" />
              </span>
              <span
                title="Delete"
                onClick={this.deleteTodo}
                className="menu"><i className="fa fa-trash" /></span>
              <span title="Move" className="menu move"><i className="fa fa-arrows" /></span>
            </div>
          </div>
        )}
        {editView && (
          <TodoAddEditView
            todo={todo}
            project={project}
            closeView={this.toggleEditView} />
        )}
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
