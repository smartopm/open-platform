import React, { Fragment, useState, useContext } from 'react'
import Nav from '../components/Nav'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import { useMutation } from 'react-apollo'
import { UpdateNote } from '../graphql/mutations'
import Paginate from '../components/Paginate'
import TodoList from '../components/TodoList'
import CenteredContent from '../components/CenteredContent'

export default function Todo({ history }) {
  const [offset, setOffset] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setLoading] = useState(false)
  const authState = useContext(AuthStateContext)

  const [noteUpdate] = useMutation(UpdateNote)
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [userId, setUserId] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const limit = 50

  function todoAction(id, isCompleted) {
    setLoading(true)
    noteUpdate({ variables: { id, completed: !isCompleted, } }).then(() => {
      setLoading(false)
    })
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return
      }
      setOffset(offset - limit)
    } else if (action === 'next') {
      setOffset(offset + limit)
    }
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

        <div data-testid="pagination-container">
          <CenteredContent>
            <Paginate
              offSet={offset}
              limit={limit}
              active={true}
              handlePageChange={paginate}
            />
          </CenteredContent>
        </div>
    </Fragment>
  );
}

