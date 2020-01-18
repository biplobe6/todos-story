import React from 'react';
import PropTypes from 'prop-types';

import { registerModal } from 'Component/Modal/Connector';

const ModalTodo = ({modalShow, modalClose, modalFadeIn, ...props}) => {
  return (
    <div
      className={(
        "modal fade" +
        (modalFadeIn ? ' show' : '') +
        (modalShow ? ' d-block' : '')
      )}
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              onClick={modalClose}
              aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            ...
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={modalClose}
              className="btn btn-secondary"
              data-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

ModalTodo.propTypes = {

};

export default registerModal({id: 'todo'})(
  ModalTodo
);