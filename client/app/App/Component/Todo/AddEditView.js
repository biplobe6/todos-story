import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { ActionAddTodo, ActionEditTodo } from 'Redux/Actions/TodoAction';
import HelpText from 'Component/Input/HelpText';


class TodoAddEditView extends Component {
  constructor(props) {
    super(props);
    this.inputRef = null;
    this.containerRef = null;
    this.inputRefHandler = ref => this.inputRef = ref;
    this.containerRefHandler = ref => this.containerRef = ref;

    this.focusAtInput = this.focusAtInput.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.saveTodo = this.saveTodo.bind(this);
    this.docClickHandler = this.docClickHandler.bind(this);

    this.state = {
      form: {
        title: '',
        story: '',
      },
      error: false,
    }
  }

  docClickHandler(event){
    const isInside = this.containerRef.contains(event.target)
    if(isInside) return;

    const {closeView} = this.props;
    closeView()
  }

  onChangeHandler(event){
    const {name, value} = event.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      }
    })
  }

  saveTodo(){
    const {addTodo, editTodo, closeView, project, todo, parent} = this.props;
    const saveTodo = todo ? editTodo : addTodo;

    const onSuccess = todo ? closeView : () => {
      this.setState({
        form: {
          title: '',
          story: '',
        }
      }, this.focusAtInput)
    }

    const onError = ({error}) => {
      this.setState({
        error: error.response.data
      })
    }

    const payload = {
      ...this.state.form,
      project: project.id,
      ...(todo ? {
        id: todo.id
      } : {}),
      ...(parent ? {
        parent: parent.id
      } : {}),
    }

    saveTodo({
      payload,
      onSuccess,
      onError,
    })
  }

  handleKeyPress(event){
    const {closeView} = this.props;
    const {tagName} = event.target;

    const enterKey = (event.key == 'Enter') && (
      (tagName == 'INPUT') || (
        (tagName == 'TEXTAREA') && event.ctrlKey
      )
    )

    if(event.key == 'Escape'){
      return closeView()
    }

    if(enterKey){
      return this.saveTodo()
    }
  }

  focusAtInput(){
    this.inputRef.focus()
  }


  componentDidMount(){
    this.focusAtInput();
    document.addEventListener('click', this.docClickHandler)
    const {todo} = this.props;
    if(!todo) return;

    this.setState({
      form: {
        title: todo.title,
        story: todo.story,
      }
    })
  }

  componentWillUnmount(){
    document.removeEventListener('click', this.docClickHandler)
  }


  render(){
    const {closeView, todo} = this.props;
    const {form, error} = this.state;
    return (
      <div
        className={"add-todo" + (todo ? " edit-view" : "")}
        ref={this.containerRefHandler}>
        <div className="menu-container left">
          <span
            title="close"
            className="menu"
            onClick={closeView}>
            <i className="fa fa-window-close"></i>
          </span>
          <span
            title="Save"
            className="menu"
            onClick={this.saveTodo}>
            <i className="fa fa-check"></i>
          </span>
        </div>
        <input
          type="text"
          name="title"
          title="Title"
          value={form.title}
          placeholder="Todo"
          autoComplete="off"
          ref={this.inputRefHandler}
          onKeyDown={this.handleKeyPress}
          onChange={this.onChangeHandler} />
        <HelpText
          error={error}
          name="title"
          id="title" />
        <textarea
          className="mt-1"
          placeholder="Story"
          name="story"
          title="Story"
          autoComplete="off"
          value={form.story}
          onKeyDown={this.handleKeyPress}
          onChange={this.onChangeHandler} />
      </div>
    );

  }
}

TodoAddEditView.propTypes = {

};


const mapDispatchToProps = {
  addTodo: ActionAddTodo,
  editTodo: ActionEditTodo,
}

export default connect(null, mapDispatchToProps)(
  TodoAddEditView
);
