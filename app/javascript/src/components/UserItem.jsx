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
  DialogContent
} from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import AssignmentIcon from '@material-ui/icons/Assignment'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Link , useHistory } from 'react-router-dom'
import Avatar from './Avatar'
import UserActionMenu from './User/UserActionMenu'

import UserMerge from './User/UserMerge'
import CenteredContent from './CenteredContent'

export default function UserItem({
  user,
  currentUserType,
  sendOneTimePasscode
}) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const history = useHistory()
  const CSMNumber = '260974624243'
  const [isDialogOpen, setDialogOpen] = useState(false)

  function handleClose(event) {
    event.stopPropagation()
    setAnchorEl(null)
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function sendOTP() {
    sendOneTimePasscode({
      variables: { userId: user.id }
    })
      .then(_data => {
        history.push('/otp_sent', {
          url: _data.data.oneTimeLogin.url,
          user: user.name,
          success: true
        })
      })
      .catch(() => {
        history.push('/otp_sent', {
          url: 'The user has no Phone number added',
          user: user.name,
          success: false
        })
      })
  }

  function showUserDetails(event) {
    if (event.target.tagName === 'DIV') {
      history.push(`/user/${user.id}`)
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
            <span>Merge Users</span>
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
      >
        <Grid container alignItems="center">
          <Grid item md={4}>
            <Box className={classes.detailsRow}>
              <ListItemAvatar>
                <Avatar imageUrl={user.imageUrl} />
              </ListItemAvatar>
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
                    to={`/user/${user.id}`}
                    key={user.id}
                  >
                    <Typography component="span" variant="subtitle1">
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
                  <Typography variant="body2" color="textSecondary">
                    {user.email}
                  </Typography>
                  <Typography component="span" variant="body2">
                    {user.phoneNumber}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item md={3}>
            <Typography variant="subtitle1" data-testid="label-users">
              {user.roleName}
            </Typography>
          </Grid>
          <Grid item md={3}>
            {user.labels.map(label => (
              <Chip
                key={label.id}
                label={label.shortDesc}
                style={{ height: 25, margin: 5 }}
              />
            ))}
          </Grid>
          <Grid item md={1}>
            <Grid container direction="row" alignItems="center">
              <AssignmentIcon color="primary" />
              [
              {user.notes.length}
              ]
            </Grid>
          </Grid>
          <Grid item m={1}>
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
          <UserActionMenu
            data={{ user }}
            router={history}
            anchorEl={anchorEl}
            handleClose={handleClose}
            userType={currentUserType}
            sendOTP={sendOTP}
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
    roleName: PropTypes.string,
    imageUrl: PropTypes.string,
    notes: PropTypes.arrayOf(PropTypes.object),
    labels: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  currentUserType: PropTypes.string.isRequired,
  sendOneTimePasscode: PropTypes.func.isRequired,
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
  detailsRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 400
  },
  linkItem: {
    color: '#000000',
    textDecoration: 'none'
  }
}))
