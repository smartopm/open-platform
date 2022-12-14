import React from 'react'
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types'

export default function CenteredContent({children}) {
    return (
      <Grid container direction="row" justifyContent="center" alignItems="center" data-testid="centered_content">
        {children}
      </Grid>
    )
}

CenteredContent.propTypes = {
    children: PropTypes.node.isRequired
}
