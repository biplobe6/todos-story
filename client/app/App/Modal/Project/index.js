import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _get from 'lodash/get';

import modalConnector from '../Connector';
import { ActionAddProject } from 'Redux/Actions/ProjectAction';

import InputField from 'Component/Input/InputField';
import TextField from 'Component/Input/TextField';

class ModalProject extends Component {
  constructor(props) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);

    this.state = {
      loading: false,
      done: false,
      error: false,
      form: {
        title: '',
        description: '',
        assets_dir: '',
      }
    }
  }

  changeHandler(event){
    const {name, value} = event.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      }
    })
  }

  submitHandler(event){
    event.preventDefault()
    const {modalClose} = this.props;
    this.props.addProject({
      getPayload: () => this.state.form,
      onSuccess: (response) => {
        this.setState({
          loading: false,
          done: true
        }, modalClose)
      },
      onError: (error) => {
        this.setState({
          error: _get(error, 'error.response.data', true),
          loading: false
        })
      }
    })
    this.setState({
      loading: true,
      error: false,
    })
  }

  render() {
    const {modalClose} = this.props;
    const {form, loading, done, error} = this.state;
    return (
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
            <form onSubmit={this.submitHandler}>
              <InputField
                type='text'
                name='title'
                label='Title'
                error={error}
                id='project-title'
                value={form.title}
                placeholder='Project title'
                title='Todo Name'
                helpText='Project name/title'
                onChange={this.changeHandler} />
              <TextField
                error={error}
                id="project-story"
                label="Description"
                name="description"
                placeholder="Project description"
                title="Project Description"
                value={form.description}
                onChange={this.changeHandler}
                helpText="A little description about this project." />
              <InputField
                type='text'
                name='assets_dir'
                label='Assets Directory'
                error={error}
                id='project-assets'
                value={form.assets_dir}
                placeholder='Assets Directory'
                title='Assets Directory'
                helpText='Path of a directory for assets'
                onChange={this.changeHandler} />
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
              onClick={this.submitHandler}>
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
    );
  }
};

ModalProject.propTypes = {

};

const mapDispatchToProps = {
  addProject: ActionAddProject,
}
export default modalConnector({id: 'project'})(
  connect(null, mapDispatchToProps)(ModalProject)
);
