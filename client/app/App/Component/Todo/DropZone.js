import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TodoDropZone extends Component {
  constructor(props) {
    super(props);

    this.onDropHandler = this.onDropHandler.bind(this);
  }

  onDropHandler(event){
    this.props.onDrop(event)
    this.props.onDropHandler(event)
  }

  render(){
    const {enable, onDropHandler: _, ...props} = this.props;
    return enable ? (
      <div {...props}
        className="drop-zone"
        onDrop={this.onDropHandler} />
    ) : null;
  }
}

TodoDropZone.propTypes = {
  onDropHandler: PropTypes.func,
};

TodoDropZone.defaultProps = {
  onDropHandler: () => {},
};


export default TodoDropZone;
