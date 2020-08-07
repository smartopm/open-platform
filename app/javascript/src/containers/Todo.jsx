import React, { Fragment, useState, useContext, useEffect } from 'react'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
import { UpdateNote } from '../graphql/mutations'
import TodoList from '../components/Notes/TodoList'
import Nav from '../components/Nav'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import { useLocation } from 'react-router'
import { MyTaskQuery } from '../graphql/queries'

export default function Todo({ history }) {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setLoading] = useState(false)
  const authState = useContext(AuthStateContext)

  const [noteUpdate] = useMutation(UpdateNote)
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [userId, setUserId] = React.useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const location = useLocation()
  const [loadTask, {loading, error, data}] = useLazyQuery(MyTaskQuery)

  function todoAction(id, isCompleted) {
    setLoading(true)
    noteUpdate({ variables: { id, completed: !isCompleted } }).then(() => {
      setLoading(false)
    })
  }

  function handleModal(Uid) {
    setUserId(Uid)
    setIsDialogOpen(!isDialogOpen)
  }

  function saveDate() {
    let id = userId
    noteUpdate({ variables: { id, dueDate: selectedDate } }).then(() => {
      setIsDialogOpen(!isDialogOpen)
    })
  }

  const handleDateChange = date => {
    setSelectedDate(new Date(date).toISOString())
  }
  if (authState.user.userType !== 'admin') {
    // re-route to home
    history.push('/')
  }

  useEffect(() => {
    if (location.pathname.includes('my_tasks')) {
      loadTask()
    }
  }, [location, loadTask])

  // remove the forward slash and do pattern match for routes and nav name
  const path = {
    todo: 'Tasks',
    my_tasks: 'My Tasks'
  }
  return (
    <Fragment>
      <Nav navName={path[location.pathname.replace(/\//, '')]} menuButton="back" backTo="/" />
        <TodoList
          isDialogOpen={isDialogOpen}
          handleModal={handleModal}
          saveDate={saveDate}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          todoAction={todoAction}
          location={location.pathname.replace(/\//, '')}
          taskData={data}
        />
    </Fragment>
  )
}
