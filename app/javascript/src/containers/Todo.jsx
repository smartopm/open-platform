import React, { Fragment, useState, useContext } from 'react'
import Nav from '../components/Nav'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import { useMutation } from 'react-apollo'
import { UpdateNote } from '../graphql/mutations'
import TodoList from '../components/TodoList'

export default function Todo({ history }) {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setLoading] = useState(false)
  const authState = useContext(AuthStateContext)

  const [noteUpdate] = useMutation(UpdateNote)
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [userId, setUserId] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function todoAction(id, isCompleted) {
    setLoading(true)
    noteUpdate({ variables: { id, completed: !isCompleted, } }).then(() => {
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

  const handleDateChange = (date) => {
    setSelectedDate(new Date(date).toISOString());
  };
  if (authState.user.userType !== 'admin') {
    // re-route to home
    history.push('/')
  }
  return (
    <Fragment>
      <Nav navName="Todo" menuButton="back" backTo="/" />
      
      <TodoList
       isDialogOpen={isDialogOpen}
       handleModal={handleModal}
       saveDate={saveDate}
       selectedDate={selectedDate}
       handleDateChange={handleDateChange}
       todoAction={todoAction}
      />
    </Fragment>
  );
}

