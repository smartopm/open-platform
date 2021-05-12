/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useLazyQuery, useQuery, useMutation } from 'react-apollo';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import EmailBuilderDialog from './EmailBuilderDialog';
import EmailDetailsDialog from './EmailDetailsDialog';
import MailTemplateItem from './MailTemplateItem';
import MessageAlert from '../../../components/MessageAlert';
import { EmailTemplateQuery, EmailTemplatesQuery } from '../graphql/email_queries';
import CreateEmailTemplateMutation from '../graphql/email_mutations';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../components/CenteredContent';
import { formatError, useParamsQuery } from '../../../utils/helpers';
import Paginate from '../../../components/Paginate';
import ListHeader from '../../../shared/list/ListHeader';

const mailListHeader = [
  { title: 'Name', col: 2 },
  { title: 'Subject', col: 5 },
  { title: 'Date Created', col: 1 },
  { title: 'Tag', col: 1 },
  { title: 'Menu', col: 1 }
];

export default function MailTemplateList() {
  const [templateDialogOpen, setDialogOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState({});
  const [emailDetailsDialogOpen, setEmailDetailsDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '', loading: false });
  const [createEmailTemplate] = useMutation(CreateEmailTemplateMutation);
  const path = useParamsQuery();
  const emailId = path.get('email');
  const type = path.get('type');
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const { t } = useTranslation(['email', 'common'])

  const { loading, error, data, refetch } = useQuery(EmailTemplatesQuery, {
    errorPolicy: 'all',
    variables: { limit, offset }
  });
  const [loadTemplate, { error: templateError, data: templateData, called }] = useLazyQuery(
    EmailTemplateQuery,
    {
      variables: { id: emailId },
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    }
  );
  const history = useHistory();

  useEffect(() => {
    if (emailId) {
      loadTemplate();
    }
    if (type === 'new') {
      setDialogOpen(true);
    }

    if (type === 'duplicate') {
      setEmailDetailsDialogOpen(true);
    }

    if (called && !templateError && emailId) {
      setCurrentEmail(templateData?.emailTemplate || {});
      setDialogOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailId, type, called, templateData]);

  if (loading) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error?.message)}</CenteredContent>;

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  function handleTemplateDialog() {
    history.push(`/mail_templates?type=new`);
  }

  function handleClose() {
    history.replace(`/mail_templates`);
    setDialogOpen(false);
    setEmailDetailsDialogOpen(false)
  }

  function handleOpenEmailDialog(emailData) {
    history.push(`/mail_templates?email=${emailData.id}`);
  }

  function handleDuplicateTemplate(emailData){
    console.log('to duplicate', emailData)
    const emailTemplate = getDuplicateEmailDetails(emailData)
    setCurrentEmail(emailTemplate);
    history.push(`/mail_templates?type=duplicate`);
  }

  function getDuplicateEmailDetails(emailData){
    return(emailData && emailData.name && emailData.subject && emailData.data ?
      (
        {
          ...emailData,
          name: `copy_of_${emailData.name}`,
          subject: `Copy of ${emailData.subject}`,
        }
      ) : undefined
    );
  }

  function handleDuplicateAndSaveTemplate(updatedDetails) {
    // ensure we have selected email template to duplicate
    if(!currentEmail.name && !currentEmail.subject){
      return;
    }

    const { data: { html }, data: editorData } = currentEmail;

    setMessage({ ...message, loading: true });
    createEmailTemplate({
      variables: { ...updatedDetails, body: html, data: editorData }
    })
      .then(() => {
        setMessage({ ...message, detail: t('email.email.duplicated'), loading: false});
        setAlertOpen(true);
        handleClose();
        refetch();
      })
      .catch(err => {
        setMessage({ isError: true, detail: formatError(err.message), loading: false});
        setAlertOpen(true);
      });
  }

  return (
    <div className="container">
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={() => setAlertOpen(false)}
      />
      <EmailDetailsDialog
        open={emailDetailsDialogOpen}
        handleClose={handleClose}
        handleSave={handleDuplicateAndSaveTemplate}
        loading={message.loading}
        dialogHeader={t('email.duplicate_email')}
        initialData={{
          name: currentEmail?.name || '',
          subject: currentEmail?.subject || '' 
        }}
      />
      <EmailBuilderDialog
        initialData={currentEmail}
        open={templateDialogOpen}
        handleClose={handleClose}
        emailId={emailId}
        refetchEmails={refetch}
      />
      <ListHeader headers={mailListHeader} />
      {data?.emailTemplates.map(email => (
        <MailTemplateItem
          key={email.id}
          email={email}
          onTemplateClick={handleOpenEmailDialog}
          onTemplateDuplicate={handleDuplicateTemplate}
        />
      ))}

      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          count={data?.emailTemplates.length}
          handlePageChange={paginate}
        />
      </CenteredContent>

      <Fab
        variant="extended"
        data-testid="create"
        color="primary"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 57,
          color: 'white'
        }}
        onClick={handleTemplateDialog}
      >
        <AddIcon />
        {t('common:misc.create')}
      </Fab>
    </div>
  );
}
