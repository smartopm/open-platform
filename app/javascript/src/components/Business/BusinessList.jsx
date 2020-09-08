import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  Typography,
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent
} from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import Avatar from '../Avatar'
import CenteredContent from '../CenteredContent'
import BusinessForm from './BusinessForm'

export default function BusinessList({ businessData }) {
  const [open, setModalOpen] = useState(false)

  function openModal() {
    setModalOpen(!open)
  }
  return (
    <div className="container">
      <Dialog
        // fullScreen
        open={open}
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
          <Link
            key={business.id}
            to={`/business/${business.id}`}
            className="card-link"
          >
            <ListItem key={business.id}>
              <ListItemAvatar>
                <Avatar 
                  imageUrl={business.imageUrl} 
                    // eslint-disable-next-line
                  style="medium" />
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
                  {business.category}
                </Typography>
              </Box>
              <Divider variant="middle" />
            </ListItem>
          </Link>
        ))}
      </List>
      <Fab
        variant="extended"
        onClick={openModal}
        color="primary"
        // eslint-disable-next-line no-use-before-define
        className={`btn ${css(styles.taskButton)} `}
      >
        Create a Business
      </Fab>
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
    }
  })
  