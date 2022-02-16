import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import Avatar from '../../../components/Avatar';
import UserDetail from './UserProfileDetail';
import UserLabels from './UserLabels';
import UserLabelTitle from './UserLabelTitle';

export default function UserDetailHeader({ data, userType }) {
  const [isLabelOpen, setIsLabelOpen] = useState(false);
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
        <Grid item lg={5} md={5}>
          {['admin'].includes(userType) && (
            <UserLabelTitle isLabelOpen={isLabelOpen} setIsLabelOpen={setIsLabelOpen} />
          )}
        </Grid>
        {isLabelOpen && (
          <Grid container>
            <Grid item md={1} lg={1} />
            <Grid item md={11} lg={11}>
              <UserLabels
                userId={data.user.id}
                isLabelOpen={isLabelOpen}
                setIsLabelOpen={setIsLabelOpen}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
}

UserDetailHeader.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,
  userType: PropTypes.string.isRequired
};
