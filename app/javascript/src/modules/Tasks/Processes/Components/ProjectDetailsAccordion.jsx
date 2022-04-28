import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography, Chip, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import { ProjectRepliesRequestedComments } from '../graphql/process_queries';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { sortRepliesRequestedComments } from '../utils';
import { dateToString } from '../../../../components/DateContainer';
import { removeNewLines, sanitizeText, formatError } from '../../../../utils/helpers';

export default function ProjectDetailsAccordion({ taskId }) {
  const { t } = useTranslation(['task', 'common']);

  const { data, error } = useQuery(ProjectRepliesRequestedComments, {
    variables: {
      taskId
    },
    fetchPolicy: 'cache-and-network'
  });

  const replyRequestedComments = data?.repliesRequestedComments;
  const sentComments = replyRequestedComments?.sent.map(obj => {
    return { ...obj, status: 'Sent' };
  });
  const receivedComments = replyRequestedComments?.received.map(obj => {
    return { ...obj, status: 'Received' };
  });
  const resolvedComments = replyRequestedComments?.resolved.map(obj => {
    return { ...obj, status: 'Resolved' };
  });

  const sortedRepliesRequestedComments = sortRepliesRequestedComments(
    sentComments?.concat(receivedComments, resolvedComments)
  );

  const statusColors = {
    Sent: 'info',
    Received: 'warning',
    Resolved: 'success'
  };

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;

  return (
    <Paper style={{ boxShadow: '0px 0px 0px 1px #E0E0E0' }}>
      <Grid
        container
        spacing={1}
        style={{ padding: '12px', marginTop: '10px' }}
        data-testid="project-overview-accordion"
      >
        <Grid item xs={12} style={{ marginBottom: '20px' }}>
          <Typography variant="h6">{t('task.project_overview')}</Typography>
        </Grid>
        <Grid item md={12}>
          {sortedRepliesRequestedComments?.length ? (
            sortedRepliesRequestedComments?.map(comment => (
              <>
                <Grid container>
                  <Grid item md={8} xs={12}>
                    <Grid item xs={12} style={{ display: 'flex' }}>
                      <Chip
                        label={comment.status}
                        color={statusColors[comment.status]}
                        size="small"
                        style={{ fontSize: '14px' }}
                        data-testid="sent-chip"
                      />
                      <Typography variant="caption" style={{ margin: '0 15px 0 15px' }}>
                        {dateToString(comment.createdAt)}
                      </Typography>
                      {comment.status !== 'Resolved' && (
                        <Typography variant="caption" style={{ marginRight: '15px' }}>
                          {comment.status === 'Received'
                            ? t('task.reply_submitted')
                            : `${t('task.reply_sent_to')} ${comment.replyFrom.name}`}
                        </Typography>
                      )}
                      <Avatar
                        src={comment.user.imageUrl}
                        alt="avatar-image"
                        style={{ margin: '-7px 10px 0 0' }}
                      />
                      <Typography variant="caption">{comment.user.name}</Typography>
                    </Grid>
                    <Typography variant="caption">{comment.body}</Typography>
                  </Grid>
                  <Grid item md={4} xs={12} style={{ textAlign: 'right' }}>
                    <Link
                      to={`/processes/drc/projects/${comment.note.id}?tab=processes&detailTab=comments&replying_discussion=${comment.groupingId}`}
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
              </>
            ))
          ) : (
            <Spinner />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

ProjectDetailsAccordion.propTypes = {
  taskId: PropTypes.string.isRequired
};