import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import {
  AcitonDeleteTodo,
  ActionOnDragTodo,
  ActionOnDropTodo,
  ActionUpdateTodo,
  ActionStartCountdown,
  ActionStopCountdown
} from 'Redux/Actions/TodoAction';
import TodoList from '../TodoList';
import TodoAddEditView from './AddEditView';
import DragNDrop from 'Component/DragNDrop';
import TodoDropZone from './DropZone';
import { DIRECTION } from 'App/ProjectManager/position/createNew';
import Duration from './Duration';

class Todo extends Component {
  constructor(props) {
    super(props);

    this.deleteTodo = this.deleteTodo.bind(this);
    this.toggleDetailsViewHandler = this.toggleDetailsViewHandler.bind(this);
    this.toggleEditView = this.toggleEditView.bind(this);
    this.toggleAddView = this.toggleAddView.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);

    this.onDragStartHandler = this.onDragStartHandler.bind(this);
    this.onDragEndHandler = this.onDragEndHandler.bind(this);
    this.onDropUp = this.onDropUp.bind(this);
    this.onDropDown = this.onDropDown.bind(this);
    this.onDropChild = this.onDropChild.bind(this);

    this.state = {
      addView: false,
      editView: false,
      detailsView: true,
      subMenuExpended: false,
    }
  }

  onDragStartHandler(event){
    this.props.updateDraggingTodo(this.props.todo)
  }

  onDragEndHandler(event){
    this.props.updateDraggingTodo(null)
  }

  onDropUp(e){
    this.props.onDropTodo({
      todoToMove: this.props.draggingTodo,
      referenceTodo: this.props.todo,
      direction: DIRECTION.UP,
    })
  }

  onDropDown(e){
    this.props.onDropTodo({
      todoToMove: this.props.draggingTodo,
      referenceTodo: this.props.todo,
      direction: DIRECTION.DOWN,
    })
  }

  onDropChild(e){
    this.props.onDropTodo({
      todoToMove: this.props.draggingTodo,
      referenceTodo: this.props.todo,
      direction: DIRECTION.CHILD,
    })
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

  toggleStatus(event){
    this.props.updateTodoData({
      alias: this.props.todo.alias,
      done: event.target.checked,
    })
  }

  render() {
    const {
      todo,
      project,
      startCountdown,
      stopCountdown,
      updateTodoData
    } = this.props;
    const {title, rq, story, subTask, done, progress} = todo;
    const {
      addView,
      editView,
      detailsView,
    } = this.state;
    return (
      <DragNDrop
        onDragStart={this.onDragStartHandler}
        onDragEnd={this.onDragEndHandler}>
        {(drag) => (
          <Fragment>
            <TodoDropZone
              {...drag.dropZoneHandlers}
              onDropHandler={this.onDropUp}
              enable={drag.dropZoneEnabled} />
            {!editView && (
              <div
                draggable
                className={(
                  "todo-short-info" +
                  (done ? " done": '') +
                  (drag.dropZoneEnabled ? " over" : '')
                )}
                onDragEnd={drag.onDragEndHandler}
                onDragStart={drag.onDragStartHandler}>
                <div className="left menu-container">
                  <span className="menu">
                    <i className={`fa fa-angle-double-${detailsView ? 'down' : 'right'}`} />
                  </span>
                  <span className="menu checkbox">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={this.toggleStatus} />
                  </span>
                </div>
                <div className="todo-info">
                  <div
                    title={story}
                    {...drag.dropZoneHandlers}
                    className="short-view title"
                    onDoubleClick={this.toggleEditView}
                    onClick={this.toggleDetailsViewHandler}>
                    <span className="text-muted">[#{rq} ({progress}%)] </span>
                    <span>{title}</span>
                  </div>
                  {detailsView && (
                    <div className="story text-muted">
                      {story.split('\n').map((text) => (
                        <p className="mb-0" key={text}>{text}</p>
                      ))}
                    </div>
                  )}
                  <TodoDropZone
                    {...drag.dropZoneHandlers}
                    onDropHandler={this.onDropChild}
                    enable={drag.dropZoneEnabled} />
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
                  <Duration
                    todo={todo}
                    startCountdown={startCountdown}
                    updateTodoData={updateTodoData}
                    stopCountdown={stopCountdown} />
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
            <TodoDropZone
              {...drag.dropZoneHandlers}
              onDropHandler={this.onDropDown}
              enable={drag.dropZoneEnabled} />
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


const mapStateToProps = ({project}) => ({
  draggingTodo: project.draggingTodo,
})
const mapDispatchToProps = {
  deleteTodo: AcitonDeleteTodo,
  updateDraggingTodo: ActionOnDragTodo,
  onDropTodo: ActionOnDropTodo,
  updateTodoData: ActionUpdateTodo,
  startCountdown: ActionStartCountdown,
  stopCountdown: ActionStopCountdown,
}
export default connect(mapStateToProps, mapDispatchToProps)(
  Todo
);
