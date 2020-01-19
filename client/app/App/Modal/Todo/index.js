import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _get from 'lodash/get';

import modalConnector from '../Connector';
import { ActionAddTodo } from 'Redux/Actions/TodoAction';

import InputField from 'Component/Input/InputField';
import TextField from 'Component/Input/TextField';

class ModalTodo extends Component {
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
        story: '',
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
    this.props.addTodo({
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
            <h5 className="modal-title" id="exampleModalLabel">Add Todo</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
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
                id='todo-title'
                value={form.title}
                placeholder='Todo title'
                title='Todo title/header'
                onChange={this.changeHandler} />
              <TextField
                error={error}
                id="todo-story"
                label="Story"
                name="story"
                placeholder="Todo story"
                title="Todo Story"
                value={form.story}
                onChange={this.changeHandler}
                helpText="Story of this todo." />
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
              {loading ? (
                <span>
                  <span
                    role="status"
                    aria-hidden="true"
                    className="spinner-border spinner-border-sm" /> Saving...
                </span>
              ) : (
                done ? (
                  <span>
                    <i className="fa fa-check" aria-hidden="true" /> Done
                  </span>
                ) : (
                  error ? (
                    <span>Try again</span>
                  ) : (
                    <span>Save changes</span>
                  )
                )
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
};

ModalTodo.propTypes = {

};

const mapDispatchToProps = {
  addTodo: ActionAddTodo,
}
export default modalConnector({id: 'todo'})(
  connect(null, mapDispatchToProps)(ModalTodo)
);
