import React from 'react';
import PropTypes from 'prop-types';

import modalConnector from '../Connector';

const ModalTodo = ({modalClose, ...props}) => {
  return (
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
  );
};

ModalTodo.propTypes = {

};

export default modalConnector({id: 'todo'})(
  ModalTodo
);
