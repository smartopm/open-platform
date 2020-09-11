import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import {
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  Fab,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Avatar from '../Avatar'
import BusinessActionMenu from './BusinessActionMenu'
import { businessCategories } from '../../utils/constants'
import CenteredContent from '../CenteredContent'
import BusinessForm from './BusinessForm'

export default function BusinessList({ businessData, userType, refetch }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const open = Boolean(anchorEl)

  const avatarStyle = {
    style: 'medium'
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function openModal() {
    setModalOpen(!modalOpen)
    refetch()
  }

  function handleClose() {
    setAnchorEl(null)
  }
  return (
    <div className="container">
      <Dialog
        open={modalOpen}
        fullWidth
        maxWidth="lg"
        onClose={openModal}
        aria-labelledby="task_modal"
      >
        <DialogTitle id="task_modal">
          <CenteredContent>
            <span>Create a Business</span>
          </CenteredContent>
        </DialogTitle>
        <DialogContent>
          <BusinessForm close={openModal} />
        </DialogContent>
      </Dialog>
      <List>
        {businessData.businesses.map(business => (
          <ListItem key={business.id}>
            <Link
              key={business.id}
              to={`/business/${business.id}`}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <ListItemAvatar>
                <Avatar
                  imageUrl={business.imageUrl}
                  style={avatarStyle.style}
                />
              </ListItemAvatar>
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginLeft: 30
                }}
              >
                <Typography variant="subtitle1" data-testid="business-name">
                  {business.name}
                </Typography>
                <Typography variant="caption" data-testid="business-category">
                  {businessCategories[business.category]}
                </Typography>
              </Box>
              <Divider variant="middle" />
            </Link>
            {userType === 'admin' && (
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenu}
              >
                <MoreVertIcon />
              </IconButton>
            )}
            <BusinessActionMenu
              userType={userType}
              data={business}
              anchorEl={anchorEl}
              handleClose={handleClose}
              open={open}
              // eslint-disable-next-line no-use-before-define
              linkStyles={css(styles.linkItem)}
              refetch={refetch}
            />
          </ListItem>
        ))}
      </List>

      {userType === 'admin' && (
        <Fab
          variant="extended"
          onClick={openModal}
          color="primary"
          // eslint-disable-next-line no-use-before-define
          className={`btn ${css(styles.taskButton)} `}
        >
          Create a Business
        </Fab>
      )}
    </div>
  )
}

const styles = StyleSheet.create({
  taskButton: {
    height: 51,
    boxShadow: 'none',
    position: 'fixed',
    bottom: 20,
    right: 57,
    marginLeft: '30%',
    color: '#FFFFFF'
  },
  linkItem: {
    color: '#000000',
    textDecoration: 'none'
  }
})
