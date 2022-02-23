/* eslint-disable complexity */
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
import { selectOptions, createMenuContext } from '../utils';
import { checkAccessibilityForUserType as handler } from '../../../utils/helpers';

export default function UserDetailHeader({ data, userType, currentTab, authState }) {
  const history = useHistory();
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const anchorRef = useRef(null);
  const [selectedKey, setSelectKey] = useState('');
  const options = selectOptions(
    setSelectKey,
    checkModule,
    checkCommunityFeatures,
    history,
    data,
    handleMenuItemClick,
    handleMergeUserItemClick,
    checkRole
  );

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

  function checkModule(moduleName) {
    const userPermissionsModule = authState.user?.permissions.find(
      permissionObject => permissionObject.module === moduleName
    );
    return userPermissionsModule?.permissions.includes('can_see_menu_item') || false;
  }

  function checkOtherRoles(featureName, roles) {
    const ctx = createMenuContext(featureName, data, userType, authState)
    return handler({ userTypes: roles, ctx }).includes(userType)
  }

  function checkRole(roles, featureName) {
    if(['Properties', 'Users', 'Payments', 'LogBook'].includes(featureName)) {
      checkOtherRoles(featureName, roles)
    }
    return roles.includes(userType)
  }

  function checkCommunityFeatures(featureName) {
    return Object.keys(authState.user?.community.features || []).includes(featureName);
  }

  function handleMergeUserItemClick() {
    history.push(`/user/${data.user.id}?type=MergeUser`);
    setOpen(false);
  }

  return (
    <>
      <Grid container>
        <Grid
          item
          lg={12}
          md={12}
          sm={8}
          xs={8}
          className={classes.breadCrumb}
          data-testid="breadcrumb"
        >
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
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Grid container data-testid="user-detail">
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
              options={options}
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
  currentTab: PropTypes.string.isRequired,
  authState: PropTypes.shape().isRequired
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
