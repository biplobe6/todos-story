import React from 'react';
import { registerModal } from 'Component/Modal/Connector';

const modalConnector = ({id, ...rest}) => (Modal) => {
  const Connector = (props) => {
    const {modalFadeIn, modalShow} = props;
    return (
      <div
        className={(
          "modal fade" +
          (modalFadeIn ? ' show' : '') +
          (modalShow ? ' d-block' : '')
        )}>
        <Modal {...props} />
      </div>
    )
  }

  return registerModal({id, ...rest})(
    Connector
  )
};

export default modalConnector;
