import React from 'react';
import PropTypes from 'prop-types';

const HelpText = ({id, error, name, helpText}) => (
  error && error[name] && (
    error[name].map((msg, index) => (
      <small
        id={`${id}-help-${index}`}
        key={msg}
        className="form-text text-danger">
        {msg}
      </small>
    ))
  )
) || (
  helpText && (
    <small
      id={`${id}-help`}
      className="form-text text-muted">
      {helpText}
    </small>
  )
)

HelpText.propTypes = {
  error: PropTypes.any,
  helpText: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default HelpText;
