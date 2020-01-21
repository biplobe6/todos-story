import React, { Component } from 'react';
import PropTypes from 'prop-types';


import ProjectFormHelper from 'App/Form/Project/Helper';


const EditView = ({project, closeEditView}) => {
  return (
    <div>
      <ProjectFormHelper project={project} onSuccess={closeEditView}>
        {({TitleField, DescriptionField, AssetsDirField, onSubmit}) => (
          <form onSubmit={onSubmit}>
            <hr/>
            <TitleField />
            <DescriptionField />
            <AssetsDirField />
            <hr/>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={closeEditView}>
              Close
            </button>
            <button
              className="btn btn-success pull-right"
              type="submit"
              onClick={onSubmit}>
              Save Changes
            </button>
            <hr/>
          </form>
        )}
      </ProjectFormHelper>
    </div>
  );
}

EditView.propTypes = {

};

export default EditView;
