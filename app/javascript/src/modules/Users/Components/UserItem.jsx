/* eslint-disable max-lines */
import React, { useState } from 'react';
import {
  ListItem,
  Typography,
  ListItemAvatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useMutation } from 'react-apollo';
import Avatar from '../../../components/Avatar';
import UserActionMenu from './UserActionMenu';
import UserMerge from './UserMerge';
import CenteredContent from '../../../shared/CenteredContent';
import { userSubStatus } from '../../../utils/constants';
import { ActionDialog } from '../../../components/Dialog';
import { UpdateUserMutation } from '../../../graphql/mutations/user';
import { capitalize } from '../../../utils/helpers';

export default function UserItem({
  user,
  currentUserType,
  handleUserSelect,
  selectedUsers,
  offset,
  selectCheckBox,
  refetch,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const { t } = useTranslation('common', 'user');
  const isMobile = useMediaQuery('(max-width:800px)');
  const mdDownHidden = useMediaQuery(theme => theme.breakpoints.down('md')); // !mdDownHidden = medium screen and above
  const mdUpHidden = useMediaQuery(theme => theme.breakpoints.up('md')); // !mdUpHidden = smaller screens
  /**
   * @deprecated prefer getting this contact from the community
   */
  const CSMNumber = '260974624243';
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [activationDialogOpen, setActivationDialogOpen] = useState(false);
  const [updateUser] = useMutation(UpdateUserMutation);
  const [loading, setLoading] = useState(false);

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
        state: { from: 'users', offset },
      });
    }
  }

  function handleMergeDialog() {
    setAnchorEl(null);
    setDialogOpen(!isDialogOpen);
  }

  function handleActivationDialog() {
    setAnchorEl(null);
    setActivationDialogOpen(!activationDialogOpen);
  }

  function handleActivation() {
    setLoading(true);
    updateUser({
      variables: { id: user.id, name: user.name, status: activationStatus() },
    })
      .then(() => {
        setLoading(false);
        handleActivationDialog();
        refetch();
      })
      .catch(() => {
        setLoading(false);
        handleActivationDialog();
      });
  }

  function activationStatus() {
    if (user.status === 'active') return 'deactivated';
    return 'active';
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
      <ActionDialog
        open={activationDialogOpen}
        handleClose={handleActivationDialog}
        handleOnSave={handleActivation}
        message={
          user.status === 'active'
            ? t('users:messages.deactivation_confirmation', { userName: user.name })
            : t('users:messages.activation_confirmation', { userName: user.name })
        }
        type="confirm"
        proceedText={
          user.status === 'active'
            ? t('users:buttons:deactivate_user')
            : t('users:buttons:activate_user')
        }
        disableActionBtn={loading}
      />
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
          <Grid item md={2} sm={9} xs={7}>
            <Link
              style={{ color: 'black' }}
              to={{ pathname: `/user/${user.id}`, state: { from: 'users', offset } }}
              key={user.id}
            >
              <Typography
                variant="subtitle1"
                data-testid="user_name"
                className={isMobile ? classes.userNameWithElipsis : classes.userName}
                style={{ maxWidth: isMobile ? '15ch' : '20ch' }}
              >
                <strong>{user.name}</strong>
              </Typography>
            </Link>
          </Grid>
          {!mdUpHidden && (
            <Grid item md={1} sm={1} xs={1}>
              <IconButton
                className={classes.menuButton}
                aria-label={`more-${user.name}`}
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenu}
                dataid={user.id}
                size="large"
              >
                <MoreVertIcon />
              </IconButton>
            </Grid>
          )}

          <Grid item md={3} sm={6} xs={12}>
            {user?.email?.length > 26 && !isMobile ? (
              <Tooltip
                title={user?.email}
                arrow
                placement="bottom"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'primary',
                      '& .MuiTooltip-arrow': {
                        color: 'primary',
                      },
                    },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  data-testid="user_email"
                  gutterBottom
                  className={classes.emailWithElipsis}
                >
                  {user.email}
                </Typography>
              </Tooltip>
            ) : isMobile ? (
              <Typography
                variant="body2"
                data-testid="user_email"
                gutterBottom
                className={classes.emailWithElipsisMobile}
              >
                {user.email}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                data-testid="user_email"
                gutterBottom
                className={classes.emailWithElipsis}
              >
                {user.email}
              </Typography>
            )}

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
          <Grid item md={2} sm={6} xs={12}>
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
          <Grid item md={1} sm={6} xs={12}>
            {user.status === 'deactivated' && (
              <Chip
                data-testid="user_status_chip"
                label={capitalize(user.status)}
                className={classes.alignDetailsToAvatarFromSm}
                style={{ color: 'black' }}
                size="small"
              />
            )}
          </Grid>
          {!mdDownHidden && (
            <Grid item md={1} sm={1} className={classes.iconButton}>
              <IconButton
                className={classes.menuButton}
                aria-label={`more-${user.name}`}
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenu}
                dataid={user.id}
                size="large"
              >
                <MoreVertIcon />
              </IconButton>
            </Grid>
          )}
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
            handleActivationDialog={handleActivationDialog}
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
    status: PropTypes.string,
    subStatus: PropTypes.string,
    notes: PropTypes.arrayOf(PropTypes.object),
    labels: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  currentUserType: PropTypes.string.isRequired,
  selectCheckBox: PropTypes.bool.isRequired,
  offset: PropTypes.number.isRequired,
  handleUserSelect: PropTypes.func.isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  refetch: PropTypes.func.isRequired,
};

const useStyles = makeStyles(() => ({
  userItem: {
    border: '1px solid #ECECEC',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  },
  iconButton: {
    textAlign: 'right',
  },
  menuButton: {
    float: 'right',
  },
  linkItem: {
    color: '#000000',
    textDecoration: 'none',
  },
  '@media (min-width: 600px) and (max-width: 766px)': {
    userNameItem: {
      paddingLeft: 8,
    },
  },

  userNameWithElipsis: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginLeft: '0%',
  },
  '@media (min-width: 499px) and (max-width: 599px)': {
    userName: {
      marginLeft: '-22%',
    },
    userAvatar: {
      marginLeft: '-42%',
    },
  },
  '@media (min-width: 450px) and (max-width: 499px)': {
    userName: {
      marginLeft: '-19%',
    },
    userAvatar: {
      marginLeft: '-40%',
    },
  },
  '@media (min-width: 390px) and (max-width: 450px)': {
    userName: {
      marginLeft: '-6%',
    },
    userAvatar: {
      marginLeft: '-18%',
    },
  },
  '@media (min-width: 991px)': {
    userName: {
      marginLeft: '-37%',
    },
    userAvatar: {
      marginLeft: '-40%',
    },
    menuButton: {
      marginRight: '-3.5em',
    },
  },

  emailWithElipsis: {
    maxWidth: '25ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginLeft: '0%',
  },

  emailWithElipsisMobile: {
    maxWidth: '25ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginLeft: '18%',
  },

  '@media (max-width: 960px)': {
    alignDetailsToAvatarFromSm: {
      marginLeft: '18%',
    },
  },
  '@media (max-width: 600px)': {
    alignDetailsToAvatarForXs: {
      marginLeft: '11%',
    },
    alignDetailsToAvatarFromSm: {
      marginLeft: '11%',
    },
  },
  '@media (max-width: 430px)': {
    alignDetailsToAvatarForXs: {
      marginLeft: '18%',
    },
    alignDetailsToAvatarFromSm: {
      marginLeft: '18%',
    },
  },
}));
