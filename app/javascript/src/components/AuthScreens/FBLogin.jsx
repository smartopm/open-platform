import React from 'react'
import Button from '@material-ui/core/Button'
import FacebookIcon from '@material-ui/icons/Facebook'
import Grid from '@material-ui/core/Grid'

export default function FBLogin() {
  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <Button
          color="primary"
          href="/fb_oauth"
          startIcon={<FacebookIcon />}
          data-testid="fblogin"
        >
          Login with Facebook
        </Button>
      </Grid>
    </Grid>
  )
}
