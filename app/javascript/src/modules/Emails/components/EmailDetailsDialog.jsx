import React, { useState,useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

export default function EmailDetailsDialog({ open, handleClose, handleSave, loading, dialogHeader, initialData, action }) {
  const [details, setDetails] = useState({ name: '', subject: '' })
  const { t } = useTranslation('common')

  useEffect(() => {
    if(initialData.name && initialData.subject){
      setDetails(initialData)
    }
  }, [initialData])
  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{dialogHeader}</DialogTitle>
      <DialogContent>
        {action === 'create' && (
          <TextField
            label={t('form_fields.template_name')}
            className="form-control"
            aria-label="template_name"
            inputProps={{ 'data-testid': 'template_name' }}
            name="name"
            value={details.name || initialData.name}
            onChange={event =>
              setDetails({ ...details, name: event.target.value })}
            required
          />
        )}
        <TextField
          label={t('form_fields.template_subject')}
          className="form-control"
          aria-label="template_subject"
          inputProps={{ 'data-testid': 'template_subject' }}
          name="templateSubject"
          value={details.subject || initialData.subject}
          onChange={event =>
            setDetails({ ...details, subject: event.target.value })}
          required
        />
      </DialogContent>
      <br />
      <DialogActions style={{ justifyContent: 'flex-start' }}>
        <Button onClick={handleClose} color="secondary" variant="outlined" data-testid="cancel_btn">
          {t('form_actions.cancel')}
        </Button>
        <Button
          onClick={() => handleSave(details)}
          color="primary"
          variant="contained"
          disabled={loading}
          data-testid="save_btn"
        >
          {`${loading ? t('form_actions.saving') : t('form_actions.save')}`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

EmailDetailsDialog.defaultProps = {
  dialogHeader: 'Add Email Details',
  initialData: {
    name: '',
    subject: '',
  },
  action: 'create'
}

EmailDetailsDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
  initialData: PropTypes.object,
  dialogHeader: PropTypes.string,
  action: PropTypes.string
}
