import React from 'react'
import { useQuery } from 'react-apollo';
import { Grid,Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { ProcessesQuery } from '../graphql/process_queries';
import ClientPilotViewItem from './ClientPilotViewItem';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError } from '../../../../utils/helpers';


export default function ClientPilotViewList(){
    const limit = 50;
    const offset = 0;
    const classes = useStyles();
    const { t } = useTranslation(['task', 'common'])
    const { loading, error, data }
        = useQuery(ProcessesQuery, {
        variables: {
            offset,
            limit,
        },
      fetchPolicy: 'cache-and-network'
    });
    if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
    if (loading) return <Spinner />;
    return (
      <div className='container'>
        <Grid container data-testid="project-information">


          {data?.processes?.length ?
            (
              <div>
                <Grid container>
                  <Grid item md={11} xs={11} className={classes.header}>
                    <Grid container spacing={1}>
                      <Grid item md={9} xs={10}>
                        <Typography variant="h4" style={{marginLeft: '5px', marginBottom: '24px'}} data-testid="processes-header">
                          {t('task.processes.processes')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {data?.processes?.map(process => (
                                        
                  <ClientPilotViewItem key={process.id} process={process} />
                    ))}
              </div>
            )
        : (<CenteredContent>{t('task.process.no_ssigned_projects')}</CenteredContent>)
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