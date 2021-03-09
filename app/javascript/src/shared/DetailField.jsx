import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

export default function DetailsField({ title, value, editable, handleChange, options }) {
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
          select={options?.isSelect}
        >
          {options.children}
        </TextField>
      </div>
    </>
  );
}

DetailsField.defaultProps = {
  handleChange: () => {},
  editable: false,
  options: {
    isSelect: false,
    children: null
  },
}

DetailsField.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleChange: PropTypes.func,
  editable: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.object
};
