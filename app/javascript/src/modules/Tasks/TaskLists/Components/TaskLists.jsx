import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Grid, Typography } from '@mui/material';
import { useHistory, Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { useQuery } from 'react-apollo';
import { formatError } from '../../../../utils/helpers';
import CenteredContent from '../../../../shared/CenteredContent';
import Paginate from '../../../../components/Paginate';
import { Spinner } from '../../../../shared/Loading';
import { TaskListsQuery } from '../graphql/task_lists_queries';
import TodoItem from '../../Components/TodoItem';
import AccessCheck from '../../../Permissions/Components/AccessCheck';
import FloatingButton from '../../../../shared/buttons/FloatingButton';
import PageWrapper from '../../../../shared/PageWrapper';

export default function TaskLists() {
  const { t } = useTranslation('task');
  const classes = useStyles();
  const [offset, setOffset] = useState(0);
  const limit = 50;
  const history = useHistory();
  const { data, loading, refetch, error } = useQuery(TaskListsQuery, {
    variables: {
      offset,
      limit
    },
    fetchPolicy: 'cache-and-network'
  });

  function redirectToTaskListCreatePage() {
    history.push('/tasks/task_lists/new');
  }

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

  return (
    <PageWrapper>
      <Grid container spacing={1}>
        <Grid item md={12} xs={12} style={{ paddingleft: '10px' }}>
          <div role="presentation">
            <Breadcrumbs
              aria-label="breadcrumb"
            >
              <Link to="/tasks/task_lists">
                <Typography color="primary" style={{ marginLeft: '5px' }}>
                  {t('task_lists.task_lists')}
                </Typography>
              </Link>
              <Typography color="text.primary">{t('task_lists.task_lists')}</Typography>
            </Breadcrumbs>
          </div>
        </Grid>
        <Grid item md={12} xs={11} className={classes.header}>
          <Grid container spacing={1}>
            <Grid item md={9} xs={10}>
              <Typography
                variant="h4"
                style={{ marginLeft: '5px', marginBottom: '10px', marginTop: '-10px' }}
              >
                {t('task_lists.task_lists')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {data?.taskLists?.length > 0 ? (
        <div>
          {data.taskLists.map(taskList => (
            <div key={taskList.id}>
              <TodoItem key={taskList?.id} task={taskList} taskId={taskList.id} refetch={refetch} />
            </div>
          ))}
        </div>
      ) : (
        <CenteredContent>{t('task_lists.no_task_lists')}</CenteredContent>
      )}
      <CenteredContent>
        <Paginate
          count={data?.taskLists?.length}
          offSet={offset}
          limit={limit}
          active={offset > 1}
          handlePageChange={paginate}
        />
      </CenteredContent>
      <AccessCheck module="note" allowedPermissions={['can_view_create_task_button']} show404ForUnauthorized={false}>
        <FloatingButton
          variant="extended"
          handleClick={redirectToTaskListCreatePage}
          color="primary"
          data-testid="create_task_btn"
        />
      </AccessCheck>
    </PageWrapper>
  );
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  }
});
