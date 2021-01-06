/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import { TaskQuery, UsersLiteQuery, HistoryQuery } from '../../graphql/queries'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider'
import Loading from '../../components/Loading'
import Nav from '../../components/Nav'
import ErrorPage from '../../components/Error'
import TaskUpdateForm from '../../components/Notes/TaskUpdateForm'
import { AssignUser } from '../../graphql/mutations'

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
    variables: { query: 'user_type: admin' },
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

  if (authState.user.userType !== 'admin') {
    return <Redirect push to="/" />
  }
  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />

  return (
    <>
      <Nav navName="Task Update" menuButton="back" backTo="/tasks" />
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
