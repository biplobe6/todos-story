import React, { Fragment } from 'react';
import PropTypes from 'prop-types';


import "Styles/app.scss"
import AddTodoButton from 'App/Component/AddTodoButton';
import TodoList from 'App/Component/TodoList';


const Hello = props => {
  return (
    <Fragment>
      <TodoList />
      <AddTodoButton />
    </Fragment>
  );
};

Hello.propTypes = {
};


export default Hello;
