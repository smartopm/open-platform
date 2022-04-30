import React from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { objectAccessor, sanitizeText, removeNewLines } from '../../../../utils/helpers';
import { dateToString } from '../../../../components/DateContainer';

export default function ProcessCommentItem({ commentdata, commentType }) {
  const statusColors = {
    Sent: 'info',
    Received: 'warning',
    Resolved: 'success'
  };
  const { t } = useTranslation(['process', 'task']);
  return (
    <>
      <Grid
        container
        spacing={1}
        style={{ marginBottom: '30px', borderBottom: '1px solid #F5F4F5', paddingBottom: '15px' }}
      >
        <Grid item md={commentType === 'Sent' ? 1 : 2} xs={commentType === 'Sent' ? 3 : 5}>
          <Chip
            label={commentType}
            color={objectAccessor(statusColors, commentType)}
            size="small"
            style={{ fontSize: '14px' }}
            data-testid="sent-chip"
          />
        </Grid>
        <Grid
          item
          md={commentType === 'Sent' ? 11 : 10}
          xs={commentType === 'Sent' ? 9 : 7}
          style={commentType === 'Sent' ? {} : { marginLeft: '-30px' }}
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
        <Grid item md={12}>
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
        <Grid item md={12}>
          <Typography variant="caption" color="textSecondary">
            {commentdata.body}
          </Typography>
        </Grid>
        <Grid item md={12}>
          <Link
            to={`/processes/drc/projects/${commentdata.note.id}?tab=processes&detailTab=comments&replying_discussion=${commentdata.groupingId}`}
          >
            <Typography variant="caption">
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: sanitizeText(removeNewLines(commentdata.note.body))
                }}
              />
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </>
  );
}

ProcessCommentItem.propTypes = {
  commentdata: PropTypes.shape({
    createdAt: PropTypes.string,
    groupingId: PropTypes.string,
    body: PropTypes.string,
    replyFrom: PropTypes.shape({
      name: PropTypes.string
    }),
    user: PropTypes.shape({
      imageUrl: PropTypes.string,
      avatarUrl: PropTypes.string,
      name: PropTypes.string
    }),
    note: PropTypes.shape({
      id: PropTypes.string,
      body: PropTypes.string
    })
  }).isRequired,
  commentType: PropTypes.string.isRequired
};
