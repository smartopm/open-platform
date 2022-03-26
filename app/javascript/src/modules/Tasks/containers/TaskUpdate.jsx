import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo';
import { Container } from '@mui/material';
import { useHistory } from 'react-router';
import { UsersLiteQuery, HistoryQuery } from '../../../graphql/queries';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';
import TaskDetail from '../Components/TaskDetail';
import { AssignUser } from '../../../graphql/mutations';
import { TaskQuery } from '../graphql/task_queries';

export default function TaskUpdate({
  taskId,
  handleSplitScreenOpen,
  handleSplitScreenClose,
  handleTaskCompletion,
  handleTaskNotFoundError,
  commentsRefetch,
  forProcess,
  fromLeadPage
}) {
  const authState = useContext(AuthStateContext);
  const history = useHistory();
  const { data, error, loading, refetch } = useQuery(TaskQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const [assignUserToNote] = useMutation(AssignUser);

  // TODO (Nurudeen): Remove. This is a potential problem, we are literally fetching
  // all community users
  const { data: liteData } = useQuery(UsersLiteQuery, {
    variables: {
      query:
        'user_type:admin OR user_type:custodian OR user_type:security_guard OR user_type:contractor OR user_type:site_worker'
    },
    errorPolicy: 'all'
  });

  const { data: taskHistoryData, refetch: historyRefetch } = useQuery(HistoryQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  async function assignUnassignUser(noteId, userId) {
    await assignUserToNote({ variables: { noteId, userId } });
    refetch();
  }

  function showTaskNotFoundError() {
    const { location } = history;

    // Skip if on the /processes page
    if (location.pathname.includes('/tasks')) {
      handleTaskNotFoundError(error);
      return null;
    }

    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  if (loading) return <Spinner />;
  if (error) return showTaskNotFoundError();

  return (
    <Container maxWidth="xl">
      <TaskDetail
        data={data?.task}
        refetch={refetch}
        users={liteData?.usersLite}
        assignUser={assignUnassignUser}
        currentUser={authState.user}
        historyData={taskHistoryData?.taskHistories}
        historyRefetch={historyRefetch}
        taskId={taskId}
        handleSplitScreenOpen={handleSplitScreenOpen}
        handleSplitScreenClose={handleSplitScreenClose}
        handleTaskCompletion={handleTaskCompletion}
        commentsRefetch={commentsRefetch}
        forProcess={forProcess}
        fromLeadPage={fromLeadPage}
      />
    </Container>
  );
}

TaskUpdate.defaultProps = {
  handleSplitScreenOpen: () => {},
  handleSplitScreenClose: () => {},
  handleTaskNotFoundError: () => {},
  handleTaskCompletion: () => {},
  commentsRefetch: () => {},
  forProcess: false,
  fromLeadPage: false
};

TaskUpdate.propTypes = {
  taskId: PropTypes.string.isRequired,
  handleSplitScreenOpen: PropTypes.func,
  handleSplitScreenClose: PropTypes.func,
  handleTaskCompletion: PropTypes.func,
  handleTaskNotFoundError: PropTypes.func,
  commentsRefetch: PropTypes.func,
  forProcess: PropTypes.bool,
  fromLeadPage: PropTypes.bool
};
