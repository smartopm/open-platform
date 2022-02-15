import React from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '../../../components/Avatar';
import UserDetail from './UserProfileDetail';
import UserLabels from './UserLabels';

export default function UserDetailHeader({ data, userType }) {
  return (
    <>
      <Grid container>
        <Grid item lg={4} md={4}>
          <Grid container>
            <Grid item lg={4} md={4}>
              <Avatar
                user={data.user}
              // eslint-disable-next-line react/style-prop-object
                style="semiSmall"
              />
            </Grid>
            <Grid item lg={8} md={8}>
              <UserDetail data={data} userType={userType} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={3} md={3} />
        <Grid item lg={5} md={5}>{['admin'].includes(userType) && <UserLabels userId={data.user.id} />}</Grid>
      </Grid>
    </>
  )
}