import React from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function Text({ content, otherProps }) {
  return (
    <Typography gutterBottom {...otherProps}>
      {content}
    </Typography>
  );
}

Text.defaultProps = {
  otherProps: {}
};
Text.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
    .isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  otherProps: PropTypes.object
};
