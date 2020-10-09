import React from 'react'
import { AddCircleOutline } from '@material-ui/icons'
import DoneIcon from '@material-ui/icons/Done';
import { Button } from '@material-ui/core'


export default function UploadField({ status, upload, updateProperty }) {
    return (
      <>
        <label htmlFor="button-file">
          <input
            type="file"
            name="image"
            id="button-file"
            capture
            onChange={upload}
            hidden
          />
          <Button 
            variant="text" 
            component="span" 
            startIcon={status === 'DONE' ? <DoneIcon /> : <AddCircleOutline />}
            onClick={updateProperty}
          >
            { status === 'DONE' ? 'File Uploaded' :  'Upload File'}
          </Button>
        </label> 
      </>
    )
  }