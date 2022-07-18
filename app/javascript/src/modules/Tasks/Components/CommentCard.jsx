/* eslint-disable max-statements */
import React, { Fragment, useState, useContext, useEffect } from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-apollo';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useHistory, useParams } from 'react-router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TaskDelete from './TaskDelete';
import EditField from './TaskCommentEdit';
import { dateToString } from '../../../components/DateContainer';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { groupComments, lastRepliedComment, isDiscussionResolved } from '../Processes/utils';
import CommentTextField from '../../../shared/CommentTextField';
import { useParamsQuery, objectAccessor, replaceDocumentMentions } from '../../../utils/helpers';
import { TaskComment } from '../../../graphql/mutations';
import { ResolveComments } from '../graphql/task_mutation';

export default function CommentCard({
  comments,
  refetch,
  commentsRefetch,
  forAccordionSection,
  mentionsData,
  taggedDocOnClick,
}) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState(null);
  const [body, setBody] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentComment, setCurrentComment] = useState('');
  const [replyingGroupingId, setReplyingGroupingId] = useState(null);
  const [replyValue, setReplyValue] = useState('');
  const [mentionedDocuments, setMentionedDocuments] = useState([]);
  const [highlightDiscussion, setHighlightDiscussion] = useState(false);
  const [error, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const menuOpen = Boolean(anchorEl);
  const authState = useContext(AuthStateContext);
  const classes = useStyles();
  const path = useParamsQuery();
  const { processId, id: projectId } = useParams();
  const history = useHistory();
  const replyingDiscussion = path.get('replying_discussion');
  const [commentCreate] = useMutation(TaskComment);
  const [resolveComments] = useMutation(ResolveComments);

  const { t } = useTranslation(['task', 'common']);

  const groupedComments = groupComments(comments);
  const groupingIds = Object.keys(groupedComments);

  // A way to make sure non-reply comments are rendered last
  if (groupingIds.includes('no-group')) {
    groupingIds.push(groupingIds.splice(groupingIds.indexOf('no-group'), 1)[0]);
  }

  useEffect(() => {
    let timeId;
    if (replyingDiscussion) {
      setHighlightDiscussion(true);
      timeId = setTimeout(() => {
        scrollDiscussionIntoView(replyingDiscussion);
      }, 1000);
    }

    const secondTimerId = setTimeout(() => {
      setHighlightDiscussion(false);
    }, 4000);

    return () => {
      clearTimeout(timeId);
      clearTimeout(secondTimerId);
    };
  }, [replyingDiscussion]);

  function scrollDiscussionIntoView(groupingId) {
    document.getElementById(groupingId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  function handleClose() {
    setEdit(false);
    setEditId(null);
  }

  function deleteClick(comment) {
    setId(comment.id);
    setImageUrl(comment.user.imageUrl);
    setName(comment.user.name);
    setBody(comment.body);
    setOpen(true);
    setAnchorEl(null);
  }

  function editClick(comment) {
    setEditId(comment.id);
    setAnchorEl(null);
  }

  function handleOpenMenu(event, comment) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentComment(comment);
  }

  function openReplyInput(currentGroupingId) {
    setReplyValue('');
    setReplyingGroupingId(currentGroupingId);
    if (window.history.pushState) {
      window.history.pushState(
        null,
        '',
        `?tab=processes&detailTab=comments&replying_discussion=${currentGroupingId}`
      );
    }
  }

  function onReplySubmit(event, groupingId) {
    event.preventDefault();
    setLoading(true);
    commentCreate({
      variables: {
        noteId: projectId,
        body: replyValue,
        replyRequired: true,
        replyFromId: lastRepliedComment(groupedComments, groupingId).user.id,
        taggedDocuments: mentionedDocuments,
        groupingId,
      },
    })
      .then(() => {
        setReplyValue('');
        refetch();
        commentsRefetch();
        setLoading(false);
      })
      .catch(err => {
        setErrorMessage(err);
        setLoading(false);
      });
  }

  function goToReplyComment(groupingId, taskId) {
    if (projectId !== taskId) {
      history.push(
        `/processes/${processId}/projects/${taskId}?tab=processes&detailTab=comments&replying_discussion=${groupingId}`
      );
    } else {
      // TODO(Nurudeen): scroll reply into view without reloading
      window.location = `${window.location.pathname}?tab=processes&detailTab=comments&replying_discussion=${groupingId}`;
    }
  }

  function onResolveComments(groupingId) {
    resolveComments({
      variables: {
        noteId: projectId,
        groupingId,
      },
    })
      .then(() => {
        setReplyValue('');
        refetch();
        commentsRefetch();
      })
      .catch(err => {
        setErrorMessage(err);
      });
  }

  return (
    <>
      <>
        <Menu
          id={`comment-menu-${currentComment.id}`}
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          keepMounted={false}
          data-testid="more_details_menu"
        >
          <MenuItem
            id="edit_button"
            data-testid="edit"
            key="edit"
            onClick={() => editClick(currentComment)}
          >
            {t('common:menu.edit')}
          </MenuItem>
          <MenuItem
            id="delete_button"
            data-testid="delete"
            key="delete"
            onClick={() => deleteClick(currentComment)}
          >
            {t('common:menu.delete')}
          </MenuItem>
        </Menu>
        {!!error.length && <p className="text-center">{error}</p>}
        <List>
          {groupingIds.map((groupingId, index) => (
            <div
              key={groupingId}
              id={forAccordionSection ? groupingId : ''}
              style={{
                borderRadius: '10px',
                paddingTop: '8px',
                paddingLeft: '8px',
                background: `${
                  forAccordionSection && highlightDiscussion && replyingDiscussion === groupingId
                    ? '#e9f3fc'
                    : ''
                }`,
              }}
            >
              {forAccordionSection && index === 0 && <hr />}
              {(groupingId === 'no-group'
                ? objectAccessor(groupedComments, groupingId)
                : objectAccessor(groupedComments, groupingId)?.reverse()
              )?.map(com => (
                <Fragment key={com.id}>
                  {!edit && editId !== com.id && (
                    <ListItem style={{ marginBottom: '20px' }}>
                      <ListItemText
                        disableTypography
                        secondary={(
                          <>
                            <div style={{ display: 'flex' }}>
                              <Avatar
                                src={com.user.imageUrl}
                                alt="avatar-image"
                                style={{ margin: '-7px 10px 0 0' }}
                              />
                              <div
                                data-testid="comment-body"
                                style={{
                                  color: '#575757',
                                  overflowWrap: 'anywhere',
                                  marginTop: '-20px',
                                }}
                              >
                                <Typography
                                  component="span"
                                  variant="body2"
                                  style={{ fontSize: '12px' }}
                                >
                                  {dateToString(com.createdAt)}
                                </Typography>
                                {com.replyRequired && !com.repliedAt && (
                                  <Typography
                                    data-testid="needs_reply_text"
                                    component="span"
                                    variant="body2"
                                    style={{
                                      marginLeft: '15px',
                                      fontSize: '12px',
                                      color: '#C5261B',
                                      textDecoration: `${
                                        !forAccordionSection ? 'underline' : 'none'
                                      }`,
                                      cursor: `${!forAccordionSection ? 'pointer' : ''}`,
                                    }}
                                    onClick={() =>
                                      !forAccordionSection
                                        ? goToReplyComment(groupingId, com.noteId)
                                        : {}
                                    }
                                  >
                                    {`${t('task.needs_reply_from')} ${com.replyFrom.name}`}
                                  </Typography>
                                )}
                                {com.replyRequired && com.repliedAt && forAccordionSection && (
                                  <Typography
                                    data-testid="replied_text"
                                    component="span"
                                    variant="body2"
                                    style={{
                                      marginLeft: '15px',
                                      fontSize: '12px',
                                    }}
                                  >
                                    {`${com.replyFrom.name} ${t('task.replied')} ${dateToString(
                                      com.repliedAt
                                    )}`}
                                  </Typography>
                                )}
                                <br />
                                <Typography component="span" variant="body2">
                                  {com.user.name}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  {replaceDocumentMentions(
                                    com,
                                    taggedDocOnClick
                                  )}
                                </Typography>
                              </div>
                            </div>
                          </>
                        )}
                      />
                      {(authState.user.userType === 'admin' ||
                        com.user.id === authState.user.id) && (
                        <ListItemSecondaryAction className={classes.kabab}>
                          <IconButton
                            edge="end"
                            aria-label="more_details"
                            data-testid="more_details"
                            onClick={event => handleOpenMenu(event, com)}
                            color="primary"
                            size="large"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  )}
                  {editId === com.id && (
                    <EditField
                      handleClose={handleClose}
                      data={com}
                      refetch={refetch}
                      commentsRefetch={commentsRefetch}
                      mentionsData={mentionsData}
                    />
                  )}
                </Fragment>
              ))}
              {forAccordionSection && isDiscussionResolved(groupedComments, groupingId) ? (
                <div style={{ marginTop: '-22px', color: '#575757' }}>
                  <IconButton
                    aria-controls="resolve-icon"
                    aria-haspopup="true"
                    data-testid="resolve-icon"
                    size="medium"
                  >
                    <CheckCircleIcon htmlColor="#4caf50" />
                  </IconButton>
                  <Typography
                    component="span"
                    variant="body2"
                    data-testid="comments-resolved-text"
                    style={{ fontSize: '13px', fontWeight: '500', marginLeft: '-5px' }}
                  >
                    {t('task.all_comments_resolved')}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    style={{ fontSize: '12px', marginLeft: '20px' }}
                  >
                    {lastRepliedComment(groupedComments, groupingId)?.replyFrom.name}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    style={{ fontSize: '12px', marginLeft: '10px' }}
                  >
                    {dateToString(lastRepliedComment(groupedComments, groupingId)?.repliedAt)}
                  </Typography>
                </div>
              ) : (
                forAccordionSection &&
                groupingId !== 'no-group' &&
                lastRepliedComment(groupedComments, groupingId).replyFrom.id ===
                  authState.user.id && (
                  <div style={{ marginTop: '-22px' }}>
                    {replyingGroupingId !== groupingId ? (
                      <>
                        <Button
                          variant="outlined"
                          color="primary"
                          data-testid="reply_btn"
                          style={{ width: '50px' }}
                          onClick={() => openReplyInput(groupingId)}
                          size="small"
                          fullWidth
                        >
                          {t('common:misc.reply')}
                        </Button>
                        {authState.user.userType === 'admin' && (
                          <Button
                            variant="outlined"
                            color="primary"
                            data-testid="resolve_btn"
                            style={{ marginLeft: '25px' }}
                            onClick={() => onResolveComments(groupingId)}
                            size="small"
                          >
                            {t('common:misc.resolve_comments')}
                          </Button>
                        )}
                      </>
                    ) : (
                      <CommentTextField
                        value={replyValue}
                        setValue={setReplyValue}
                        handleSubmit={event => onReplySubmit(event, groupingId)}
                        actionTitle={t('common:misc.comment')}
                        placeholder={t('common:misc.add_reply')}
                        loading={loading}
                        mentionsData={mentionsData}
                        setMentionedDocuments={setMentionedDocuments}
                      />
                    )}
                  </div>
                )
              )}
              {forAccordionSection && <hr />}
            </div>
          ))}
        </List>
      </>
      {open && (
        <TaskDelete
          open={open}
          handleClose={() => setOpen(false)}
          id={id}
          name={name}
          imageUrl={imageUrl}
          refetch={refetch}
          body={body}
          commentsRefetch={commentsRefetch}
        />
      )}
    </>
  );
}

CommentCard.defaultProps = {
  comments: [],
  commentsRefetch: () => {},
  forAccordionSection: null,
  mentionsData: [],
  taggedDocOnClick: null,
};
CommentCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  comments: PropTypes.array,
  refetch: PropTypes.func.isRequired,
  commentsRefetch: PropTypes.func,
  taggedDocOnClick: PropTypes.func,
  forAccordionSection: PropTypes.bool,
  mentionsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display: PropTypes.string,
    })
  ),
};

const useStyles = makeStyles(() => ({
  kabab: {
    '@media (min-device-width: 375px) and (max-device-height: 900px)': {
      top: '40%',
    },
    marginTop: '-20px',
  },
}));
