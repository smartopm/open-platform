/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import EmailBuilderDialog from './EmailBuilderDialog'

export default function MailTemplateList() {
  const [templateDialogOpen, setDialogOpen] = useState(false)

  function handleTemplateDialog(){
    setDialogOpen(!templateDialogOpen)
  }

  return (
    <div className="container">
      <EmailBuilderDialog open={templateDialogOpen} handleClose={handleTemplateDialog} />

      <Fab
        variant="extended"
        color="primary"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 57,
          color: 'white',
        }}
        onClick={() => {
          handleTemplateDialog()
        }}
      >
        <AddIcon />
        {' '}
        Create
      </Fab>
    </div>
  )
}
