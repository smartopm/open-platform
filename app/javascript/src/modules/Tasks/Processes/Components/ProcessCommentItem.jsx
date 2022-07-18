import React from 'react';
import { useParams } from 'react-router';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  objectAccessor,
  sanitizeText,
  removeNewLines,
  replaceDocumentMentions,
  downloadCommentFile
} from '../../../../utils/helpers';
import { dateToString } from '../../../../components/DateContainer';

export default function ProcessCommentItem({ commentdata, commentType }) {
  const { id: processId } = useParams();
  const statusColors = {
    Sent: 'info',
    Received: 'warning',
    Resolved: 'success',
  };
  const matches = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation(['process', 'task']);
  const classes = useStyles();
  const statusLabel = {
    Sent: t('comments.sent'),
    Received: t('comments.received'),
    Resolved: t('comments.resolved'),
  };
  return (
    <>
      <Grid
        container
        spacing={1}
        style={{ marginBottom: '30px', borderBottom: '1px solid #F5F4F5', paddingBottom: '15px' }}
      >
        <Grid
          item
          md={commentType === 'Sent' ? 1 : 2}
          xs={commentType === 'Sent' ? 3 : 5}
          sm={commentType === 'Sent' ? 1 : 2}
        >
          <Chip
            label={objectAccessor(statusLabel, commentType)}
            color={objectAccessor(statusColors, commentType)}
            size="small"
            style={{ fontSize: '14px' }}
            data-testid="chip"
          />
        </Grid>
        <Grid
          item
          md={commentType === 'Sent' ? 11 : 10}
          xs={commentType === 'Sent' ? 9 : 7}
          sm={commentType === 'Sent' ? 11 : 10}
          style={commentType === 'Sent' ? {} : { marginLeft: '-25px' }}
          className={matches ? classes.card : undefined}
          data-testid="comment_date"
        >
          <Typography variant="caption">{dateToString(commentdata.createdAt)}</Typography>
          {commentType !== 'Resolved' && (
            <Typography variant="caption" style={{ marginLeft: '15px' }}>
              {commentType === 'Received'
                ? t('task:task.reply_submitted')
                : `${t('task:task.reply_sent_to')} ${commentdata.replyFrom.name}`}
            </Typography>
          )}
        </Grid>
        <Grid item md={12} xs={12}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
            <Avatar
              src={commentdata.user.imageUrl || commentdata.user.avatarUrl}
              alt="avatar-image"
              style={{ width: '25px', height: '25px' }}
            />
            <Typography variant="caption" style={{ marginLeft: '10px' }}>
              {commentdata.user.name}
            </Typography>
          </div>
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography variant="caption" color="textSecondary" data-testid="body">
            {replaceDocumentMentions(
              commentdata,
              downloadCommentFile
            )}
          </Typography>
        </Grid>
        <Grid item md={12} xs={12} data-testid="task_link">
          <Link
            to={`/processes/${processId}/projects/${commentdata.note.id}?tab=processes&detailTab=comments&replying_discussion=${commentdata.groupingId}`}
          >
            <Typography variant="caption">
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: sanitizeText(removeNewLines(commentdata.note.body)),
                }}
              />
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles(() => ({
  card: {
    marginLeft: '-15px',
  },
}));

ProcessCommentItem.propTypes = {
  commentdata: PropTypes.shape({
    id: PropTypes.string,
    createdAt: PropTypes.string,
    groupingId: PropTypes.string,
    body: PropTypes.string,
    replyFrom: PropTypes.shape({
      name: PropTypes.string,
    }),
    user: PropTypes.shape({
      imageUrl: PropTypes.string,
      avatarUrl: PropTypes.string,
      name: PropTypes.string,
    }),
    note: PropTypes.shape({
      id: PropTypes.string,
      body: PropTypes.string,
    }),
  }).isRequired,
  commentType: PropTypes.string.isRequired,
};
