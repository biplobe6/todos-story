import React, { Fragment } from 'react';
import PropTypes from 'prop-types';


import "Styles/app.scss"
import AddTodoButton from 'App/Component/AddTodoButton';
import TodoList from 'App/Component/TodoList';
import ModalPlaceHolder from 'Component/Modal/PlaceHolder';

import './Modal/Todo';


const App = props => {
  return (
    <Fragment>
      <TodoList />
      <AddTodoButton />
      <ModalPlaceHolder />
    </Fragment>
  );
};

App.propTypes = {
};

export default App;
