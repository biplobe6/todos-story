import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionGetTodos } from 'Redux/Actions/TodoAction';
import {
  ActionGetProjectList,
  ActionDeleteProject,
  ActionOnDragTodo,
} from 'Redux/Actions/ProjectAction';

import Project from 'App/Component/Project';

class ProjectList extends Component {
  componentDidMount(){
    this.props.getProjectList()
  }

  render(){
    const {projectList} = this.props;
    return (
      <div id="todo-list-container">
        {projectList.map((project) => (
          <Project
            key={project.id}
            updatedAt={project.updatedAt}
            project={project}
            getTodos={this.props.getTodos}
            draggingTodo={this.props.draggingTodo}
            deleteProject={this.props.deleteProject}
            updateDraggingTodo={this.props.updateDraggingTodo} />
        ))}
      </div>
    )
  }
};


const mapStateToProps = ({project}) => ({
  projectList: project.list,
  draggingTodo: project.draggingTodo,
})
const mapDispatchToProps = {
  getTodos: ActionGetTodos,
  getProjectList: ActionGetProjectList,
  deleteProject: ActionDeleteProject,
  updateDraggingTodo: ActionOnDragTodo,
}
export default connect(mapStateToProps, mapDispatchToProps)(
  ProjectList
);
