/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useContext, useEffect } from 'react';
import { useMutation, useLazyQuery } from 'react-apollo';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParams } from 'react-router';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ForumIcon from '@mui/icons-material/Forum';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Spinner } from '../../../../shared/Loading';
import { dateToString } from '../../../../components/DateContainer';
import {
  formatError,
  secureFileDownload,
  useParamsQuery,
  sanitizeText,
  replaceDocumentMentions,
  removeNewLines
} from '../../../../utils/helpers';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import { ActionDialog } from '../../../../components/Dialog';
import { DeleteNoteDocument } from '../../../../graphql/mutations';
import MessageAlert from '../../../../components/MessageAlert';
import CenteredContent from '../../../../shared/CenteredContent';
import { checkLastItem } from '../utils';
import { DocumentCommentsQuery } from '../graphql/process_queries';
import CustomSkeleton from '../../../../shared/CustomSkeleton';

export default function ProjectDocument({ attachments, loading, refetch, error, heading }) {
  const { processId } = useParams();
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:900px)');
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDoc, setCurrentDoc] = useState('');
  const [messageDetails, setMessageDetails] = useState({ isError: false, message: '' });
  const [taskDocumentDelete] = useMutation(DeleteNoteDocument);
  const [open, setOpen] = useState(false);
  const [openDocuments, setOpenDocuments] = useState([]);
  const [hasBgColor, setHasBgColor] = useState(true);
  const menuOpen = Boolean(anchorEl);
  const { t } = useTranslation('task');
  const authState = useContext(AuthStateContext);
  const currentPath = useParamsQuery();
  const currentDocId = currentPath.get('document_id');
  const commentId = currentPath.get('comment_id');
  const userTaskPermissions = authState.user?.permissions.find(
    permissionObject => permissionObject.module === 'note'
  );
  const canDeleteDocument = userTaskPermissions
    ? userTaskPermissions.permissions.includes('can_delete_note_document')
    : false;

  const [loadComments, { loading: commentsLoading, data: documentCommentsData }] = useLazyQuery(
    DocumentCommentsQuery,
    {
      fetchPolicy: 'cache-and-network'
    }
  );

  useEffect(() => {
    if (attachments?.length) {
      // There's a custom hook for this effect but it's not working inside useEffect
      if (currentDocId) {
        loadComments({ variables: { taggedDocumentId: currentDocId } });
        setOpenDocuments([...openDocuments, currentDocId]);

        if (document.getElementById(commentId)) {
          document.getElementById(commentId).scrollIntoView({ behavior: 'smooth' });
        }
      }
      setTimeout(() => {
        setHasBgColor(false);
      }, 6000);
    }
  }, [attachments]);

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

  function openCommentAccordion(docId) {
    let updatedOpenDocuments = openDocuments;
    if (openDocuments.includes(docId)) {
      updatedOpenDocuments = updatedOpenDocuments.filter(id => id !== docId);
    } else {
      loadComments({ variables: { taggedDocumentId: docId } });
      updatedOpenDocuments = [...updatedOpenDocuments, docId];
    }
    setOpenDocuments(updatedOpenDocuments);
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
          {!matches && heading && (
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
              className={`${classes.children} ${!heading && index === 0 && classes.firstChild}`}
              style={checkLastItem(index, attachments) ? { borderBottom: '2px solid #F7F8F7' } : {}}
              id={att.id}
            >
              <Grid
                container
                justifyContent={!matches ? 'center' : undefined}
                alignItems={!matches ? 'center' : undefined}
              >
                <Grid item md={5} xs={10} style={{ textAlign: 'left' }}>
                  <Grid container direction="column">
                    <Grid item md={12} xs={12}>
                      <Typography variant="body2" className={classes.fileName}>
                        {att.filename}
                      </Typography>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Link
                        href={`/processes/${processId}/projects/${att.task_id}?tab=processes&document=${att.id}`}
                        color="primary"
                        underline="hover"
                      >
                        <Typography variant="caption">{att.task_name}</Typography>
                      </Link>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={2} xs={10}>
                  <Typography variant="caption" color="textSecondary">
                    {t('document.uploaded_at')}
                    :
                    {dateToString(att.created_at)}
                  </Typography>
                </Grid>
                <Grid item md={3} xs={10}>
                  <Typography variant="caption" color="textSecondary">
                    {t('document.uploaded_by')}
                    :
                    {att.uploaded_by}
                  </Typography>
                </Grid>
                <Grid item md={1} xs={1} style={matches ? { margin: '-80px 15px 0 -15px' } : {}}>
                  <IconButton
                    color="primary"
                    onClick={() => openCommentAccordion(att.id)}
                    data-testid="open-comments"
                    disabled={!(att.comment_count > 0)}
                  >
                    <ForumIcon />
                  </IconButton>
                  <Typography
                    variant="caption"
                    component="span"
                    color="primary"
                    style={{ marginLeft: '-6px' }}
                  >
                    {att.comment_count}
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
              {openDocuments.includes(att.id) && (
                <div style={{ backgroundColor: '#f5f5f4', margin: '8px 0 8px 16px' }}>
                  <Paper
                    style={{
                      boxShadow: '0px 0px 0px 1px #E0E0E0',
                      maxHeight: '500px',
                      overflowY: 'auto',
                      padding: '20px'
                    }}
                  >
                    {commentsLoading && openDocuments[openDocuments.length - 1] === att.id ? (
                      <CustomSkeleton variant="rectangular" width="100%" height="300px" />
                    ) : documentCommentsData?.documentComments?.length === 0 ? (
                      <CenteredContent>{t('task.no_comments_on_document')}</CenteredContent>
                    ) : (
                      documentCommentsData?.documentComments.map(comment => (
                        <div key={comment.id}>
                          <Grid
                            container
                            className={`${comment.id === commentId &&
                              hasBgColor &&
                              classes.bgHighlight}`}
                          >
                            <Grid item md={8} xs={12}>
                              <Grid item xs={12} style={{ display: 'flex' }}>
                                <Typography
                                  variant="caption"
                                  style={
                                    comment.status ? { margin: '0 15px' } : { marginRight: '15px' }
                                  }
                                >
                                  {dateToString(comment.createdAt)}
                                </Typography>
                                <>
                                  <Avatar
                                    src={comment.user.imageUrl}
                                    alt="avatar-image"
                                    style={{
                                      margin: '-2px 10px 0 0',
                                      width: '24px',
                                      height: '24px'
                                    }}
                                  />
                                  <Typography variant="caption">{comment.user.name}</Typography>
                                </>
                              </Grid>
                              <Typography variant="caption">
                                {replaceDocumentMentions(
                                  comment,
                                  `/processes/${processId}/projects?tab=documents&project_id=${att.task_id}&comment_id=${comment.id}`
                                )}
                              </Typography>
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <Link
                                href={`/processes/${processId}/projects/${comment.note.id}?tab=processes&detailTab=comment`}
                                color="primary"
                                underline="hover"
                              >
                                <Typography variant="caption">
                                  <span
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                      __html: sanitizeText(removeNewLines(comment.note.body))
                                    }}
                                  />
                                </Typography>
                              </Link>
                            </Grid>
                          </Grid>
                          <hr />
                        </div>
                      ))
                    )}
                  </Paper>
                </div>
              )}
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
  attachments: [],
  heading: true
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
  error: PropTypes.string,
  heading: PropTypes.bool
};

const useStyles = makeStyles(() => ({
  children: {
    padding: '10px 0',
    borderTop: '2px solid #F7F8F7'
  },
  firstChild: {
    paddingTop: 'unset',
    borderTop: 'unset'
  },
  fileName: {
    fontWeight: 600
  },
  documents: {
    padding: '20px 0'
  },
  bgHighlight: {
    borderRadius: '5px',
    backgroundColor: '#e9f3fc'
  }
}));
