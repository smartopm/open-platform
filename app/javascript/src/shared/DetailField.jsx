import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

export default function DetailsField({ title, value, editable, handleChange }) {
  return (
    <>
      <div>
        <TextField
          disabled={!editable}
          id={`${value}-id`}
          inputProps={{ 'data-testid': 'text-field' }}
          style={{ width: '350px', margin: '0 23px 10px 23px' }}
          label={title}
          value={value}
          onChange={handleChange}
          name={title?.replace(' ', '')}
        />
      </div>
    </>
  );
}

DetailsField.defaultProps = {
  handleChange: () => {},
  editable: false,
}

DetailsField.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleChange: PropTypes.func,
  editable: PropTypes.bool
};
