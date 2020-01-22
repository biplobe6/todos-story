import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { ActionAddTodo } from 'Redux/Actions/TodoAction';


class TodoAddView extends Component {
  constructor(props) {
    super(props);
    this.inputRef = null;
    this.inputRefHandler = ref => this.inputRef = ref;

    this.focusAtInput = this.focusAtInput.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
    this.addTodo = this.addTodo.bind(this);

    this.state = {
      form: {
        title: '',
      }
    }
  }

  handleInputChange(event){
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
        }
      }, this.focusAtInput)
    }
    addTodo({
      payload: {
        ...this.state.form,
        project: project.id,
      },
      onSuccess,
    })
  }

  handleInputKeyPress(event){
    const {closeView} = this.props;

    switch (event.key) {
      case 'Escape':
        return closeView()

      case 'Enter':
        return this.addTodo()

      default:
        return;
    }
  }

  focusAtInput(){
    this.inputRef.focus()
  }


  componentDidMount(){
    this.focusAtInput();
  }


  render(){
    const {closeView} = this.props;
    const {form} = this.state;
    return (
      <div className="add-todo">
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
          ref={this.inputRefHandler}
          onKeyDown={this.handleInputKeyPress}
          onChange={this.handleInputChange} />
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
