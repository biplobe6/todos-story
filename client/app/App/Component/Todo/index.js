import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AcitonDeleteTodo } from 'Redux/Actions/TodoAction';
import { connect } from 'react-redux';
import DetailsView from './DetailsView';
import EditView from './EditView';

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
    const {todo} = this.props;
    const {title, id} = todo;
    const {editView, detailsView, subMenuExpended} = this.state;
    return (
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
