import React, { useContext } from 'react'
import {  useParams } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import { TaskQuery, UsersLiteQuery, HistoryQuery } from '../../../graphql/queries'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import Loading from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'
import TaskUpdateForm from '../Components/TaskUpdateForm'
import { AssignUser } from '../../../graphql/mutations'

export default function TaskUpdate() {
  const { taskId } = useParams()
  const authState = useContext(AuthStateContext)
  const { data, error, loading, refetch } = useQuery(TaskQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  const [assignUserToNote] = useMutation(AssignUser)

  const { data: liteData } = useQuery(UsersLiteQuery, {
    variables: { query: 'user_type:admin OR user_type:custodian OR user_type:security_guard OR user_type:contractor'},
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
    <>
      <div className="container">
        <TaskUpdateForm
          data={data?.task}
          refetch={refetch}
          users={liteData?.usersLite}
          assignUser={assignUnassignUser}
          currentUser={authState.user}
          historyData={taskHistoryData?.taskHistories}
          historyRefetch={historyRefetch}
          authState={authState}
          taskId={taskId}
        />
      </div>
    </>
  )
}
