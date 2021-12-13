/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import {
  ListItem,
  Typography,
  ListItemAvatar,
  Box,
  Chip,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Hidden,
  Checkbox
} from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import Avatar from '../../../components/Avatar'
import UserActionMenu from "./UserActionMenu"
import UserMerge from './UserMerge'
import CenteredContent from '../../../components/CenteredContent'
import { userSubStatus } from '../../../utils/constants'

export default function UserItem({
  user,
  currentUserType,
  handleUserSelect,
  selectedUsers,
  offset,
  selectCheckBox
}) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const history = useHistory()
  const { t } = useTranslation('common')
  /**
   * @deprecated prefer getting this contact from the community
   */
  const CSMNumber = '260974624243'
  const [isDialogOpen, setDialogOpen] = useState(false)

  function handleClose(event) {
    event.stopPropagation()
    setAnchorEl(null)
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function showUserDetails(event) {
    if (event.target.tagName === 'DIV') {
      history.push({
        pathname: `/user/${user.id}`,
        state: { from: 'users', offset }
      })
    }
  }

  function handleMergeDialog() {
    setAnchorEl(null)
    setDialogOpen(!isDialogOpen)
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
        <Grid container alignItems="center">
          <Checkbox
            checked={selectedUsers.includes(user.id) || selectCheckBox}
            onChange={() => handleUserSelect(user)}
            name="includeReplyLink"
            data-testid="reply_link"
            color="primary"
            style={{padding: '0px', marginRight: '15px'}}
          />
          <ListItemAvatar className={classes.avatarList}>
            <Avatar user={user} />
          </ListItemAvatar>

          <Hidden smUp>
            <Grid className={classes.actionIcon}>
              <IconButton
                className={classes.menuButton}
                aria-label={`more-${user.name}`}
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenu}
                dataid={user.id}
              >
                <MoreHorizIcon />
              </IconButton>
            </Grid>
          </Hidden>

          <Box className={classes.detailsRow}>
            <Box style={{ margin: 5 }}>
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around'
                }}
              >
                <Link
                  style={{ color: 'black' }}
                  to={{pathname: `/user/${user.id}`, state: { from: 'users', offset }}}
                  key={user.id}
                >
                  <Typography component="span" variant="subtitle1" data-testid="user_name">
                    <strong>
                      {' '}
                      {user.name}
                      {' '}
                    </strong>
                  </Typography>
                </Link>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  marginRight: 30
                }}
              >
                <Typography variant="body2" data-testid="user_email">{user.email}</Typography>
                <Typography component="span" variant="body2" data-testid="user_phone_number">
                  {user.phoneNumber}
                </Typography>
                {user.subStatus && (
                  <Typography variant="body2" data-testid="user-substatus">
                    {userSubStatus[user.subStatus]}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Grid className={classes.userTypeRow}>
            <Typography variant="subtitle1" data-testid="user_type">
              {t(`common:user_types.${user?.userType}`)}
            </Typography>
          </Grid>
          <Grid container className={classes.labelsRow}>
            {user.labels.map(label => (
              <Chip
                key={label.id}
                label={label.shortDesc}
                style={{ height: 25, margin: 5 }}
              />
            ))}
          </Grid>
          <Hidden xsDown>
            <Grid className={classes.actionIcon}>
              <IconButton
                className={classes.menuButton}
                aria-label={`more-${user.name}`}
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenu}
                dataid={user.id}
              >
                <MoreHorizIcon />
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
  )
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
}

const useStyles = makeStyles(() => ({
  userItem: {
    border: '1px solid #ECECEC',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    cursor: 'pointer'
  },
  menuButton: {
    float: 'right'
  },
  linkItem: {
    color: '#000000',
    textDecoration: 'none'
  },

  '@media (min-width: 768px)': {
    avatarList: {
      width: '5%'
    },
    detailsRow: {
      width: '25%'
    },
    userTypeRow: {
      width: '16%',
      textAlign: 'center'
    },
    labelsRow: {
      width: '44%'
    },
    actionIcon: {
      width: '5%'
    }
  },
  '@media only screen and (min-width: 320px) and (max-width: 374px)': {
    detailsRow: {
      width: '60%'
    },
    userTypeRow: {
      width: '60%',
      textAlign: 'right'
    },
    actionIcon: {
      width: '57%'
    }
  },
  '@media only screen and (min-width: 375px) and (max-width: 767px)': {
    detailsRow: {
      width: '60%'
    },
    userTypeRow: {
      width: '60%',
      textAlign: 'right'
    },
    actionIcon: {
      width: '60%'
    }
  }
}))
