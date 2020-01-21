import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionGetTodos } from 'Redux/Actions/TodoAction';
import {
  ActionGetProjectList,
  ActionDeleteProject,
} from 'Redux/Actions/ProjectAction';

import Project from 'App/Component/Project';

class ProjectList extends Component {
  componentDidMount(){
    this.props.getTodos()
    this.props.getProjectList()
  }

  render(){
    const {projectList, deleteProject} = this.props;
    return (
      <div id="todo-list-container">
        {projectList.map((project) => (
          <Project
            key={project.id}
            project={project}
            deleteProject={deleteProject} />
        ))}
      </div>
    )
  }
};


const mapStateToProps = ({project}) => ({projectList: project.list})
const mapDispatchToProps = {
  getTodos: ActionGetTodos,
  getProjectList: ActionGetProjectList,
  deleteProject: ActionDeleteProject,
}
export default connect(mapStateToProps, mapDispatchToProps)(
  ProjectList
);
