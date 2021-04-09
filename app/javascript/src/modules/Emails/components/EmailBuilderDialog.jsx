/* eslint-disable no-nested-ternary */
import React, { useRef, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import EmailEditor from 'react-email-editor';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import EmailDetailsDialog from './EmailDetailsDialog';
import MessageAlert from '../../../components/MessageAlert';
import { formatError } from '../../../utils/helpers';
import CreateEmailTemplateMutation, { EmailUpdateMutation } from '../graphql/email_mutations';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EmailBuilderDialog({ initialData, open, handleClose, emailId }) {
  const emailEditorRef = useRef(null);
  const [createEmailTemplate] = useMutation(CreateEmailTemplateMutation);
  const [updateEmailTemplate] = useMutation(EmailUpdateMutation);
  const [detailsOpen, setOpenDetails] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '', loading: false });

  function handleAlertClose() {
    setAlertOpen(false);
  }

  function updateTemplate(){
    setMessage({ ...message, loading: true });
    emailEditorRef.current.editor.exportHtml(data => {
      updateEmailTemplate({
        variables: { id: emailId, body: data.html, data }
      })
        .then(() => {
          setMessage({ ...message, detail: 'Email Template successfully updated' });
          setAlertOpen(true);
          handleClose();
        })
        .catch(err => {
          setMessage({ isError: true, detail: formatError(err.message), loading: false });
          setAlertOpen(true);
        });
    });
  }

  function saveTemplate(details) {
    setMessage({ ...message, loading: true });
    emailEditorRef.current.editor.exportHtml(data => {
      const { html } = data;
      createEmailTemplate({
        variables: { ...details, body: html, data }
      })
        .then(() => {
          setMessage({ ...message, detail: 'Email Template successfully saved', loading: false});
          setAlertOpen(true);
          handleClose();
          handleDetailsDialog();
        })
        .catch(err => {
          setMessage({ isError: true, detail: formatError(err.message), loading: false});
          setAlertOpen(true);
        });
    });
  }

  function onLoad() {
    // avoid preloading previous state into the editor
    if (emailId) {
      if (emailEditorRef.current) {
        emailEditorRef.current.loadDesign(initialData.data.design);
      } else {
        // wait for the editor to initialize
        setTimeout(() => emailEditorRef.current.loadDesign(initialData.data.design), 3000);
      }
    }
  }

  function handleDetailsDialog() {
    setOpenDetails(!detailsOpen);
  }
  return (
    <>
      <EmailDetailsDialog
        open={detailsOpen}
        handleClose={handleDetailsDialog}
        handleSave={saveTemplate}
        loading={message.loading}
      />
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={handleAlertClose}
      />
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>

            <Button
              style={{ marginLeft: '85vw' }}
              autoFocus
              color="inherit"
              onClick={emailId ?  updateTemplate : handleDetailsDialog}
              disabled={message.loading}
            >
              {`${emailId ? 'Update' : emailId && message.loading ? 'Saving ...' : 'Save'}`}
            </Button>
          </Toolbar>
        </AppBar>
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
      </Dialog>
    </>
  );
}
EmailBuilderDialog.defaultProps = {
  initialData: {},
  emailId: ''
};
EmailBuilderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  emailId: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  initialData: PropTypes.object
};
