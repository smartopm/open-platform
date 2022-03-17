/* eslint-disable */
import React from 'react'
import Grid from '@mui/material/Grid'
import PropTypes from 'prop-types'

/**
 * @deprecated in favour of this app/javascript/src/shared/CenteredContent.jsx
 */
export default function CenteredContent({children}) {
    return (
      <Grid container direction="row" justifyContent="center" alignItems="center">
        {children}
      </Grid>
    );
}

CenteredContent.propTypes = {
    children: PropTypes.node.isRequired
}