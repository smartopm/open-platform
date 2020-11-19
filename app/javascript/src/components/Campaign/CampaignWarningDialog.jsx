import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import PropTypes from 'prop-types'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

export default function CampaignWarningDialog({
  open,
  handleClose,
  createCampaign
}) {
  const classes = useStyles()
  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          className={classes.title}
        >
          Warning
        </DialogTitle>
        <DialogContent style={{ margin: '15px', textAlign: 'center' }}>
          You are going to create a campaign for 2000+ users. We recommend using
          a smaller list. Do you still want to proceed?
        </DialogContent>
        <Divider />
        <DialogActions style={{ margin: '10px' }}>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={createCampaign}
            variant="contained"
            style={{ backgroundColor: '#dc402b', color: 'white' }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 10
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  title: {
    backgroundColor: '#fcefef',
    color: '#dc402b',
    borderBottom: '1px #f1a3a2 solid'
  },
  deleteCard: {
    fontSize: 14,
    fontWeight: 'bold'
  }
})

CampaignWarningDialog.propTypes = {
  createCampaign: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}
