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
import EmailDetailsDialog from './EmailDetailsDialog'
import MessageAlert from '../../../components/MessageAlert'
import { formatError } from '../../../utils/helpers'
import CreateEmailTemplateMutation from '../graphql/email_mutations'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function EmailBuilderDialog({ initialData, open, handleClose }) {
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
        variables: { ...details, body: html, data }
      })
      .then(() => {
        setMessage({ ...message, detail: 'Email Template successfully saved' })
        setAlertOpen(true)
        handleClose('closed')
        handleCloseDetails()
      })
      .catch(err => {
        setMessage({ isError: true, detail: formatError(err.message) })
        setAlertOpen(true)
      })
    })
  }


  function onLoad(){
    // if(emailEditorRef.current){
      emailEditorRef.current.loadDesign(initialData.design);
    // }
  }
  console.log(emailEditorRef)

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
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
      </Dialog>
    </>
  )
}
EmailBuilderDialog.defaultProps = {
  initialData: {}
}
EmailBuilderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialData: PropTypes.object
}
