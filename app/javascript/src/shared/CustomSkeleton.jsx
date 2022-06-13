import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import PropTypes from 'prop-types';

export default function CustomSkeleton({ variant, width, height, style}) {
  return (
    <Skeleton variant={variant} width={width} height={height} data-testid='skeleton' style={style} />
  )
}

CustomSkeleton.defaultProps = {
  style: {}
}

CustomSkeleton.propTypes = {
  variant: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object
};