import React from 'react'
import { AddCircleOutline } from '@material-ui/icons'
import DoneIcon from '@material-ui/icons/Done'
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types'

export default function UploadField({ detail, upload, editable }) {
  return (
    <>
      <label htmlFor="button-file">
        <input
          type="file"
          name="image"
          id="button-file"
          aria-label="upload_field"
          capture
          onChange={upload}
          readOnly={editable}
          hidden
        />
        <Button
          variant="text"
          component="span"
          aria-label="upload_button"
          disabled={editable}
          startIcon={detail.type === 'file' && detail.status === 'DONE' ? <DoneIcon /> : <AddCircleOutline />}
        >
          {detail.status === 'DONE' ? 'File Uploaded' : 'Upload File'}
        </Button>
      </label>
    </>
  )
}

UploadField.propTypes = {
  detail: PropTypes.shape({
    status: PropTypes.string,
    type: PropTypes.string
  }).isRequired,
  upload: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
}
