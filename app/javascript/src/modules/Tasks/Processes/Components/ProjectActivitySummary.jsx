import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CenteredContent from '../../../../shared/CenteredContent';
import CommentCard from '../../Components/CommentCard';
import { formatError, downloadCommentFile } from '../../../../utils/helpers';
import { Spinner } from '../../../../shared/Loading';

export default function ProjectActivitySummary({comments, commentsLoading, commentsError, commentsRefetch, commentsFetchMore}) {
  const classes = useStyles();
  const { t } = useTranslation(['task']);
  const { id: taskId } = useParams();
  const limit = 3;
  const [loading, setLoading] = useState(false);
  const [moreComments, setMoreComments] = useState(true);

  function fetchMoreComments() {
    setLoading(true);
    commentsFetchMore({
      variables: { taskId, limit, offset: comments.projectComments.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.projectComments.length < limit) {
          setMoreComments(false);
        }
        setLoading(false);
        return { ...prev, projectComments: [
            ...prev.projectComments,
            ...fetchMoreResult.projectComments
          ]}
      }
    });
  }

  if (commentsError) return <CenteredContent>{formatError(commentsError.message)}</CenteredContent>;
  if (commentsLoading) return <Spinner />;
  return (
    <>
      <Typography
        variant="subtitle1"
        className={classes.activitySummaryHeader}
        data-testid="activity-summary"
      >
        {t('processes.activity_summary')}
      </Typography>
      {comments?.projectComments.length > 0 ? (
        <CommentCard
          comments={comments.projectComments}
          refetch={commentsRefetch}
          taggedDocOnClick={downloadCommentFile}
        />
      )
        : (
          <Typography variant="body2">
            {t('processes.no_activity_summary')}
          </Typography>
      )}
      <br />
      {comments?.projectComments.length >= limit && moreComments && (
        <Button onClick={fetchMoreComments} className={classes.seeMoreBtn}>
          {loading ? <Spinner /> : (
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
    marginBottom: '10px !important',
    fontSize: '1rem'

  },
  seeMoreBtn: {
    color: '#212529'
  },
  seeMoreText: {
    fontWeight: '400'
  }
}));

ProjectActivitySummary.defaultProps = {
  commentsError: null,
  comments: null
};

ProjectActivitySummary.propTypes = {
  comments: PropTypes.shape({
    projectComments: PropTypes.arrayOf(PropTypes.shape())
  }),
  commentsLoading: PropTypes.bool.isRequired,
  commentsError: PropTypes.shape({
    message: PropTypes.string
  }),
  commentsRefetch: PropTypes.func.isRequired,
  commentsFetchMore: PropTypes.func.isRequired
}
