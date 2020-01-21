import React from 'react';
import PropTypes from 'prop-types';

import Todo from 'App/Component/Todo';


const TodoList = ({todoList, project}) => {
  return (
    todoList.map(todo => (
      <Todo
        key={todo.id}
        todo={todo}
        project={project} />
    ))
  );
};

TodoList.propTypes = {

};

export default TodoList;

