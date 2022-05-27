import React, { useContext, useState } from 'react';
import { Divider, Typography, Button, Grid } from '@mui/material';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Comment from './Comment';
import { DiscussionPostsQuery } from '../../../graphql/queries';
import DateContainer from '../../../components/DateContainer';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import FollowButton from './FollowButton';

import Disclaimer from '../../../components/Disclaimer';
import userProps from '../../../shared/types/user';
import { formatError } from '../../../utils/helpers';

export default function Discussion({ discussionData }) {
  const limit = 20;
  const { id } = discussionData;
  const authState = useContext(AuthStateContext);
  const [isLoading, setLoading] = useState(false);
  const { loading, error, data, refetch, fetchMore } = useQuery(DiscussionPostsQuery, {
    variables: { discussionId: id, limit }
  });
  const { t } = useTranslation('discussion');

  const discussionBoardDisclaimer = `${t('discussion_board_disclaimer.first_line')}
    ${t('discussion_board_disclaimer.second_line')}
    ${t('discussion_board_disclaimer.third_line')}`;

  function fetchMoreComments() {
    setLoading(true);
    fetchMore({
      variables: { id, offset: data.discussionPosts.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        setLoading(false);
        return {
          ...prev,
          discussionPosts: [...prev.discussionPosts, ...fetchMoreResult.discussionPosts]
        };
      }
    });
  }

  if (loading) return <Spinner />;
  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  return (
    <div className="container">
      <>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography data-testid="disc_title" variant="h6">
              {discussionData.tag === 'system'
                ? t(`discussion_title.${discussionData.title}`)
                : discussionData.title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" data-testid="disc_desc">
              {discussionData.description || t('headers.no_discussions')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" data-testid="disc_author">
              <strong>{discussionData.user.name}</strong>
            </Typography>
            <Typography variant="caption">
              <DateContainer date={discussionData.createdAt} />
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <FollowButton discussionId={id} authState={authState} />
          </Grid>
          <br />
          <Grid item xs={6}>
            <Disclaimer body={discussionBoardDisclaimer} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">{t('headers.posts')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Comment comments={data?.discussionPosts} discussionId={id} refetch={refetch} />
            {data?.discussionPosts.length >= limit && (
              <CenteredContent>
                <Button variant="outlined" onClick={fetchMoreComments}>
                  {isLoading ? <Spinner /> : t('form_actions.more_posts')}
                </Button>
              </CenteredContent>
            )}
          </Grid>
        </Grid>
      </>
    </div>
  );
}

Discussion.propTypes = {
  discussionData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: userProps,
    description: PropTypes.string,
    title: PropTypes.string.isRequired,
    tag: PropTypes.string
  }).isRequired
};
