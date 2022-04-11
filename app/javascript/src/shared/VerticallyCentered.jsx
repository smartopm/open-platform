import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';

export default function VerticallyCentered({ children, backgroundColor, isVerticallyCentered }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        backgroundColor,
        color: backgroundColor && 'white'
      }}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        justifyContent={isVerticallyCentered && 'center'}
        alignItems={isVerticallyCentered && 'center'}
      >
        <Grid item>{children}</Grid>
      </Grid>
    </div>
  );
}

VerticallyCentered.defaultProps = {
  backgroundColor: null,
  isVerticallyCentered: true
};

VerticallyCentered.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundColor: PropTypes.string,
  isVerticallyCentered: PropTypes.bool
};
