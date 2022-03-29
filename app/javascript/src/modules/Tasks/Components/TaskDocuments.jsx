/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState, useContext } from 'react';
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-apollo';
import { dateToString } from '../../../components/DateContainer';
import CenteredContent from '../../../shared/CenteredContent';
import MessageAlert from '../../../components/MessageAlert';
import { Spinner } from '../../../shared/Loading';
import { formatError, secureFileDownload } from '../../../utils/helpers';
import { DeleteNoteDocument } from '../../../graphql/mutations';
import { ActionDialog } from '../../../components/Dialog';
import ProgressBar from '../../../shared/ProgressBar';

import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';

export default function TaskDocuments({ data, loading, error, refetch, status }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDoc, setCurrentDoc] = useState('');
  const [open, setOpen] = useState(false);
  const [taskDocumentDelete] = useMutation(DeleteNoteDocument);
  const authState = useContext(AuthStateContext);
  const [messageDetails, setMessageDetails] = useState({ isError: false, message: '' });
  const classes = useStyles();
  const { t } = useTranslation('task');
  const userTaskPermissions = authState.user?.permissions.find(
    permissionObject => permissionObject.module === 'note'
  );
  const canDeleteDocument = userTaskPermissions
    ? userTaskPermissions.permissions.includes('can_delete_note_document')
    : false;

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

  function downloadFile(event, path) {
    event.preventDefault();
    secureFileDownload(path);
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
      });
  }

  if (loading) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error)}</CenteredContent>;
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
        <Grid item xs={8} md={12} data-testid='progress-bar'>
          <ProgressBar status={status} />
        </Grid>
      </Grid>
      {documents?.length > 0 && <Divider variant="fullWidth" data-testid="opening_divider" />}
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
                        size="large"
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
            onClick={event => downloadFile(event, currentDoc?.url)}
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
            data-testid="delete_button"
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

TaskDocuments.defaultProps = {
  error: null,
  refetch: () => {},
  status: null,
  data: {}
}

TaskDocuments.propTypes = {
  data: PropTypes.shape({
    task: PropTypes.shape({
      attachments: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          filename: PropTypes.string,
          uploaded_by: PropTypes.string,
          created_at: PropTypes.string
        })
      )
    })
  }),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  refetch: PropTypes.func,
  status: PropTypes.string
};
