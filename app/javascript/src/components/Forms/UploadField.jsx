import React from 'react'
import { AddCircleOutline } from '@material-ui/icons'
import DoneIcon from '@material-ui/icons/Done';
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types'


export default function UploadField({ status, upload }) {
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
            hidden
          />
          <Button 
            variant="text" 
            component="span"
            aria-label="upload_button"
            startIcon={status === 'DONE' ? <DoneIcon /> : <AddCircleOutline />}
          >
            { status === 'DONE' ? 'File Uploaded' :  'Upload File'}
          </Button>
        </label> 
      </>
    )
  }

UploadField.propTypes = {
      status: PropTypes.string.isRequired,
      upload: PropTypes.func.isRequired,
}