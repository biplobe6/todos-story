import React, { Component } from 'react';
import PropTypes from 'prop-types';

import modalConnector from '../Connector';
import ProjectFormHelper from 'App/Form/Project/Helper';


const ModalProject = ({modalClose}) => {
  return (
    <ProjectFormHelper onSuccess={modalClose}>
      {({loading, done, error, onSubmit, TitleField, DescriptionField, AssetsDirField}) => (
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Project</h5>
              <button
                type="button"
                className="close"
                onClick={modalClose}
                aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit}>
                <TitleField />
                <DescriptionField />
                <AssetsDirField />
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={modalClose}
                className="btn btn-secondary mr-auto"
                data-dismiss="modal">Close</button>
              <button
                type="button"
                className={`btn ${error ? 'btn-danger' : 'btn-primary'}`}
                onClick={onSubmit}>
                {(loading && (
                  <span>
                    <span
                      role="status"
                      aria-hidden="true"
                      className="spinner-border spinner-border-sm" /> Saving...
                  </span>
                )) || (done && (
                  <span>
                    <i className="fa fa-check" aria-hidden="true" /> Done
                  </span>
                )) || (error && (
                  <span>Try again</span>
                )) || (
                  <span>Save changes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProjectFormHelper>
  );
};

ModalProject.propTypes = {

};

export default modalConnector({id: 'project'})(
  ModalProject
);
