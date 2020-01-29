import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DropZone extends Component {
  constructor(props) {
    super(props);

    this.desableId = null;

    this.state = {
      enable: false,
    }
  }


  componentDidUpdate(prevProps, prevState) {
    if(prevProps.enable !== this.props.enable){
      if(this.props.enable){
        if(this.desableId != null){
          clearTimeout(this.desableId);
          this.desableId = null;
        }
        this.setState({
          enable: true,
        })
      } else {
        this.desableId = setTimeout(() => {
          this.setState({
            enable: false,
          })
          this.desableId = null;
        }, this.props.delay)
      }
    }
  }


  render() {
    return this.state.enable ? (
      this.props.children
    ) : null;
  }
}

DropZone.propTypes = {
  delay: PropTypes.number,
};

DropZone.defaultProps = {
  delay: 1000,
};

export default DropZone;
