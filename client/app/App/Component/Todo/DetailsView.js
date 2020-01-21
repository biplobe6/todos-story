import React from 'react';
import PropTypes from 'prop-types';

const DetailsView = ({todo: {title, story, id}, toggleHandler}) => {
  return (
    <div className="expended-view">
      <div
        onClick={toggleHandler}
        className="title">
        <span>[#{id}] </span><span>{title}</span>
        </div>
      <div className="story">{story}</div>
    </div>
  );
};

DetailsView.propTypes = {

};

export default DetailsView;

