import React from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '../../../components/Avatar';

export default function UserDetailHeader({ data }) {
  return (
    <>
      <Grid container>
        <Grid item>
          <Grid container>
            <Grid item>
              <Avatar
                user={data.user}
              // eslint-disable-next-line react/style-prop-object
                style="semiSmall"
              />
            </Grid>
            <Grid item />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}