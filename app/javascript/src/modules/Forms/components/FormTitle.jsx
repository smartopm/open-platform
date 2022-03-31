import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

export default function FormTitle({ name }) {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        {name}
      </Typography>
    </>
  );
}

FormTitle.propTypes = {
  name: PropTypes.string.isRequired
};
