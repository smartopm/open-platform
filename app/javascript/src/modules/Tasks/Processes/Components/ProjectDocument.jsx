/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useContext } from 'react';
import { useMutation } from 'react-apollo';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParams } from 'react-router';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Spinner } from '../../../../shared/Loading';
import { dateToString } from '../../../../components/DateContainer';
import { formatError, secureFileDownload } from '../../../../utils/helpers';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import { ActionDialog } from '../../../../components/Dialog';
import { DeleteNoteDocument } from '../../../../graphql/mutations';
import MessageAlert from '../../../../components/MessageAlert';
import CenteredContent from '../../../../shared/CenteredContent';
import { checkLastItem } from '../utils'

export default function ProjectDocument({ attachments, loading, refetch, error }) {
  const { processId } = useParams();
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:900px)');
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDoc, setCurrentDoc] = useState('');
  const [messageDetails, setMessageDetails] = useState({ isError: false, message: '' });
  const [taskDocumentDelete] = useMutation(DeleteNoteDocument);
  const [open, setOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);
  const { t } = useTranslation('task');
  const authState = useContext(AuthStateContext);
  const userTaskPermissions = authState.user?.permissions.find(
    permissionObject => permissionObject.module === 'note'
  );
  const canDeleteDocument = userTaskPermissions
    ? userTaskPermissions.permissions.includes('can_delete_note_document')
    : false;

  function handleCloseMenu() {
    setAnchorEl(null);
    setCurrentDoc(null);
  }

  function downloadFile(event, path) {
    event.preventDefault();
    secureFileDownload(path);
  }

  function handleOpenMenu(event, document) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentDoc(document);
  }

  function handleCloseDialog() {
    setOpen(false);
    handleCloseMenu();
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

  return (
    <>
      {error && (
        <CenteredContent>
          <Typography>{formatError(error)}</Typography>
        </CenteredContent>
      )}
      <ActionDialog
        open={open}
        type={t('misc.confirm')}
        message={t('document.delete_confirmation_message')}
        handleClose={handleCloseDialog}
        handleOnSave={handleDeleteDocument}
      />
      <MessageAlert
        type={!messageDetails.isError ? 'success' : 'error'}
        message={messageDetails.message}
        open={!!messageDetails.message}
        handleClose={() => setMessageDetails({ ...messageDetails, message: '' })}
      />
      {loading ? (
        <Spinner />
      ) : Boolean(attachments) && attachments.length > 0 ? (
        <>
          {!matches && (
            <Typography
              variant="subtitle1"
              className={classes.documents}
              color="textSecondary"
              data-testid="documents"
            >
              {t('processes.documents')}
            </Typography>
          )}
          {attachments.map((att, index) => (
            <Grid
              key={att.id}
              className={classes.children}
              style={checkLastItem(index, attachments) ? { borderBottom: '2px solid #F7F8F7' } : {}}
            >
              <Grid
                container
                justifyContent={!matches ? 'center' : undefined}
                alignItems={!matches ? 'center' : undefined}
              >
                <Grid item md={6} xs={11} style={{ textAlign: 'left' }}>
                  <Grid container direction="column">
                    <Grid item md={12} xs={12}>
                      <Typography variant="body2" className={classes.fileName}>
                        {att.filename}
                      </Typography>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Link
                        href={`/processes/${processId}/projects/${att.task_id}?tab=processes`}
                        color="primary"
                        underline="hover"
                      >
                        <Typography variant="caption">{att.task_name}</Typography>
                      </Link>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={2} xs={11}>
                  <Typography variant="caption" color="textSecondary">
                    {t('document.uploaded_at')}
                    :
                    {' '}
                    {dateToString(att.created_at)}
                  </Typography>
                </Grid>
                <Grid item md={3} xs={11}>
                  <Typography variant="caption" color="textSecondary">
                    {t('document.uploaded_by')}
                    :
                    {' '}
                    {att.uploaded_by}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={1}
                  xs={1}
                  style={
                    matches ? { textAlign: 'right', marginTop: '-80px' } : { textAlign: 'right' }
                  }
                >
                  <IconButton
                    edge="end"
                    aria-label="more_details"
                    data-testid="more_details"
                    onClick={event => handleOpenMenu(event, att)}
                    color="primary"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </>
      ) : (
        <CenteredContent>
          <Typography>{t('document.no_document')}</Typography>
        </CenteredContent>
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
    </>
  );
}

ProjectDocument.defaultProps = {
  loading: false,
  refetch: () => {},
  error: null,
  attachments: []
};

ProjectDocument.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      task_id: PropTypes.string,
      created_at: PropTypes.string,
      uploaded_by: PropTypes.string,
      task_name: PropTypes.string
    })
  ),
  loading: PropTypes.bool,
  refetch: PropTypes.func,
  error: PropTypes.string
};

const useStyles = makeStyles(() => ({
  children: {
    padding: '10px 0',
    borderTop: '2px solid #F7F8F7'
  },
  fileName: {
    fontWeight: 600
  },
  documents: {
    padding: '20px 0'
  }
}));
