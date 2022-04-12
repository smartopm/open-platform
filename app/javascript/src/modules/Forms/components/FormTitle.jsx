import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

export default function FormTitle({ name, description }) {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        {name}
      </Typography>
      {description && (
        <Typography variant="subtitile1" gutterBottom>
          {description}
        </Typography>
      )}
    </>
  );
}

FormTitle.defaultProps = {
  description: null
}

FormTitle.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string
};
