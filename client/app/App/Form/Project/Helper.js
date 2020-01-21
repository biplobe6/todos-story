import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _get from 'lodash/get';

import { ActionAddProject } from 'Redux/Actions/ProjectAction';
import InputField from 'Component/Input/InputField';
import TextField from 'Component/Input/TextField';

class ProjectFormHelper extends Component {
  constructor(props) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);

    this.titleField = this.titleField.bind(this);
    this.descriptionField = this.descriptionField.bind(this);
    this.assetsDirField = this.assetsDirField.bind(this);

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

  titleField(props){
    const {form, error} = this.state;
    return (
      <InputField
        {...props}
        type='text'
        name='title'
        label='Title'
        error={error}
        id='project-title'
        value={form.title}
        placeholder='Project title'
        title='Prject Name'
        helpText='Project name/title'
        onChange={this.changeHandler} />
    )
  }

  descriptionField(props){
    const {form, error} = this.state;
    return (
      <TextField
        {...props}
        error={error}
        id="project-story"
        label="Description"
        name="description"
        placeholder="Project description"
        title="Project Description"
        value={form.description}
        onChange={this.changeHandler}
        helpText="A little description about this project." />
    )
  }


  assetsDirField(props){
    const {form, error} = this.state;
    return (
      <InputField
        {...props}
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
    )
  }

  submitHandler(event){
    event.preventDefault();
    const {onSuccess, onError} = this.props;

    this.props.addProject({
      getPayload: () => this.state.form,
      onSuccess: (response) => {
        this.setState({
          loading: false,
          done: true
        }, onSuccess)
      },
      onError: (error) => {
        this.setState({
          error: _get(error, 'error.response.data', true),
          loading: false
        }, onError)
      }
    })
    this.setState({
      loading: true,
      error: false,
    })
  }

  render() {
    return this.props.children({
      ...this.state,
      onChange: this.changeHandler,
      onSubmit: this.submitHandler,

      TitleField: this.titleField,
      DescriptionField: this.descriptionField,
      AssetsDirField: this.assetsDirField,
    })
  }
}


const nullFunc = () => {}

ProjectFormHelper.defaultProps = {
  onSuccess: nullFunc,
  onError: nullFunc
}

ProjectFormHelper.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

const mapDispatchToProps = {
  addProject: ActionAddProject,
}
export default connect(null, mapDispatchToProps)(
  ProjectFormHelper
);
