import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Grid, IconButton, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { useQuery } from 'react-apollo';
import UserAvatar from '../../../Users/Components/UserAvatar';
import { ProjectCommentsQuery } from '../graphql/process_queries';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';


export default function ProjectDetailsAccordion({ taskId, handleCloseAccordion }) {
  const classes = useStyles();
  const { t } = useTranslation(['task', 'common']);

  const { data, loading, error, refetch } = useQuery(ProjectCommentsQuery, {
    variables: {
      taskId
    },
    fetchPolicy: 'cache-and-network'
  });

  console.log({ data: data?.projectComments })

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;

  return (
    <Paper>
      <Grid container spacing={1} style={{ padding: '12px'}} data-testid="project-overview-accordion">
          <Grid item md={11} xs={11}>
              <Typography color="primary">
                  Project Overview
              </Typography>
          </Grid>
          <Grid item md={1} xs={1} style={{ textAlign: 'right'}}>
            <IconButton color="primary" size="small" onClick={handleCloseAccordion}>
                <Typography variant="caption">X</Typography>
              </IconButton>
          </Grid>
        <Grid item md={12}>
         {data?.projectComments?.length
          ? data?.projectComments?.map(comment => (
            <Grid container>
                <Grid item md={5} xs={5}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <Badge
                          // TODO: Change the color depending on the type of comment
                          // Reply Submitted, Requested, or Resolved
                          // Change the Badge content too
                          color="warning"
                          badgeContent={(
                            <Typography variant="caption" style={{ color: 'white' }}>
                              Received
                            </Typography>
                        )}
                      />
                  </Grid>
                  <Grid item md={3} xs={3}>
                    <Typography variant="caption">2021-09-28</Typography>
                  </Grid>
                  <Grid item md={3} xs={3}>
                    <Typography variant="caption">Reply Submitted</Typography>
                  </Grid>
                  <Grid item md={3} xs={3}>
                    {/* TODO: We need a user -> maybe the user who submitted reply */}
                      <UserAvatar
                        // searchedUser={{}}
                        // imageUrl={user.avatarUrl || user.imageUrl}
                        // customStyle={classes.userAvatar}
                      />
                      <Typography variant="caption">I am a developer</Typography>
                  </Grid>
                </Grid>
                </Grid>
                <Grid item md={7} xs={1} style={{ textAlign: 'right' }}>
                    <Link to="/">
                      <Typography variant="caption">Name of the step as a link</Typography>
                    </Link>
                </Grid>
                <Grid item md={12} xs={12}>
                <Typography variant="caption">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                </Typography>
                </Grid>
            </Grid>)
          )
          : <Spinner />}
        </Grid>
      </Grid>
    </Paper>
  );
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  }
});
