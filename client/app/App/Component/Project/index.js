import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditView from './EditView';
import TodoList from '../TodoList';
import TodoAddEditView from '../Todo/AddEditView';

class Project extends Component {
  constructor(props) {
    super(props);

    this.toggleView = this.toggleView.bind(this);
    this.toggleEditView = this.toggleEditView.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.showTodoAddView = this.showTodoAddView.bind(this);
    this.hideTodoAddView = this.hideTodoAddView.bind(this);

    this.state = {
      showTodoList: false,
      editView: false,
      todoAddView: false,
    }
  }

  showTodoAddView(event){
    this.setState({
      todoAddView: true,
    })
  }

  hideTodoAddView(event){
    this.setState({
      todoAddView: false,
    })
  }

  toggleView(event){
    const {showTodoList} = this.state;
    const {getTodos, project} = this.props;

    if(!showTodoList){
      getTodos(project)
    }
    this.setState({
      showTodoList: !showTodoList
    })
  }

  toggleEditView(event){
    this.setState(({editView}) => ({
      editView: !editView
    }))
  }

  deleteHandler(event){
    const confirmDelete = confirm('Do you want to delete this project?')
    if(!confirmDelete) return
    const {project, deleteProject} = this.props;
    deleteProject(project)
  }

  render() {
    const {showTodoList, editView, todoAddView} = this.state;
    const {project} = this.props;
    const {title, description, id, todoList} = project;
    return (
      <div className="project-view">
        <div className="left menu-container">
          <span className="menu">
            <i className={`fa fa-angle-double-${showTodoList ? 'down' : 'right'}`}></i>
          </span>
        </div>
        <div className="short-info">
          <div className="title" onClick={this.toggleView}>
            <span>[#{id}] </span>
            <span title={description}>{title}</span>
          </div>
          {editView && (
            <EditView
              project={project}
              closeEditView={this.toggleEditView} />
          )}
          {todoAddView && (
            <TodoAddEditView
              project={project}
              closeView={this.hideTodoAddView} />
          )}
          {showTodoList && (
            <TodoList
              project={project}
              todoList={todoList} />
          )}
        </div>
        <div className="right menu-container">
          <span className="menu" onClick={this.showTodoAddView}>
            {todoAddView && (
              <i title="Close" className="fa fa-window-close"></i>
            ) || (
              <i title="Add Todo" className="fa fa-plus"></i>
            )}
          </span>
          <span className="menu" onClick={this.toggleEditView}>
            {(editView && (
              <i title="Close" className="fa fa-window-close"></i>
            )) || (
              <i title="Edit Project" className="fa fa-edit"></i>
            )}
          </span>
          <span
            className="menu"
            title="Delete Project"
            onClick={this.deleteHandler}>
            <i className="fa fa-trash"></i>
          </span>
        </div>
      </div>
    );
  }
}

Project.propTypes = {

};

export default Project;

