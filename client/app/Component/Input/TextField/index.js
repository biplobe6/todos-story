import React from 'react';
import PropTypes from 'prop-types';

import HelpText from '../HelpText';

const TextField = (props) => {
  const {id, label, error: _, helpText: __, ...rest} = props;
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <textarea
        className="form-control"
        id={id} {...rest} />
      <HelpText {...props} />
    </div>
  );
};

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default TextField;
