import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

export default function BorderedButton({ title, borderColor, outlined, ...props }) {
  return (
    <Button
      variant="outlined"
      style={{
        width: '70%',
        height: 55,
        color: !outlined ? '#FFFFFF' : borderColor,
        border: `1px solid ${borderColor}`,
        backgroundColor: !outlined && borderColor
      }}
      {...props}
    >
      {title}
    </Button>
  );
}

BorderedButton.defaultProps = {
  outlined: false
};

BorderedButton.propTypes = {
  title: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired,
  outlined: PropTypes.bool
};
