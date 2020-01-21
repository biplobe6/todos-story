import React, { Fragment } from 'react';
import PropTypes from 'prop-types';


import "Styles/app.scss"
import ButtonAddProject from 'App/Component/ButtonAddProject';
import TodoList from 'App/Component/TodoList';
import ModalPlaceHolder from 'Component/Modal/PlaceHolder';

import './Modal/Project';


const App = props => {
  return (
    <Fragment>
      <TodoList />
      <ButtonAddProject />
      <ModalPlaceHolder />
    </Fragment>
  );
};

App.propTypes = {
};

export default App;
