/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useMutation } from 'react-apollo';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import EmailDetailsDialog from './EmailDetailsDialog';
import MailTemplateItem from './MailTemplateItem';
import MessageAlert from '../../../components/MessageAlert';
import { EmailTemplatesQuery } from '../graphql/email_queries';
import CreateEmailTemplateMutation from '../graphql/email_mutations';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../components/CenteredContent';
import { formatError, useParamsQuery } from '../../../utils/helpers';
import Paginate from '../../../components/Paginate';
import ListHeader from '../../../shared/list/ListHeader';
import PageWrapper from '../../../shared/PageWrapper';

export default function MailTemplateList() {
  const [currentEmail, setCurrentEmail] = useState({});
  const [emailDetailsDialogOpen, setEmailDetailsDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '', loading: false });
  const [createEmailTemplate] = useMutation(CreateEmailTemplateMutation);
  const path = useParamsQuery();
  const type = path.get('type');
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const { t } = useTranslation(['email', 'common'])

  const mailListHeader = [
    { title: 'Name', value: t('common:table_headers.name'), col: 2 },
    { title: 'Subject', value: t('common:table_headers.subject'), col: 5 },
    { title: 'Date Created', value: t('common:table_headers.date_created'), col: 1 },
    { title: 'Tag', value: t('common:table_headers.tag'), col: 1 },
    { title: 'Menu', value: t('common:table_headers.menu'), col: 1 }
  ];

  const { loading, error, data, refetch } = useQuery(EmailTemplatesQuery, {
    errorPolicy: 'all',
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network'
  });

  const history = useHistory();

  useEffect(() => {
    if (type === 'duplicate') {
      setEmailDetailsDialogOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  function handleTemplateDialog() {
    history.push(`/mail_templates/new`);
  }

  function handleClose() {
    history.replace(`/mail_templates`);
    setEmailDetailsDialogOpen(false)
  }

  function handleOpenEmailDialog(emailData) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(`/mail_templates/${emailData.id}`, '_self')
  }

  function handleDuplicateTemplate(emailData){
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
        setMessage({ ...message, detail: t('email.duplicated'), loading: false});
        setAlertOpen(true);
        handleClose();
        refetch();
      })
      .catch(err => {
        setMessage({ isError: true, detail: formatError(err.message), loading: false});
        setAlertOpen(true);
      });
  }

  if (loading) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error?.message)}</CenteredContent>;

  return (
    <PageWrapper>
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
      <ListHeader headers={mailListHeader} />
      {data?.emailTemplates.map(email => (
        <MailTemplateItem
          key={email.id}
          email={email}
          onTemplateClick={handleOpenEmailDialog}
          onTemplateDuplicate={handleDuplicateTemplate}
          headers={mailListHeader}
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
        {t('common:menu.create')}
      </Fab>
    </PageWrapper>
  );
}
