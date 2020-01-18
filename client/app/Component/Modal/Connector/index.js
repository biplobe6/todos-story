import React, { Component } from 'react';
import PropTypes from 'prop-types';


export const modals = {}

export const registerModal = ({id, delay=200}) => (Modal) => {

  class ModalConnector extends Component {
    componentDidMount(){
      this.props.showModalHandler()
    }

    render(){
      const {showModalHandler: _, ...props} = this.props;
      return (
        <Modal {...props} />
      )
    }
  }

  modals[id] = ModalConnector;

  return ModalConnector;
}
