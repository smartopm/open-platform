import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@material-ui/core'
import PropTypes from 'prop-types'

export default function EmailDetailsDialog({ open, handleClose, handleSave }) {
  const [details, setDetails] = useState({ name: '', subject: '' })
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Email Details</DialogTitle>
      <DialogContent>
        <TextField
          label="Template Name"
          className="form-control"
          aria-label="campaign_template_style"
          inputProps={{ 'data-testid': 'campaign_template_style' }}
          name="templateStyle"
          value={details.name}
          onChange={event =>
            setDetails({ ...details, name: event.target.value })}
        />
        <TextField
          label="Template Subject"
          className="form-control"
          aria-label="campaign_template_style"
          inputProps={{ 'data-testid': 'campaign_template_style' }}
          name="templateStyle"
          value={details.subject}
          onChange={event =>
            setDetails({ ...details, subject: event.target.value })}
        />
      </DialogContent>
      <br />
      <DialogActions style={{ justifyContent: 'flex-start' }}>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => handleSave(details)}
          color="primary"
          variant="contained"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

EmailDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired
}
