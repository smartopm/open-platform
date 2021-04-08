/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { Grid } from '@material-ui/core';
import EmailBuilderDialog from './EmailBuilderDialog';
import { EmailTemplatesQuery } from '../graphql/email_queries';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../components/CenteredContent';
import { formatError } from '../../../utils/helpers';
import { dateToString } from '../../../components/DateContainer';
import DataList from '../../../shared/list/DataList';

const mailListHeader = [
  { title: 'Name', col: 2 },
  { title: 'Subject', col: 2 },
  { title: 'Created At', col: 2 },
];

export default function MailTemplateList() {
  const [templateDialogOpen, setDialogOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState({})

  const { loading, error, data, refetch } = useQuery(EmailTemplatesQuery);
  const history = useHistory()

  if (loading) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;

  function handleTemplateDialog() {
    setDialogOpen(!templateDialogOpen);
    refetch();
  }
  function handleOpenEmailDialog(_event, emailData) {
    setCurrentEmail(emailData.data)
    history.push(`/mail_templates?email=${emailData.id}`)
    // setDialogOpen(!templateDialogOpen);
  }

  return (
    <div className="container">
      <EmailBuilderDialog initialData={currentEmail} open={templateDialogOpen} handleClose={handleTemplateDialog} />
      {
        data?.emailTemplates.map(email => (
          <DataList
            key={email.id}
            keys={mailListHeader}
            hasHeader={false}
            data={[renderEmailTemplate(email)]}
            handleClick={event => handleOpenEmailDialog(event, email)}
            clickable
          />
        ))
      }

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
        onClick={() => {
          handleTemplateDialog();
        }}
      >
        <AddIcon />
        {' '}
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
      ),
    };
}
