import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useQuery } from 'react-apollo';
import { formatError } from '../../../../utils/helpers';
import CenteredContent from '../../../../shared/CenteredContent';
import Paginate from '../../../../components/Paginate';
import { Spinner } from '../../../../shared/Loading';
import TaskListsQuery from '../graphql/task_lists_queries';

export default function TaskLists() {
  const { t } = useTranslation('task');
  const classes = useStyles();
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const { data, loading, error }
    = useQuery(TaskListsQuery, {
    variables: {
      offset,
      limit
    },
    fetchPolicy: 'cache-and-network'
  });

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return;
      }
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading) return <Spinner />;

  return(
    <div className='container'>
      <Grid container spacing={1}>
        <Grid item md={12} xs={11} className={classes.header}>
          <Grid container spacing={1}>
            <Grid item md={9} xs={10}>
              <Typography variant="h4" style={{marginLeft: '5px', marginBottom: '24px'}}>{t('task_lists.task_lists')}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <CenteredContent>
        <Paginate
          count={data?.taskLists?.length}
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
        />
      </CenteredContent>
    </div>
  )
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  },
});
