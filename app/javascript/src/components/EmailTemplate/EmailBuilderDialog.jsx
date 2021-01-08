import React, { useRef, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import EmailEditor from 'react-email-editor'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo'
import CreateEmailTemplateMutation from '../../graphql/mutations/email_templates'
import EmailDetailsDialog from './EmailDetailsDialog'
import MessageAlert from '../MessageAlert'
import { formatError } from '../../utils/helpers'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function EmailBuilderDialog({ open, handleClose }) {
  const emailEditorRef = useRef(null)
  const [createEmailTemplate] = useMutation(CreateEmailTemplateMutation)
  const [detailsOpen, setOpenDetails] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [message, setMessage] = useState({ isError: false, detail: '' })

  function handleAlertClose(){
    setAlertOpen(false)
  }
  function saveTemplate(details) {
    emailEditorRef.current.editor.exportHtml(data => {
      // You can also get the design details of the created email
      const { html } = data
      createEmailTemplate({
        variables: { ...details, body: html }
      })
      .then(() => {
        setMessage({ ...message, detail: 'Email Template successfully saved' })
        setAlertOpen(true)
        handleClose('closed')
        handleCloseDetails()
      })
      .catch(err => {
        console.log(err)
        setMessage({ isError: true, detail: formatError(err.message) })
        setAlertOpen(true)
      })
    })
  }

  const onLoad = () => {
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  }
  function handleCloseDetails() {
    setOpenDetails(false)
  }
  return (
    <>
      <EmailDetailsDialog
        open={detailsOpen}
        handleClose={handleCloseDetails}
        handleSave={saveTemplate}
      />
      <MessageAlert 
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={handleAlertClose}
      />
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar position="relative">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>

            <Button
              style={{ marginLeft: '85vw' }}
              autoFocus
              color="inherit"
              onClick={() => setOpenDetails(true)}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} style={{}} />
      </Dialog>
    </>
  )
}

EmailBuilderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}
