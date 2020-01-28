import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TodoList from '../TodoList';
import TodoAddEditView from './AddEditView';
import { AcitonDeleteTodo } from 'Redux/Actions/TodoAction';
import DragNDrop from 'Component/DragNDrop';

class Todo extends Component {
  constructor(props) {
    super(props);

    this.deleteTodo = this.deleteTodo.bind(this);
    this.toggleDetailsViewHandler = this.toggleDetailsViewHandler.bind(this);
    this.toggleEditView = this.toggleEditView.bind(this);
    this.toggleAddView = this.toggleAddView.bind(this);

    this.onDragStartHandler = this.onDragStartHandler.bind(this);
    this.onDragEndHandler = this.onDragEndHandler.bind(this);
    this.onDropHandler = this.onDropHandler.bind(this);

    this.state = {
      addView: false,
      editView: false,
      detailsView: false,
      subMenuExpended: false,
    }
  }

  onDragStartHandler(event){
    this.props.updateDraggingTodo(this.props.todo)
  }

  onDragEndHandler(event){
    this.props.updateDraggingTodo(null)
  }

  onDropHandler(event){
    console.log('dropped in todo')
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
    const {todo, project, draggingTodo, updateDraggingTodo} = this.props;
    const {title, id, story, subTask} = todo;
    const {addView, editView, detailsView, subMenuExpended} = this.state;
    return (
      <DragNDrop
        onDragStart={this.onDragStartHandler}
        onDragEnd={this.onDragEndHandler}
        onDrop={this.onDropHandler}>
        {(drag) => (
          <Fragment>
            {!editView && (
              <div
                draggable
                className="todo-short-info"
                onDragEnd={drag.onDragEndHandler}
                onDragStart={drag.onDragStartHandler}>
                <div className="left menu-container">
                  <span className="menu">
                    <i className={`fa fa-angle-double-${subMenuExpended ? 'down' : 'right'}`} />
                  </span>
                  <span className="menu checkbox"><input type="checkbox" /></span>
                </div>
                <div className="todo-info">
                  <div
                    title={story}
                    {...drag.dropZoneHandlers}
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
                  todoList={subTask}
                  draggingTodo={draggingTodo}
                  updateDraggingTodo={updateDraggingTodo} />
              </div>
            )}
            {drag.dropZoneEnabled && (
              <div className="drop-zone" />
            )}
          </Fragment>
        )}
      </DragNDrop>
    );
  }
}

Todo.propTypes = {
  todo: PropTypes.shape({
    title: PropTypes.string.isRequired
  }).isRequired
};


const mapDispatchToProps = {
  deleteTodo: AcitonDeleteTodo,
}
export default connect(null, mapDispatchToProps)(
  Todo
);
