import React, { useContext, useState } from 'react';
import { Divider, Typography, Button, Grid } from '@mui/material';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Comment from './Comment';
import { DiscussionCommentsQuery } from '../../graphql/queries';
import DateContainer from '../DateContainer';
import { Spinner } from '../../shared/Loading';
import CenteredContent from '../../shared/CenteredContent';
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider';
import FollowButton from './FollowButton';

import Disclaimer from '../Disclaimer';
import userProps from '../../shared/types/user';
import { formatError } from '../../utils/helpers';

export default function Discussion({ discussionData }) {
  const limit = 20;
  const { id } = discussionData;
  const authState = useContext(AuthStateContext);
  const [isLoading, setLoading] = useState(false);
  const { loading, error, data, refetch, fetchMore } = useQuery(DiscussionCommentsQuery, {
    variables: { id, limit }
  });
  const { t } = useTranslation('discussion');

  const discussionBoardDisclaimer = `${t('discussion_board_disclaimer.first_line')}
    ${t('discussion_board_disclaimer.second_line')}
    ${t('discussion_board_disclaimer.third_line')}`;

  function fetchMoreComments() {
    setLoading(true);
    fetchMore({
      variables: { id, offset: data.discussComments.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        setLoading(false);
        return {
          ...prev,
          discussComments: [...prev.discussComments, ...fetchMoreResult.discussComments]
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
              {discussionData.title}
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
            <Typography variant="subtitle1">{t('headers.comments')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Comment comments={data?.discussComments} discussionId={id} refetch={refetch} />
            {data?.discussComments.length >= limit && (
              <CenteredContent>
                <Button variant="outlined" onClick={fetchMoreComments}>
                  {isLoading ? <Spinner /> : t('form_actions.more_comments')}
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
    title: PropTypes.string.isRequired
  }).isRequired
};
