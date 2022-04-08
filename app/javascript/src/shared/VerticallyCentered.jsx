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
        direction="column"
        style={{ backgroundColor: 'teal' }}
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

VerticallyCentered.propTypes = {
  children: PropTypes.node.isRequired
};
