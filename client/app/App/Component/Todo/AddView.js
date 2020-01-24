import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { ActionAddTodo } from 'Redux/Actions/TodoAction';
import HelpText from 'Component/Input/HelpText';


class TodoAddView extends Component {
  constructor(props) {
    super(props);
    this.inputRef = null;
    this.containerRef = null;
    this.inputRefHandler = ref => this.inputRef = ref;
    this.containerRefHandler = ref => this.containerRef = ref;

    this.focusAtInput = this.focusAtInput.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.addTodo = this.addTodo.bind(this);
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

  addTodo(){
    const {addTodo, project} = this.props;

    const onSuccess = () => {
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

    addTodo({
      payload: {
        ...this.state.form,
        project: project.id,
      },
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
      return this.addTodo()
    }
  }

  focusAtInput(){
    this.inputRef.focus()
  }


  componentDidMount(){
    this.focusAtInput();
    document.addEventListener('click', this.docClickHandler)
  }

  componentWillUnmount(){
    document.removeEventListener('click', this.docClickHandler)
  }


  render(){
    const {closeView} = this.props;
    const {form, error} = this.state;
    return (
      <div
        className="add-todo"
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
            onClick={this.addTodo}>
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

TodoAddView.propTypes = {

};


const mapDispatchToProps = {
  addTodo: ActionAddTodo,
}

export default connect(null, mapDispatchToProps)(
  TodoAddView
);
