/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useLazyQuery, useQuery, useMutation } from 'react-apollo';
import { useHistory } from 'react-router';
import { Grid, IconButton, Menu, MenuItem } from '@material-ui/core';
import EmailBuilderDialog from './EmailBuilderDialog';
import EmailDetailsDialog from './EmailDetailsDialog';
import MessageAlert from '../../../components/MessageAlert';
import { EmailTemplateQuery, EmailTemplatesQuery } from '../graphql/email_queries';
import CreateEmailTemplateMutation from '../graphql/email_mutations';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../components/CenteredContent';
import { formatError, useParamsQuery } from '../../../utils/helpers';
import { dateToString } from '../../../components/DateContainer';
import DataList from '../../../shared/list/DataList';
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
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [emailDetailsDialogOpen, setEmailDetailsDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '', loading: false });
  const [createEmailTemplate] = useMutation(CreateEmailTemplateMutation);
  const path = useParamsQuery();
  const emailId = path.get('email');
  const type = path.get('type');
  const limit = 50;
  const [offset, setOffset] = useState(0);

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
    setActionMenuOpen(null);
    setEmailDetailsDialogOpen(false)
  }

  function handleOpenEmailDialog(_event, emailData) {
    history.push(`/mail_templates?email=${emailData.id}`);
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
        setMessage({ ...message, detail: 'Email Template successfully duplicated', loading: false});
        setAlertOpen(true);
        handleClose();
        refetch();
      })
      .catch(err => {
        setMessage({ isError: true, detail: formatError(err.message), loading: false});
        setAlertOpen(true);
      });
  }

  function handleEmailActionMenuClose(){
    setActionMenuOpen(null)
  } 

  function handleEmailActionMenuOpen(e){
    setActionMenuOpen(e.currentTarget)
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
        dialogHeader="Duplicate Email Template"
        initialData={{
          name: currentEmail.name || '',
          subject: currentEmail.subject || '' 
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
        <DataList
          key={email.id}
          keys={mailListHeader}
          hasHeader={false}
          data={[renderEmailTemplate({
            email,
            handleOpenEmailDialog,
            handleDuplicateTemplate,
            actionMenu: {
              open: actionMenuOpen,
              handleClose: handleEmailActionMenuClose,
              handleOpen: handleEmailActionMenuOpen,
            }
          })]}
          // handleClick={event => handleOpenEmailDialog(event, email)}
          // clickable
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
        Create
      </Fab>
    </div>
  );
}

// name, subject, createdAt
export function renderEmailTemplate({
  email,
  handleOpenEmailDialog,
  handleDuplicateTemplate,
  actionMenu: { open, handleClose, handleOpen }
}) {
  return {
    Name: (
      <Grid item xs={2} data-testid="name">
        {email.name}
      </Grid>
    ),
    Subject: (
      <Grid item xs={2} data-testid="subject">
        {email.subject}
      </Grid>
    ),
    'Date Created': (
      <Grid item xs={2} data-testid="createdat">
        {dateToString(email.createdAt)}
      </Grid>
    ),
    Tag: (
      <Grid item xs={2} data-testid="subject">
        {email.tag}
      </Grid>
    ),
    Menu: (
      <Grid item xs={2} sm={1}>
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleOpen}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={open}
          keepMounted
          open={Boolean(open)}
          onClose={handleClose}
        >
          <MenuItem onClick={event => handleOpenEmailDialog(event, email)}>Edit</MenuItem>
          <MenuItem onClick={() => handleDuplicateTemplate(email)}>Duplicate</MenuItem>
        </Menu>
      </Grid>
    )
  };
}
