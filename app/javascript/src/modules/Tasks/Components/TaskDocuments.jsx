import React, { Fragment, useState, useEffect } from 'react';
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
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
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
import { formatError } from '../../../utils/helpers';
import { UpdateNote } from '../../../graphql/mutations';

export default function TaskDocuments({ taskId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDoc, setCurrentDoc] = useState('');
  const [taskUpdate] = useMutation(UpdateNote);
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

  useEffect(() => {
    if (status === 'ERROR') {
      setMessageDetails({ isError: true, message: t('document.upload_error') });
      return
    };

    if(status === 'DONE') {
      taskUpdate({ variables: {  id: taskId, documentBlobId: signedBlobId }})
      .then(() => {
        refetch();
      })
      .catch((err) => {
        setMessageDetails({ isError: true, message: err.message });
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, taskId, signedBlobId, taskUpdate, refetch]);

  const menuOpen = Boolean(anchorEl);

  function handleOpenMenu(event, document) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentDoc(document);
  }

  function handleUploadDocument(event) {
    onChange(event.target.files[0]);
  }

  // we close the menu after downloading the file
  function handleDownload() {
    setAnchorEl(null);
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
      <Grid container alignItems="center">
        <Grid item xs={11} md={11}>
          <Typography variant="h6" data-testid="documents_title">
            {t('document.documents')}
          </Typography>
        </Grid>
        <Grid item xs={1} md={1} className={classes.addIcon}>
          <IconButton
            edge="end"
            aria-label="add_document"
            data-testid="add_document"
            component="label"
            color="primary"
          >
            <input
              hidden
              type="file"
              onChange={(event) => handleUploadDocument(event)}
              id='task-attach-file'
              data-testid="add_document_input"
            />
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" data-testid="opening_divider" />
      {documents?.length ? (
        <List>
          {documents.map(doc => (
            <Fragment key={doc.id}>
              <ListItem>
                <Grid container>
                  <Grid item xs={11}>
                    <ListItemText
                      disableTypography
                      primary={(
                        <Typography variant="body1" color="primary" style={{ fontWeight: 700 }} data-testid="filename">
                          {doc.filename}
                        </Typography>
                    )}
                      secondary={(
                        <Typography component="span" variant="body2" data-testid="uploaded_at">
                          {`${t('document.uploaded_at')}: ${dateToString(doc.created_at)}`}
                        </Typography>
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
      ) : (
        <>
          <Typography data-testid="no_documents" className={classes.noDocuments}>{t('document.no_documents')}</Typography>
        </>
      )}
      <Menu
        id={`long-menu-${currentDoc.id}`}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        keepMounted={false}
        data-testid="more_details_menu"
      >
        <MenuItem id="download_button" key="download" onClick={handleDownload}>
          <a
            href={currentDoc.url}
            download={currentDoc.filename}
            style={{ textDecoration: 'none', color: '#000000' }}
          >
            {t('document.download')}
          </a>
        </MenuItem>
      </Menu>
    </div>
  );
};

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
  taskId: PropTypes.string.isRequired,
};
