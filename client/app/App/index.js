import React, { Fragment } from 'react';
import PropTypes from 'prop-types';


import "Styles/app.scss"
import ButtonAddProject from 'App/Component/ButtonAddProject';
import ProjectList from 'App/Component/ProjectList';
import ModalPlaceHolder from 'Component/Modal/PlaceHolder';

import './Modal/Project';


const App = props => {
  return (
    <Fragment>
      <ProjectList />
      <ButtonAddProject />
      <ModalPlaceHolder />
    </Fragment>
  );
};

App.propTypes = {
};

export default App;
