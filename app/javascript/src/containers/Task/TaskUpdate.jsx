/* eslint-disable */
import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery, useLazyQuery } from 'react-apollo'
import { TaskQuery } from '../../graphql/queries'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import Loading from '../../components/Loading'
import Nav from '../../components/Nav'
import ErrorPage from '../../components/Error'
import TaskForm from '../../components/Notes/TaskForm'
import { UsersLiteQuery } from '../../graphql/queries'

export default function TaskUpdate({ match }) {
  const authState = useContext(AuthStateContext)
  const { data, error, loading, refetch } = useQuery(TaskQuery, {
    variables: { taskId: match.params.taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })

  const  { data: liteData } = useQuery(UsersLiteQuery, {
    variables: { query: 'user_type: admin' },
    errorPolicy: 'all'
  })

  if (authState.user.userType !== 'admin') {
    return <Redirect push to="/" />
  }
  if (loading) return <Loading />
  if (error) return <ErrorPage />

  return (
    <>
      <Nav navName="Task Update" menuButton="back" backTo="/todo" />
      <div className="container">
        <TaskForm data={data?.task} refetch={refetch} users={liteData?.usersLite} />
      </div>
    </>
  )
}
