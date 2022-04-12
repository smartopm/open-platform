import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import PropTypes from 'prop-types';

export default function CustomSkeleton({ variant, width, height}) {
  return (
    <Skeleton variant={variant} width={width} height={height} />
  )
}

CustomSkeleton.propTypes = {
  variant: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired
};