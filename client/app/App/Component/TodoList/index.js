import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionGetTodos } from 'Redux/Actions/TodoAction';

class TodoList extends Component {
  componentDidMount(){
    this.props.getTodos()
  }

  render(){
    const {todo} = this.props;
    return todo.map(({id, title}) => (
      <div key={id}>
        {title}
      </div>
    ))
  }
};


const mapStateToProps = ({todo}) => ({todo})
const mapDispatchToProps = {
  getTodos: ActionGetTodos,
}
export default connect(mapStateToProps, mapDispatchToProps)(
  TodoList
);
