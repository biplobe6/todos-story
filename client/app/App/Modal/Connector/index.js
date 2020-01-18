import React from 'react';
import { registerModal } from 'Component/Modal/Connector';

const modalConnector = ({id, ...rest}) => (Modal) => {
  const Connector = (props) => {
    const {modalFadeIn, modalShow, modalRefHandler} = props;
    return (
      <div
        className={(
          "modal fade" +
          (modalFadeIn ? ' show' : '') +
          (modalShow ? ' d-block' : '')
        )}
        ref={modalRefHandler}>
        <Modal {...props} />
      </div>
    )
  }

  return registerModal({id, ...rest})(
    Connector
  )
};

export default modalConnector;
