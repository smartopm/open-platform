import React, { useState, useContext } from 'react'
import { useMutation } from 'react-apollo'
import { useLocation } from 'react-router'
import { UpdateNote } from '../../../graphql/mutations'
import TodoList from '../Components/TodoList'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'

export default function Todo() {
  const authState = useContext(AuthStateContext)

  const [noteUpdate] = useMutation(UpdateNote)
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [userId, setUserId] = React.useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const location = useLocation()

  function handleModal(Uid) {
    setUserId(Uid)
    setIsDialogOpen(!isDialogOpen)
  }

  function saveDate() {
    const id = userId
    noteUpdate({ variables: { id, dueDate: selectedDate } }).then(() => {
      setIsDialogOpen(!isDialogOpen)
    })
  }

  const handleDateChange = date => {
    setSelectedDate(new Date(date).toISOString())
  }

  return (
    <>
      <TodoList
        isDialogOpen={isDialogOpen}
        handleModal={handleModal}
        saveDate={saveDate}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        location={location.pathname.replace(/\//, '')}
        currentUser={authState.user}
      />
    </>
);
}
