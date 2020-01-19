import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionGetTodos } from 'Redux/Actions/TodoAction';

import Todo from 'App/Component/Todo';

class TodoList extends Component {
  componentDidMount(){
    this.props.getTodos()
  }

  render(){
    const {todos} = this.props;
    return (
      <div id="todo-list-container">
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo} />
        ))}
      </div>
    )
  }
};


const mapStateToProps = ({todo}) => ({todos: todo.list})
const mapDispatchToProps = {
  getTodos: ActionGetTodos,
}
export default connect(mapStateToProps, mapDispatchToProps)(
  TodoList
);
