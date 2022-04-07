import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

export default function VerticallyCentered({ children }) {
  return (
    <div style={{ height: '100%', display: 'flex' }}>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
        direction="column"
        style={{ backgroundColor: 'teal' }}
      >
        <Grid item>
          <Container maxWidth="sm" style={{ backgroundColor: 'yellow' }}>
            {children}
          </Container>
        </Grid>
      </Grid>
    </div>
  );
}

VerticallyCentered.propTypes = {
  children: PropTypes.node.isRequired
};
