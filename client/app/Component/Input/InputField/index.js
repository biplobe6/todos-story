import React from 'react';
import PropTypes from 'prop-types';


import HelpText from '../HelpText';

const InputField = (props) => {
  const {error: _, helpText: __, id, label, ...rest} = props;
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="form-control"
        aria-describedby={`${id}-help`} {...rest} />
      <HelpText {...props} />
    </div>
  );
};

InputField.defaultProps = {
  type: 'text',
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,

  type: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,

  value: PropTypes.any,
  onChange: PropTypes.func,
  helpText: PropTypes.string,
};

export default InputField;
