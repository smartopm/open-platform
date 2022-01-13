import React from 'react'
import { useQuery } from 'react-apollo';
import { Grid,Typography } from '@mui/material';
import { ProcessesQuery } from '../graphql/process_queries';
import ClientPilotViewItem from './ClientPilotViewItem';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError } from '../../../../utils/helpers';
import Divider from '@mui/material/Divider';

export default function ClientPilotViewList(){
    const limit = 50;
    const offset = 0;
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
      <div className='container' justifyContent="center">
        <Grid container data-testid="project-information">
          <Typography variant="h6" data-testid="processes-header">
            Processes
          </Typography>
          <br />
          <br />
          <Divider light /> 
          {data?.processes?.map(process => (
                                    
            <ClientPilotViewItem key={process.id} process={process} />
                ))}
        </Grid>
      </div>
    )
  }
