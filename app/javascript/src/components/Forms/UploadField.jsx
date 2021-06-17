import React from 'react'
import { AddCircleOutline } from '@material-ui/icons'
import DoneIcon from '@material-ui/icons/Done'
import { Button, FormHelperText } from '@material-ui/core'
import PropTypes from 'prop-types'

export default function UploadField({ detail, upload, editable, uploaded }) {
  return (
    <>
      <label htmlFor={`button-${detail.label}`}>
        <FormHelperText
          style={{
            margin: '4px 4px 0 0',
          }}
        >
          {detail.label}
        </FormHelperText>
        <br />
        <input
          type="file"
          name={`image-${detail.label}`}
          id={`button-${detail.label}`}
          aria-label={`upload_field_${detail.label}`}
          capture
          onChange={upload}
          readOnly={editable}
          hidden
        />
        <Button
          variant="text"
          component="span"
          aria-label={`upload_button_${detail.label}`}
          disabled={editable}
          startIcon={detail.type === 'file' && uploaded ? <DoneIcon /> : <AddCircleOutline />}
        >
          {uploaded ? 'File Uploaded' : 'Upload File'}
        </Button>
      </label>
    </>
  )
}

UploadField.propTypes = {
  detail: PropTypes.shape({
    type: PropTypes.string,
    label: PropTypes.string
  }).isRequired,
  upload: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  uploaded: PropTypes.bool.isRequired
}
