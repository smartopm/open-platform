import React from 'react'
import { AddCircleOutline } from '@material-ui/icons'
import { Button } from '@material-ui/core'


export default function UploadField({ upload, updateProperty }) {
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
            startIcon={<AddCircleOutline />}
            onClick={updateProperty}
          >
            Upload File
          </Button>
        </label> 
      </>
    )
  }