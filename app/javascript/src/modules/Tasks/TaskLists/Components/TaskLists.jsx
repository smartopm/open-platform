import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
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

  const breadCrumbObj = {
    linkText: t('task_lists.task_lists'),
    linkHref: '/tasks/task_lists',
    pageName: t('task_lists.task_lists')
  };

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading) return <Spinner />;

  return (
    <PageWrapper pageTitle={t('task_lists.task_lists')} breadCrumbObj={breadCrumbObj}>
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
