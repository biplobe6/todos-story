import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropZone from 'Component/DragNDrop/DropZone';

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
    return (
      <DropZone enable={enable}>
        <div className="drop-zone" {...props} onDrop={this.onDropHandler} />
      </DropZone>
    );
  }
}

TodoDropZone.propTypes = {
  onDropHandler: PropTypes.func,
};

TodoDropZone.defaultProps = {
  onDropHandler: () => {},
};


export default TodoDropZone;
