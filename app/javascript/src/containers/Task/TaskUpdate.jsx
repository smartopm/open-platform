/* eslint-disable */
import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import { TaskQuery } from '../../graphql/queries'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider'
import Loading from '../../components/Loading'
import Nav from '../../components/Nav'
import ErrorPage from '../../components/Error'
import TaskUpdateForm from '../../components/Notes/TaskUpdateForm'
import { UsersLiteQuery } from '../../graphql/queries'
import { AssignUser } from '../../graphql/mutations'

export default function TaskUpdate({ match }) {
  const authState = useContext(AuthStateContext)
  const { data, error, loading, refetch } = useQuery(TaskQuery, {
    variables: { taskId: match.params.taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  const [assignees, setAssignees] = useState([])

  const [assignUserToNote] = useMutation(AssignUser)

  const  { data: liteData } = useQuery(UsersLiteQuery, {
    variables: { query: 'user_type: admin' },
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
  if (error) return <ErrorPage />

  return (
    <>
      <Nav navName="Task Update" menuButton="back" backTo="/todo" />
      <div className="container">
        <TaskUpdateForm data={data?.task} refetch={refetch} users={liteData?.usersLite} assignUser={assignUnassignUser} />
      </div>
    </>
  )
}
