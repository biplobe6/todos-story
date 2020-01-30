import React, { Component } from 'react';
import PropTypes from 'prop-types';


const nullFn = () => {}


class DragNDrop extends Component {
  constructor(props) {
    super(props);

    this.dragOverCount = 0;
    this.onDragEnterId = null;

    this.onDragStartHandler = this.onDragStartHandler.bind(this);
    this.onDragOverHandler = this.onDragOverHandler.bind(this);
    this.onDragEnterHandler = this.onDragEnterHandler.bind(this);
    this.onDragLeaveHandler = this.onDragLeaveHandler.bind(this);
    this.onDragEndHandler = this.onDragEndHandler.bind(this);
    this.onDropHandler = this.onDropHandler.bind(this);

    this.dropZoneHandlers = {
      onDragOver: this.onDragOverHandler,
      onDragEnter: this.onDragEnterHandler,
      onDragLeave: this.onDragLeaveHandler,
      onDrop: this.onDropHandler,
    }

    this.state = {
      dragging: false,
      dropZoneEnabled: false,
    }
  }

  onDragStartHandler(event){
    this.setState({
      dragging: true,
    })
    this.props.onDragStart(event)
  }

  onDragOverHandler(event){
    event.preventDefault();
    this.props.onDragOver(event);
  }

  onDragEnterHandler(event){
    if(this.state.dragging) return;

    if(this.dragOverCount == 0){
      this.setState(({dropZoneEnabled}) => {
        if(dropZoneEnabled) return;

        if(this.onDragEnterId != null){
          clearTimeout(this.onDragEnterId);
          this.onDragEnterId = null;
        }

        this.onDragEnterId = setTimeout(() => {
          this.setState(() => ({
            dropZoneEnabled: true,
          }), () => {
            this.props.onDragEnter();
            this.onDragEnterId = null;
          })
        }, this.props.delay)
      })
    }
    this.dragOverCount++;
  }

  onDragLeaveHandler(event){
    if(this.state.dragging) return;
    this.dragOverCount--

    if(this.dragOverCount == 0){
      if(this.onDragEnterId != null){
        clearTimeout(this.onDragEnterId);
        this.onDragEnterId = null;
      }
      this.setState(({dropZoneEnabled}) => {
        if(!dropZoneEnabled) return;

        this.props.onDragLeave();
        return ({
          dropZoneEnabled: false
        })
      })
    }
  }

  onDragEndHandler(event){
    this.setState({
      dragging: false
    })
    this.props.onDragEnd(null)
  }

  onDropHandler(event){
    this.dragOverCount = 0
    this.setState({
      dropZoneEnabled: false
    })
    this.props.onDrop(event)
  }

  render() {
    const {dropZoneEnabled, dragging} = this.state;
    return this.props.children({
      dragging,
      dropZoneEnabled,
      dropZoneHandlers: this.dropZoneHandlers,
      onDragStartHandler: this.onDragStartHandler.bind(this),
      onDragOverHandler: this.onDragOverHandler.bind(this),
      onDragEnterHandler: this.onDragEnterHandler.bind(this),
      onDragLeaveHandler: this.onDragLeaveHandler.bind(this),
      onDragEndHandler: this.onDragEndHandler.bind(this),
      onDropHandler: this.onDropHandler.bind(this),
    })
  }
}

DragNDrop.propTypes = {
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDrop: PropTypes.func,
  delay: PropTypes.number,
};


DragNDrop.defaultProps = {
  onDragStart: nullFn,
  onDragOver: nullFn,
  onDragEnter: nullFn,
  onDragLeave: nullFn,
  onDragEnd: nullFn,
  onDrop: nullFn,
  delay: 500,
}


export default DragNDrop;