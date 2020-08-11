import React, { Fragment, useState, useContext } from 'react'
import { useMutation } from 'react-apollo'
import { UpdateNote } from '../graphql/mutations'
import TodoList from '../components/Notes/TodoList'
import Nav from '../components/Nav'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import { useLocation } from 'react-router'

export default function Todo({ history }) {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setLoading] = useState(false)
  const authState = useContext(AuthStateContext)

  const [noteUpdate] = useMutation(UpdateNote)
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [userId, setUserId] = React.useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const location = useLocation()

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
          currentUser={authState.user.name}
        />
    </Fragment>
  )
}
