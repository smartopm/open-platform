import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function UserDetail({ data }) {
  const { t } = useTranslation('users');
  const classes = useStyles();
  return (
    <>
      <Grid container direction='column'>
        <Grid item>
          <Typography className={classes.name} variant='h6'>{data.user.name}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption" color='textSecondary'>{t(`common:user_types.${data?.user?.userType}`)}</Typography>
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles(() => ({
  name: {
    color: '#575757'
  }
}))

UserDetail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired
};

