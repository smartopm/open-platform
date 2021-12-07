import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo'
import { Container } from '@material-ui/core'
import { UsersLiteQuery, HistoryQuery } from '../../../graphql/queries'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import Loading from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'
import TaskUpdateForm from '../Components/TaskUpdateForm'
import { AssignUser } from '../../../graphql/mutations'
import { TaskQuery } from '../graphql/task_queries'

// This will be deprecated in favour of split screen view
export default function TaskUpdate({ taskId, handleDrawerOpen }) {
  const authState = useContext(AuthStateContext)
  const { data, error, loading, refetch } = useQuery(TaskQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  const [assignUserToNote] = useMutation(AssignUser)

  const { data: liteData } = useQuery(UsersLiteQuery, {
    variables: { query: 'user_type:admin OR user_type:custodian OR user_type:security_guard OR user_type:contractor OR user_type:site_worker'},
    errorPolicy: 'all'
  })

  const { data: taskHistoryData, refetch: historyRefetch } = useQuery(HistoryQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })

  async function assignUnassignUser(noteId, userId) {
    await assignUserToNote({ variables: { noteId, userId } })
    refetch()
  }
  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />

  return (
    <Container maxWidth="xl">
      <TaskUpdateForm
        data={data?.task}
        refetch={refetch}
        users={liteData?.usersLite}
        assignUser={assignUnassignUser}
        currentUser={authState.user}
        historyData={taskHistoryData?.taskHistories}
        historyRefetch={historyRefetch}
        taskId={taskId}
        handleDrawerOpen={handleDrawerOpen}
      />
    </Container>
  )
}

TaskUpdate.defaultProps = {
  handleDrawerOpen: () => {}
}

TaskUpdate.propTypes = {
  taskId: PropTypes.string.isRequired,
  handleDrawerOpen: PropTypes.func
}
