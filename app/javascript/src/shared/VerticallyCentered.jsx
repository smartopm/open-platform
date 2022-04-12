import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';

export default function VerticallyCentered({
  children,
  backgroundColor,
  isVerticallyCentered,
  styles
}) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        backgroundColor,
        color: backgroundColor && 'white',
        ...styles
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
  isVerticallyCentered: true,
  styles: {}
};

VerticallyCentered.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundColor: PropTypes.string,
  isVerticallyCentered: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
};
