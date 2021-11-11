/* eslint-disable */
import React from 'react'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'

/**
 * @deprecated in favour of this app/javascript/src/shared/CenteredContent.jsx
 */
export default function CenteredContent({children}) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        {children}
      </Grid>
    )
}

CenteredContent.propTypes = {
    children: PropTypes.node.isRequired
}