/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { useMutation, useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import EmailDetailsDialog from './EmailDetailsDialog';
import MessageAlert from '../../../components/MessageAlert';
import { formatError } from '../../../utils/helpers';
import CreateEmailTemplateMutation, { EmailUpdateMutation } from '../graphql/email_mutations';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { EmailTemplateQuery } from '../graphql/email_queries';
import { useScript } from '../../../utils/customHooks'

// eslint-disable-next-line
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EmailBuilderDialog() {
  const [createEmailTemplate] = useMutation(CreateEmailTemplateMutation);
  const [updateEmailTemplate] = useMutation(EmailUpdateMutation);
  const [detailsOpen, setOpenDetails] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
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

  function handleClose(){
    history.push('/mail_templates')
  }

  function handleAlertClose() {
    setAlertOpen(false);
  }

  function updateTemplate(){
    setMessage({ ...message, loading: true });
    unlayer.exportHtml(data => {
      updateEmailTemplate({
        variables: { id: emailId, body: data.html, data, subject: (emailSubject || templateData?.emailTemplate?.subject) }
      })
        .then(() => {
          setMessage({ ...message, isError: false, detail: t('email.email_updated'), loading: false});
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
    unlayer.exportHtml(data => {
      const { html } = data;
      createEmailTemplate({
        variables: { ...details, body: html, data }
      })
        .then(() => {
          setMessage({ ...message, detail: t('email.email_saved'), loading: false});
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

  function handleDetailsDialog() {
    setOpenDetails(!detailsOpen);
  }

  function initializeUnLayer () {
    unlayer.init({
      id: 'email-editor-container',
      displayMode: 'web',
      locale: defaultLanguage || authState.user?.community.locale 
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
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={handleAlertClose}
      />
      <Dialog fullScreen open onClose={handleClose} TransitionComponent={Transition} data-testid="fullscreen_dialog">
        <AppBar position="relative">
          <Toolbar>
            <IconButton edge="start" data-testid="close_btn" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <div style={{ marginLeft: '80vw' }}>
              {emailId && (
              <Button
                onClick={handleDetailsDialog}
                disabled={message.loading}
                data-testid="edit_subject_btn"
              >
                {t('email.edit_subject')}
              </Button>
            )}
              <Button
                autoFocus
                onClick={emailId ?  updateTemplate : handleDetailsDialog}
                disabled={message.loading}
                data-testid="submit_btn"
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