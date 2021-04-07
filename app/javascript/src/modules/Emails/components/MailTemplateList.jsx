/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useQuery } from 'react-apollo';
import { Grid, IconButton } from '@material-ui/core';
import { MoreHorizOutlined } from '@material-ui/icons';
import EmailBuilderDialog from './EmailBuilderDialog';
import { EmailTemplatesQuery } from '../graphql/email_queries';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../components/CenteredContent';
import { formatError } from '../../../utils/helpers';
import { dateToString } from '../../../components/DateContainer';
import DataList from '../../../shared/list/DataList';
import MenuList from '../../../shared/MenuList';
import { Context } from '../../../containers/Provider/AuthStateProvider';

const mailListHeader = [
  { title: 'Name', col: 2 },
  { title: 'Subject', col: 2 },
  { title: 'Created At', col: 2 },
  { title: 'Menu', col: 2 }
];

export default function MailTemplateList() {
  const [templateDialogOpen, setDialogOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery(EmailTemplatesQuery);
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorElOpen = Boolean(anchorEl);
  const authState = useContext(Context);

  if (loading) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;

  function handleTemplateDialog() {
    setDialogOpen(!templateDialogOpen);
    refetch();
  }
  function handleOpenEmailDialog() {
    // here we will route to ?email=id
  }

  function handleOpenMenu(event) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  const menuList = [
    { content: 'Edit', isAdmin: true, color: '', handleClick: handleOpenEmailDialog }
  ];

  const menuData = {
    menuList,
    handleOpenMenu,
    anchorEl,
    open: anchorElOpen,
    userType: authState.user.userType,
    handleCloseMenu
  };

  return (
    <div className="container">
      <EmailBuilderDialog open={templateDialogOpen} handleClose={handleTemplateDialog} />

      <DataList
        keys={mailListHeader}
        data={renderEmailTemplates(data?.emailTemplates, menuData)}
        // clickable={{status: true, onclick: handleDetailsOpen}}
      />
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
export function renderEmailTemplates(emailData, menuData) {
  return emailData.map(email => {
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
      Menu: (
        <Grid item xs={12} md={1} data-testid="menu">
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            data-testid="receipt-menu"
            onClick={event => menuData.handleOpenMenu(event)}
          >
            <MoreHorizOutlined />
          </IconButton>
          <MenuList
            open={menuData.open}
            anchorEl={menuData.anchorEl}
            userType={menuData.userType}
            handleClose={menuData.handleCloseMenu}
            list={menuData.menuList}
          />
        </Grid>
      )
    };
  });
}
