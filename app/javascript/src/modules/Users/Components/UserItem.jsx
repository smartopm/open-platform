import React, { useState } from 'react';
import {
  ListItem,
  Typography,
  ListItemAvatar,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Hidden,
  Checkbox
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Avatar from '../../../components/Avatar';
import UserActionMenu from './UserActionMenu';
import UserMerge from './UserMerge';
import CenteredContent from '../../../shared/CenteredContent';
import { userSubStatus } from '../../../utils/constants';

export default function UserItem({
  user,
  currentUserType,
  handleUserSelect,
  selectedUsers,
  offset,
  selectCheckBox
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const { t } = useTranslation('common');
  /**
   * @deprecated prefer getting this contact from the community
   */
  const CSMNumber = '260974624243';
  const [isDialogOpen, setDialogOpen] = useState(false);

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function showUserDetails(event) {
    if (event.target.tagName === 'DIV') {
      history.push({
        pathname: `/user/${user.id}`,
        state: { from: 'users', offset }
      });
    }
  }

  function handleMergeDialog() {
    setAnchorEl(null);
    setDialogOpen(!isDialogOpen);
  }

  return (
    <>
      <Dialog
        open={isDialogOpen}
        fullWidth
        maxWidth="md"
        scroll="paper"
        onClose={handleMergeDialog}
        aria-labelledby="user_merge"
      >
        <DialogTitle id="user_merge">
          <CenteredContent>
            <span>{t('common:menu.merge_user', { count: 0 })}</span>
          </CenteredContent>
        </DialogTitle>
        <DialogContent>
          <UserMerge close={handleMergeDialog} userId={user.id} />
        </DialogContent>
      </Dialog>
      <ListItem
        key={user.id}
        className={classes.userItem}
        onClick={showUserDetails}
        data-testid="user_item"
      >
        <Grid container direction="row" justifyContent="flex-start" alignItems="center">
          <Grid item md={1} sm={1} xs={2}>
            <Checkbox
              checked={selectedUsers.includes(user.id) || selectCheckBox}
              onChange={() => handleUserSelect(user)}
              name="includeReplyLink"
              data-testid="reply_link"
              color="primary"
            />
          </Grid>
          <Grid item md={1} sm={1} xs={2}>
            <ListItemAvatar className={classes.userAvatar}>
              <Avatar user={user} />
            </ListItemAvatar>
          </Grid>
          <Grid item md={2} sm={9} xs={7} className={classes.userNameItem}>
            <Link
              style={{ color: 'black' }}
              to={{ pathname: `/user/${user.id}`, state: { from: 'users', offset } }}
              key={user.id}
            >
              <Typography
                component="span"
                variant="subtitle1"
                data-testid="user_name"
                className={classes.userName}
              >
                <strong>
                  {' '}
                  {user.name}
                  {' '}
                </strong>
              </Typography>
            </Link>
          </Grid>
          <Hidden mdUp>
            <Grid item md={1} sm={1} xs={1}>
              <IconButton
                className={classes.menuButton}
                aria-label={`more-${user.name}`}
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenu}
                dataid={user.id}
              >
                <MoreVertIcon />
              </IconButton>
            </Grid>
          </Hidden>
          <Grid item md={3} sm={6} xs={12}>
            <Typography
              variant="body2"
              data-testid="user_email"
              gutterBottom
              className={classes.alignDetailsToAvatarFromSm}
            >
              {user.email}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              data-testid="user_phone_number"
              gutterBottom
              className={classes.alignDetailsToAvatarFromSm}
            >
              {user.phoneNumber}
            </Typography>
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <Typography
              variant="body2"
              data-testid="user_type"
              gutterBottom
              className={classes.alignDetailsToAvatarForXs}
            >
              {t(`common:user_types.${user?.userType}`)}
            </Typography>
            {user.subStatus && (
              <Typography
                variant="body2"
                data-testid="user-substatus"
                gutterBottom
                className={classes.alignDetailsToAvatarForXs}
              >
                {userSubStatus[user.subStatus]}
              </Typography>
            )}
          </Grid>

          <Hidden smDown>
            <Grid item md={1} sm={1} className={classes.iconButton}>
              <IconButton
                className={classes.menuButton}
                aria-label={`more-${user.name}`}
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenu}
                dataid={user.id}
              >
                <MoreVertIcon />
              </IconButton>
            </Grid>
          </Hidden>
          <UserActionMenu
            data={{ user }}
            router={history}
            anchorEl={anchorEl}
            handleClose={handleClose}
            userType={currentUserType}
            CSMNumber={CSMNumber}
            open={open}
            OpenMergeDialog={handleMergeDialog}
            linkStyles={classes.linkItem}
          />
        </Grid>
      </ListItem>
    </>
  );
}

UserItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    userType: PropTypes.string,
    imageUrl: PropTypes.string,
    subStatus: PropTypes.string,
    notes: PropTypes.arrayOf(PropTypes.object),
    labels: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  currentUserType: PropTypes.string.isRequired,
  selectCheckBox: PropTypes.bool.isRequired,
  offset: PropTypes.number.isRequired,
  handleUserSelect: PropTypes.func.isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.string).isRequired
};

const useStyles = makeStyles(() => ({
  userItem: {
    border: '1px solid #ECECEC',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    cursor: 'pointer'
  },
  iconButton: {
    textAlign: 'right'
  },
  menuButton: {
    float: 'right'
  },
  linkItem: {
    color: '#000000',
    textDecoration: 'none'
  },
  '@media (min-width: 600px) and (max-width: 766px)': {
    userNameItem: {
      paddingLeft: 8
    }
  },
  '@media (min-width: 499px) and (max-width: 599px)': {
    userName: {
      marginLeft: '-22%'
    },
    userAvatar: {
      marginLeft: '-42%'
    }
  },
  '@media (min-width: 450px) and (max-width: 499px)': {
    userName: {
      marginLeft: '-19%'
    },
    userAvatar: {
      marginLeft: '-40%'
    }
  },
  '@media (min-width: 390px) and (max-width: 450px)': {
    userName: {
      marginLeft: '-6%'
    },
    userAvatar: {
      marginLeft: '-18%'
    }
  },
  '@media (min-width: 991px)': {
    userName: {
      marginLeft: '-37%'
    },
    userAvatar: {
      marginLeft: '-40%'
    },
    menuButton: {
      marginRight: '-3.5em'
    }
  },
  '@media (max-width: 960px)': {
    alignDetailsToAvatarFromSm: {
      marginLeft: '18%'
    }
  },
  '@media (max-width: 600px)': {
    alignDetailsToAvatarForXs: {
      marginLeft: '11%'
    },
    alignDetailsToAvatarFromSm: {
      marginLeft: '11%'
    },
  },
  '@media (max-width: 430px)': {
    alignDetailsToAvatarForXs: {
      marginLeft: '18%'
    },
    alignDetailsToAvatarFromSm: {
      marginLeft: '18%'
    }
  },
}));
