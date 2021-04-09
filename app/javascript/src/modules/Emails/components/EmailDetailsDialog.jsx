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

export default function EmailDetailsDialog({ open, handleClose, handleSave, loading }) {
  const [details, setDetails] = useState({ name: '', subject: '' })
  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Email Details</DialogTitle>
      <DialogContent>
        <TextField
          label="Template Name"
          className="form-control"
          aria-label="template_name"
          inputProps={{ 'data-testid': 'template_name' }}
          name="templateName"
          value={details.name}
          onChange={event =>
            setDetails({ ...details, name: event.target.value })}
          required
        />
        <TextField
          label="Template Subject"
          className="form-control"
          aria-label="template_subject"
          inputProps={{ 'data-testid': 'template_subject' }}
          name="templateSubject"
          value={details.subject}
          onChange={event =>
            setDetails({ ...details, subject: event.target.value })}
          required
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
          disabled={loading}
          data-testid="action_btn"
        >
          {`${loading ? 'Saving Changes' : ' Save Changes'}`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


EmailDetailsDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
}
