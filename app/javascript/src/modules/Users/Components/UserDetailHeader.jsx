import React, { useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '../../../components/Avatar';
import UserDetail from './UserProfileDetail';
import UserLabels from './UserLabels';
import UserLabelTitle from './UserLabelTitle';
import SelectButton from '../../../shared/buttons/SelectButton';

export default function UserDetailHeader({ data, userType, currentTab }) {
  const history = useHistory();
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const anchorRef = useRef(null);
  const [selectedKey, setSelectKey] = useState('');

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleMenuItemClick(key, val) {
    setSelectKey(key);
    history.push(`/user/${data.user.id}?tab=${val}`);
    setOpen(false);
  }

  const selectOptions = [
    {
      key: 'user_settings',
      value: 'User Settings',
      handleMenuItemClick: (key) => setSelectKey(key),
      subMenu: [
        {
          key: 'edit_user',
          value: 'Edit User',
          handleMenuItemClick: () => history.push(`/user/${data.user.id}/edit`)
        },
        {
          key: 'invite_history',
          value: 'Invite History'
        },
        {
          key: 'print_id',
          value: 'Print ID',
          handleMenuItemClick: () => history.push(`/print/${data.user.id}`)
        }
      ]
    },
    {
      key: 'communication',
      value: 'Communications',
      handleMenuItemClick: (key) => setSelectKey(key),
      subMenu: [
        {
          key: 'communications',
          value: 'Communication',
          handleMenuItemClick
        },
        {
          key: 'send_sms',
          value: 'Send SMS',
          handleMenuItemClick: () => history.push(`/message/${data.user.id}`)
        },
        {
          key: 'send_otp',
          value: 'Send OTP',
          handleMenuItemClick: () => history.push(`/user/${data.user.id}/otp`)
        },
        {
          key: 'message_support',
          value: 'Message Support',
          handleMenuItemClick: () => history.push(`/message/${data.user.id}`)
        }
      ]
    },
    {
      key: 'payments',
      value: 'Plans',
      handleMenuItemClick
    },
    {
      key: 'plots',
      value: 'Plots',
      handleMenuItemClick
    },
    {
      key: 'lead_management',
      value: 'LeadManagement',
      handleMenuItemClick
    },
    {
      key: 'user_logs',
      value: 'User Logs',
      handleMenuItemClick: () => history.push(`/user/${data.user.id}/logs`)
    },
    {
      key: 'merge_user',
      value: 'Merge User',
      handleMenuItemClick: () => history.push(`/user/${data.user.id}?type='MergeUser'`)
    }
  ]
  return (
    <>
      <Grid container>
        <Grid item lg={12} md={12} sm={8} xs={8} className={classes.breadCrumb} data-testid='breadcrumb'>
          <Breadcrumbs aria-label="user-breadcrumb">
            <Link color="primary" href="/users" className={classes.link}>
              <Typography variant="caption">Users</Typography>
            </Link>
            {currentTab !== 'Contacts' && (
              <Link color="primary" href={`/user/${data.user.id}`} className={classes.link}>
                <Typography variant="caption">User Detail</Typography>
              </Link>
            )}
            <Typography color="textSecondary" variant="caption">
              {currentTab}
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Hidden mdUp>
          <Grid item sm={4} xs={4} className={classes.labelTitle}>
            {['admin'].includes(userType) && (
              <UserLabelTitle isLabelOpen={isLabelOpen} setIsLabelOpen={setIsLabelOpen} />
            )}
          </Grid>
          {isLabelOpen && (
            <Grid item xs={12} sm={12} className={classes.labels}>
              <UserLabels
                userId={data.user.id}
                isLabelOpen={isLabelOpen}
                setIsLabelOpen={setIsLabelOpen}
              />
            </Grid>
          )}
        </Hidden>
        <Grid
          item
          lg={4}
          md={4}
          sm={12}
          xs={12}
        >
          <Grid container data-testid='user-detail'>
            <Grid item lg={3} md={3} sm={3} xs={3}>
              <Avatar
                user={data.user}
                // eslint-disable-next-line react/style-prop-object
                style="semiSmall"
              />
            </Grid>
            <Grid item lg={9} md={9} sm={9} xs={9}>
              <UserDetail data={data} userType={userType} />
            </Grid>
          </Grid>
        </Grid>
        <Hidden smDown>
          <Grid item lg={3} md={3} sm={3}>
            <SelectButton 
              options={selectOptions}
              open={open}
              anchorEl={anchorRef.current}
              anchorRef={anchorRef}
              handleClose={handleClose}
              handleClick={() => setOpen(!open)}
              selectedKey={selectedKey}
              buttonText={currentTab}
            />
          </Grid>
          <Grid item lg={5} md={5} sm={5}>
            {['admin'].includes(userType) && (
              <UserLabelTitle isLabelOpen={isLabelOpen} setIsLabelOpen={setIsLabelOpen} />
            )}
          </Grid>
          {isLabelOpen && (
            <Grid container className={classes.labels}>
              <Grid item md={2} lg={2} sm={2} />
              <Grid item md={10} lg={10} sm={10}>
                <UserLabels
                  userId={data.user.id}
                  isLabelOpen={isLabelOpen}
                  setIsLabelOpen={setIsLabelOpen}
                />
              </Grid>
            </Grid>
          )}
        </Hidden>
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
  userType: PropTypes.string.isRequired,
  currentTab: PropTypes.string.isRequired
};

const useStyles = makeStyles(() => ({
  breadCrumb: {
    padding: '10px 0'
  },
  link: {
    textDecoration: 'none'
  },
  labelTitle: {
    paddingTop: '10px',
    textAlign: 'right'
  },
  labels: {
    textAlign: 'center'
  }
}));
