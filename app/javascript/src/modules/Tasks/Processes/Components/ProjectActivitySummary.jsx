import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-apollo';
import CenteredContent from '../../../../shared/CenteredContent';
import { ProjectCommentsQuery } from '../graphql/process_queries';
import CommentCard from '../../Components/CommentCard';
import { formatError } from '../../../../utils/helpers';
import { Spinner } from '../../../../shared/Loading';

export default function ProjectActivitySummary() {
  const classes = useStyles();
  const { t } = useTranslation(['task']);
  const { id: taskId } = useParams();
  const limit = 3;
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [moreComments, setMoreComments] = useState(true);
  const { data: comments, loading, error, refetch, fetchMore } = useQuery(ProjectCommentsQuery, {
    variables: { taskId, limit },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  function fetchMoreComments() {
    setCommentsLoading(true);
    fetchMore({
      variables: { taskId, limit, offset: comments.projectComments.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.projectComments.length < limit) {
          setMoreComments(false);
        }
        setCommentsLoading(false);
        return { ...prev, projectComments: [
            ...prev.projectComments,
            ...fetchMoreResult.projectComments
          ]}
      }
    });
  }

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading) return <Spinner />;
  return (
    <>
      <Typography
        variant="h6"
        className={classes.activitySummaryHeader}
        data-testid="activity-summary"
      >
        {t('processes.activity_summary')}
      </Typography>
      {comments?.projectComments.length > 0 ? (
        <CommentCard
          comments={comments.projectComments}
          refetch={refetch}
        />
      )
        :
        t('processes.no_activity_summary') }
      {comments?.projectComments.length >= limit && moreComments && (
        <Button onClick={fetchMoreComments} className={classes.seeMoreBtn}>
          {commentsLoading ? <Spinner /> : (
            <>
              <Typography className={classes.seeMoreText} variant="button">{t('task:sub_task.see_more')}</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </>
          )}
        </Button>
      )}
    </>
  );
}

const useStyles = makeStyles(() => ({
  activitySummaryHeader: {
    marginBottom: '2px',
    fontWeight: 200,
    fontSize: '1rem'
  },
  seeMoreBtn: {
    color: '#212529'
  },
  seeMoreText: {
    fontWeight: '400'
  }
}));
