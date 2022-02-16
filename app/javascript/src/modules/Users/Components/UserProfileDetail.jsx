import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

export default function UserDetail({ data }) {
  const { t } = useTranslation('users');
  const classes = useStyles();
  // const matches = useMediaQuery('(max-width:600px)');
  return (
    <>
      <Grid contaner direction='column'>
        <Grid item>
          <Typography className={classes.name} variant='h6'>{data.user.name}</Typography>
        </Grid>
        <Grid item>
          {data?.user?.phoneNumber && (
          <Typography data-testid="phone" variant="caption" color='textSecondary'>
            {data.user.phoneNumber}
          </Typography>
          )}
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

