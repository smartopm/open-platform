/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState, useEffect, useContext } from 'react';
import {
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@material-ui/core';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useApolloClient } from 'react-apollo';
import { dateToString } from '../../../components/DateContainer';
import { useFileUpload } from '../../../graphql/useFileUpload';
import CenteredContent from '../../../shared/CenteredContent';
import MessageAlert from '../../../components/MessageAlert';
import { TaskDocumentsQuery } from '../graphql/task_queries';
import { Spinner } from '../../../shared/Loading';
import { formatError, secureFileDownload } from '../../../utils/helpers';
import { UpdateNote , DeleteNoteDocument } from '../../../graphql/mutations';
import { ActionDialog } from '../../../components/Dialog';
import ProgressBar from '../../../shared/ProgressBar';

import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'

export default function TaskDocuments({ taskId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDoc, setCurrentDoc] = useState('');
  const [open, setOpen] = useState(false);
  const [taskUpdate] = useMutation(UpdateNote);
  const [taskDocumentDelete] = useMutation(DeleteNoteDocument);
  const authState = useContext(AuthStateContext);
  const [messageDetails, setMessageDetails] = useState({ isError: false, message: '' });
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(TaskDocumentsQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network'
  });
  const { t } = useTranslation('task');
  const { onChange, signedBlobId, status } = useFileUpload({
    client: useApolloClient()
  });
  const userTaskPermissions = authState.user?.permissions.find(permissionObject => permissionObject.module === 'note');
  const canDeleteDocument = userTaskPermissions ? userTaskPermissions.permissions.includes('can_delete_note_document'): false

  useEffect(() => {
    if (status === 'ERROR') {
      setMessageDetails({ isError: true, message: t('document.upload_error') });
      return;
    }

    if (status === 'DONE') {
      taskUpdate({ variables: { id: taskId, documentBlobId: signedBlobId } })
        .then(() => {
          refetch();
        })
        .catch(err => {
          setMessageDetails({ isError: true, message: err.message });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, taskId, signedBlobId, taskUpdate, refetch]);

  const menuOpen = Boolean(anchorEl);

  function handleOpenMenu(event, document) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentDoc(document);
  }

  function handleCloseDialog() {
    setOpen(false);
    handleCloseMenu();
  }

  function handleCloseMenu() {
    setAnchorEl(null);
    setCurrentDoc(null);
  }

  function handleUploadDocument(event) {
    onChange(event.target.files[0]);
  }

  function downloadFile(event, path) {
    event.preventDefault();
    secureFileDownload(path)
  }

  function handleDeleteDocument() {
    taskDocumentDelete({ variables: { documentId: currentDoc?.id } })
    .then(() => {
      setMessageDetails({ isError: false, message: t('document.document_deleted') });
      handleCloseDialog();
      refetch();
    })
    .catch(err => {
      setMessageDetails({ isError: true, message: err.message });
      handleCloseDialog();
    })
  }

  if (loading) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  const documents = data.task?.attachments;
  return (
    <div className={classes.documentsSection}>
      <MessageAlert
        type={!messageDetails.isError ? 'success' : 'error'}
        message={messageDetails.message}
        open={!!messageDetails.message}
        handleClose={() => setMessageDetails({ ...messageDetails, message: '' })}
      />
      <ActionDialog
        open={open}
        type={t('misc.confirm')}
        message={t('document.delete_confirmation_message')}
        handleClose={handleCloseDialog}
        handleOnSave={handleDeleteDocument}
      />
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={8} md={10}>
          <ProgressBar status={status} />
        </Grid>
        <Grid item xs={4} md={2} className={classes.addIcon}>
          <IconButton
            edge="end"
            aria-label="add_document"
            data-testid="add_document"
            component="label"
            color="primary"
            style={{backgroundColor: 'transparent'}}
          >
            <input
              hidden
              type="file"
              onChange={event => handleUploadDocument(event)}
              id="task-attach-file"
              data-testid="add_document_input"
            />
            <div style={{display: 'flex'}}>
              <AddCircleIcon />
              <Typography style={{padding: '2px 0 0 5px'}} variant="caption">Add Document</Typography>
            </div>
          </IconButton>
        </Grid>
      </Grid>
      {documents?.length > 0 && (
        <Divider variant="fullWidth" data-testid="opening_divider" />
      )}
      {documents?.length > 0 && (
        <List>
          {documents.map(doc => (
            <Fragment key={doc.id}>
              <ListItem>
                <Grid container>
                  <Grid item xs={11}>
                    <ListItemText
                      disableTypography
                      primary={(
                        <Typography
                          variant="body1"
                          color="primary"
                          style={{ fontWeight: 700 }}
                          data-testid="filename"
                        >
                          {doc.filename}
                        </Typography>
                      )}
                      secondary={(
                        <>
                          <Typography component="span" variant="body2" data-testid="uploaded_at">
                            {`${t('document.uploaded_at')}: ${dateToString(doc.created_at)}`}
                          </Typography>
                          {doc.uploaded_by && (
                            <Typography
                              component="span"
                              variant="body2"
                              data-testid="uploaded_by"
                              style={{ marginLeft: '20px' }}
                            >
                              {`${t('document.uploaded_by')}: ${doc.uploaded_by}`}
                            </Typography>
                          )}
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={1} className="">
                    <ListItemSecondaryAction className={classes.menu}>
                      <IconButton
                        edge="end"
                        aria-label="more_details"
                        data-testid="more_details"
                        onClick={event => handleOpenMenu(event, doc)}
                        color="primary"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider variant="fullWidth" data-testid="closing_divider" />
            </Fragment>
          ))}
        </List>
      )}
      <Menu
        id={`long-menu-${currentDoc?.id}`}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => handleCloseMenu()}
        keepMounted={false}
        data-testid="more_details_menu"
      >
        <MenuItem id="download_button" key="download" onClick={() => handleCloseMenu()}>
          <a
            onClick={(event) => downloadFile(event, currentDoc?.url)}
            style={{ textDecoration: 'none', color: '#000000' }}
          >
            {t('document.download')}
          </a>
        </MenuItem>
        {canDeleteDocument && (
          <MenuItem
            id="delete_button"
            key="delete"
            onClick={() => setOpen(true)}
            data-testid='delete_button'
          >
            {t('document.delete')}
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  documentsSection: {
    marginTop: '-8px'
  },
  addIcon: {
    display: 'flex',
    justifyContent: 'end'
  },
  menu: {
    right: '0px'
  },
  noDocuments: {
    marginTop: '16px'
  }
}));

TaskDocuments.propTypes = {
  taskId: PropTypes.string.isRequired
};
