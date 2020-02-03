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
            key={project.alias}
            updatedAt={project.updatedAt}
            project={project}
            getTodos={this.props.getTodos}
            deleteProject={this.props.deleteProject} />
        ))}
      </div>
    )
  }
};


const mapStateToProps = ({project}) => ({
  projectList: project.list,
})
const mapDispatchToProps = {
  getTodos: ActionGetTodos,
  getProjectList: ActionGetProjectList,
  deleteProject: ActionDeleteProject,
}
export default connect(mapStateToProps, mapDispatchToProps)(
  ProjectList
);
