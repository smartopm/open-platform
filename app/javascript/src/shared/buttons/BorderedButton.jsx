import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

export default function BorderedButton({ title, ...props }) {
  return (
    <Button
      variant="outlined"
      style={{ width: '70%', color: '#FFFFFF', border: '1px solid #FFFFFF' }}
      size="large"
      {...props}
    >
      {title}
    </Button>
  );
}

BorderedButton.propTypes = {
  title: PropTypes.string.isRequired
};
