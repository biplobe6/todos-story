import React from 'react';
import PropTypes from 'prop-types';

const DetailsView = ({todo: {title, story}, toggleHandler}) => {
  return (
    <div className="expended-view">
      <div
        onClick={toggleHandler}
        className="title">{title}</div>
      <div className="story">{story}</div>
    </div>
  );
};

DetailsView.propTypes = {

};

export default DetailsView;

