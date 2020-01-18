import React from 'react';


const BackDrop = ({show}) => (
  <div
    className={(
      "modal-backdrop fade" +
      (show ? " show" : "")
    )} />
)


export default BackDrop;
