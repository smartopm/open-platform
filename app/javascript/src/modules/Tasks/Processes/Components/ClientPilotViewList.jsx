import React from 'react'
import { useQuery } from 'react-apollo';
import { Grid,Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { ClientAssignedProjectsQuery } from '../graphql/process_queries';
import ClientPilotViewItem from './ClientPilotViewItem';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError } from '../../../../utils/helpers';

export default function ClientPilotViewList(){
    const limit = 50;
    const offset = 0;
    const classes = useStyles();
    const { t } = useTranslation('task')
    const { loading, error, data, refetch }
        = useQuery(ClientAssignedProjectsQuery, {
        variables: {
            offset,
            limit,
        },
      fetchPolicy: 'cache-and-network'
    });
    if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
    if (loading) return <Spinner />;

    return (
      <div className='container' data-testid="processes-client-dashboard">
        <Grid container>
          <Grid item md={11} xs={11} className={classes.header}>
            <Grid container spacing={1}>
              <Grid item md={9} xs={10}>
                <Typography variant="h4" style={{marginLeft: '5px', marginBottom: '24px'}} data-testid="processes-header">
                  {t('processes.processes')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container data-testid="project-information">
          {data?.clientAssignedProjects?.length ?
            (
              <div>
                {data?.clientAssignedProjects?.map(project => (
                  <ClientPilotViewItem key={project.id} project={project} refetch={refetch} />
                    ))}
              </div>
            )
        : (<CenteredContent>{t('processes.no_assigned_projects')}</CenteredContent>)
      }
        </Grid>
      </div>
    )
  }

  const useStyles = makeStyles({
    header: {
      marginBottom: '10px'
    },
  });
