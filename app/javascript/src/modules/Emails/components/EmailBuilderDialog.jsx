/* eslint-disable no-nested-ternary */
import React, { useContext, useRef, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import EmailEditor from 'react-email-editor';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { useMutation, useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';
import EmailDetailsDialog from './EmailDetailsDialog';
import MessageAlert from '../../../components/MessageAlert';
import { formatError } from '../../../utils/helpers';
import CreateEmailTemplateMutation, { EmailUpdateMutation } from '../graphql/email_mutations';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { EmailTemplateQuery } from '../graphql/email_queries';

// eslint-disable-next-line
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EmailBuilderDialog() {
  const emailEditorRef = useRef(null);
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
  const { pathname } = useLocation()

  const { data: templateData } = useQuery(
    EmailTemplateQuery,
    {
      variables: { id: emailId },
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    }
  );

  console.log(pathname)
  // useEffect(() => {
  //   if(emailId){
  //     setEmailBuilderOpen(true)
  //   }
  //   // return  setEmailBuilderOpen(false)
  // }, [emailId]);

  function handleClose(){
    history.push('/mail_templates')
  }

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
    emailEditorRef.current.editor.exportHtml(data => {
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

  function onLoad() {
      if (emailEditorRef.current) {
        emailEditorRef.current.loadDesign(templateData?.emailTemplate.data?.design);
      } else {
        setTimeout(() => emailEditorRef.current.loadDesign(templateData?.emailTemplate.data?.design), 3000);
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
      <Dialog fullScreen open onClose={handleClose} TransitionComponent={Transition} data-testid="fullscreen_dialog">
        <AppBar position="relative">
          <Toolbar>
            <IconButton edge="start" data-testid="close_btn" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>

            <Button
              style={{ marginLeft: '85vw' }}
              autoFocus
              onClick={emailId ?  updateTemplate : handleDetailsDialog}
              disabled={message.loading}
              data-testid="submit_btn"
            >
              {`${message.loading ? t('common:form_actions.saving') : emailId ? t('common:form_actions.update') :  t('common:form_actions.save')}`}
            </Button>
          </Toolbar>
        </AppBar>
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} options={{ locale: defaultLanguage || authState.user?.community.locale }} />
      </Dialog>
    </>
  );
}