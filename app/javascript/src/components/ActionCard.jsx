import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {
  Typography,
  IconButton,
  Avatar,
  CardContent,
  Card
} from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import ActionFlowIcon from './ActionFlows/ActionFlowIcon'
import ActionCardMenu from './ActionCardMenu'
import { titleize } from '../utils/helpers'

const useStyles = makeStyles({
  root: {
    width: 355,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px',
    margin: '10px 5px',
    border: '1px solid #E3E3E3',
    borderRadius: '5px'
  },
  menuButton: {
    left: '45%',
    top: '-4%'
  },
  avatar: {
    height: '70px',
    width: '70px',
    textAlign: 'center',
    backgroundColor: '#F0FFFC'
  },
  title: {
    fontSize: 18,
    textAlign: 'center'
  },
  content: {
    fontSize: 14,
    textAlign: 'center'
  },
  status: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 13
  },
  datetime: {
    marginTop: 12,
    textAlign: 'center'
  }
})

export default function ActionCard({ actionFlow, openFlowModal, refetch }) {
  const classes = useStyles()
  const date = new Date(actionFlow.createdAt)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  function isActive() {
    // Currently defaulting to Active, will be changed
    // after implementing active/inactive functionality
    return true

    // if (actionFlow.status === 'active') {
    //   return true
    // }
    // return false
  }

  function handleClose(event) {
    event.stopPropagation()
    setAnchorEl(null)
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }
  
  return (
    <Card className={classes.root} variant="outlined">
      <ActionCardMenu
        data={actionFlow}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
        openFlowModal={openFlowModal}
        refetch={refetch}
      />
      <IconButton
        className={classes.menuButton}
        onClick={handleOpenMenu}
        dataid={actionFlow.id}
      >
        <MoreHorizIcon />
      </IconButton>
      <Avatar className={classes.avatar}>
        <ActionFlowIcon />
      </Avatar>
      <CardContent>
        <Typography
          className={classes.title}
          variant="h6"
          component="h2"
          style={{ minHeight: '50px', marginBottom: '8px' }}
        >
          {actionFlow.title}
        </Typography>
        <Typography className={classes.content} gutterBottom>
          {`Event Type: On ${titleize(actionFlow.eventType)}`}
        </Typography>
        <Typography className={classes.content}>
          {actionFlow.description}
        </Typography>
        <Typography className={classes.datetime} variant="body2" component="p">
          Created:
          {' '}
          {`${date.getDate()} ${date
            .toDateString()
            .substr(4, 3)} ${date.getFullYear()}`}
        </Typography>
        <Typography
          className={classes.status}
          style={{ color: isActive ? '#66A59A' : '#ADADAD' }}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Typography>
      </CardContent>
    </Card>
  )
}

ActionCard.propTypes = {
  actionFlow: PropTypes.shape({
    id: PropTypes.string.isRequired,
    eventType: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  openFlowModal: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired
}
