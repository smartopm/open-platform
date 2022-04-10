import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

export default function VerticallyCentered({ children, backgroundColor, isVerticallyCentered }) {
  return (
    <div style={{ height: '100%', display: 'flex' }}>
      <Grid
        container
        spacing={0}
        direction="column"
        justifyContent={isVerticallyCentered && "center"}
        alignItems={isVerticallyCentered && "center"}
        style={{ backgroundColor, color: backgroundColor && 'white' }}
      >
        <Grid item>
          <Container maxWidth="sm">
            {children}
          </Container>
        </Grid>
      </Grid>
    </div>
  );
}

VerticallyCentered.defaultProps = {
  backgroundColor: null,
  isVerticallyCentered: true,
};

VerticallyCentered.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundColor: PropTypes.string,
  isVerticallyCentered: PropTypes.bool,
};
