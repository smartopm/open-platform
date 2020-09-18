/* eslint-disable */
import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import { TaskQuery } from '../../graphql/queries'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import Loading from '../../components/Loading'
import Nav from '../../components/Nav'
import ErrorPage from '../../components/Error'
import TaskDetailForm from '../../components/Notes/TaskDetailForm'

export default function TaskUpdate({ match }) {
  const authState = useContext(AuthStateContext)
  const { data, error, loading, refetch } = useQuery(TaskQuery, {
    variables: { taskId: match.params.taskId },
    fetchPolicy: 'cache-and-network',
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
      <TaskDetailForm authState={authState} data={data?.task} refetch={refetch} />
    </>
  )
}
