import React from 'react'
import { Typography, Container } from '@material-ui/core'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
export default function PostContent({ response }) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  })
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = () => {}
  return (
    <Container>
      <br />
      <Typography align="center" variant="h3" color="textSecondary">
        <strong>{response.title}</strong>
      </Typography>
      <br />
      <img className="img-fluid" src={response.post_thumbnail?.URL} alt="" />
      <div>
        <br />
        <br />
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Post a comment
        </Button>
      </div>
      <div
        className="wp_content container"
        dangerouslySetInnerHTML={{ __html: response.content }}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Post a comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Your Name"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            row={5}
            label="Comment"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

PostContent.propType = {
  response: PropTypes.shape({
    post_thumbnail: PropTypes.object,
    title: PropTypes.string,
    content: PropTypes.string
  })
}
