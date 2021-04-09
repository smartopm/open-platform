/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useLazyQuery, useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { Grid } from '@material-ui/core';
import EmailBuilderDialog from './EmailBuilderDialog';
import { EmailTemplateQuery, EmailTemplatesQuery } from '../graphql/email_queries';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../components/CenteredContent';
import { formatError, useParamsQuery } from '../../../utils/helpers';
import { dateToString } from '../../../components/DateContainer';
import DataList from '../../../shared/list/DataList';
import Paginate from '../../../components/Paginate';

const mailListHeader = [
  { title: 'Name', col: 2 },
  { title: 'Subject', col: 2 },
  { title: 'Created At', col: 2 }
];

export default function MailTemplateList() {
  const [templateDialogOpen, setDialogOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState({});
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
  }

  function handleOpenEmailDialog(_event, emailData) {
    history.push(`/mail_templates?email=${emailData.id}`);
  }

  return (
    <div className="container">
      <EmailBuilderDialog
        initialData={currentEmail}
        open={templateDialogOpen}
        handleClose={handleClose}
        emailId={emailId}
        refetchEmails={refetch}
      />
      {data?.emailTemplates.map(email => (
        <DataList
          key={email.id}
          keys={mailListHeader}
          hasHeader={false}
          data={[renderEmailTemplate(email)]}
          handleClick={event => handleOpenEmailDialog(event, email)}
          clickable
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
export function renderEmailTemplate(email) {
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
    'Created At': (
      <Grid item xs={2} data-testid="createdat">
        {dateToString(email.createdAt)}
      </Grid>
    )
  };
}
