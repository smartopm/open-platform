/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import { useMutation, useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import EmailDetailsDialog from './EmailDetailsDialog';
import { formatError } from '../../../utils/helpers';
import CreateEmailTemplateMutation, { EmailUpdateMutation } from '../graphql/email_mutations';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { EmailTemplateQuery } from '../graphql/email_queries';
import { useScript } from '../../../utils/customHooks'
import { SnackbarContext } from '../../../shared/snackbar/Context';

// eslint-disable-next-line
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EmailBuilderDialog() {
  const [createEmailTemplate] = useMutation(CreateEmailTemplateMutation);
  const [updateEmailTemplate] = useMutation(EmailUpdateMutation);
  const [detailsOpen, setOpenDetails] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '', loading: false });
  const { t } = useTranslation(['email' ,'common'])
  const defaultLanguage = localStorage.getItem('default-language');
  const authState = useContext(Context)
  const { emailId } = useParams()
  const history = useHistory()
  const status = useScript('https://editor.unlayer.com/embed.js');
  const { unlayer } = window;
  const { data: templateData } = useQuery(
    EmailTemplateQuery,
    {
      variables: { id: emailId },
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    }
  );
  const [emailSubject, setEmailSubject] = useState(templateData?.emailTemplate?.subject || '');

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  function handleClose(){
    history.push('/mail_templates')
  }

  function updateTemplate(){
    setMessage({ ...message, loading: true });
    unlayer.exportHtml(data => {
      updateEmailTemplate({
        variables: { id: emailId, body: data.html, data, subject: (emailSubject || templateData?.emailTemplate?.subject) }
      })
        .then(() => {
          showSnackbar({ type: messageType.success, message: t('email.email_updated') });
          setMessage({ ...message, loading: false});
          handleClose();
        })
        .catch(err => {
          showSnackbar({ type: messageType.error, message: formatError(err.message) });
          setMessage({  ...message, loading: false });
        });
    });
  }

  function saveTemplate(details) {
    setMessage({ ...message, loading: true });
    unlayer.exportHtml(data => {
      const { html } = data;
      createEmailTemplate({
        variables: { ...details, body: html, data }
      })
        .then(() => {
          showSnackbar({ type: messageType.success, message: t('email.email_saved') });
          setMessage({ ...message, loading: false});
          handleClose();
          handleDetailsDialog();
        })
        .catch(err => {
          showSnackbar({ type: messageType.error, message: formatError(err.message) });
          setMessage({ loading: false});
        });
    });
  }

  function handleDetailsDialog() {
    setOpenDetails(!detailsOpen);
  }

  function initializeUnLayer () {
    unlayer.init({
      id: 'email-editor-container',
      displayMode: 'web',
      locale: authState.user?.community.locale
    })
  }

  function updateEmailSubject(details) {
    setEmailSubject(details?.subject);
    handleDetailsDialog();
  }

  useEffect(() => {
    if(status === 'ready'){
      initializeUnLayer();
    }
  }, [status])

  useEffect(() => {
    if(status === 'ready' && emailId && templateData?.emailTemplate?.data) {
      unlayer.loadDesign(templateData?.emailTemplate.data?.design)
    }
  }, [emailId, templateData, status])

  return (
    <>
      <EmailDetailsDialog
        open={detailsOpen}
        handleClose={handleDetailsDialog}
        handleSave={emailId ? updateEmailSubject : saveTemplate}
        loading={message.loading}
        dialogHeader={emailId ? t('email.subject_update_header') : t('email.template_create_header')}
        initialData={{
        name: templateData?.emailTemplate?.name || '',
        subject: emailSubject || templateData?.emailTemplate?.subject || ''
      }}
        action={emailId ? 'update' : 'create'}
      />
      <Dialog fullScreen open onClose={handleClose} TransitionComponent={Transition} data-testid="fullscreen_dialog">
        <AppBar position="relative">
          <Toolbar>
            <IconButton
              edge="start"
              data-testid="close_btn"
              onClick={handleClose}
              aria-label="close"
              size="large"
            >
              <CloseIcon />
            </IconButton>
            <div style={{ marginLeft: '75vw' }}>
              {emailId && (
              <Button
                onClick={handleDetailsDialog}
                disabled={message.loading}
                data-testid="edit_subject_btn"
                style={{background: 'white'}}
              >
                {t('email.edit_subject')}
              </Button>
          )}
              <Button
                autoFocus
                onClick={emailId ?  updateTemplate : handleDetailsDialog}
                disabled={message.loading}
                data-testid="submit_btn"
                style={{background: 'white', marginLeft: '5px'}}
              >
                {`${message.loading ? t('common:form_actions.saving') : emailId ? t('common:form_actions.update') :  t('common:form_actions.save')}`}
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <div id="email-editor-container" style={{ minHeight: '700px', minWidth: '1024px'}} />
      </Dialog>
    </>
);
}