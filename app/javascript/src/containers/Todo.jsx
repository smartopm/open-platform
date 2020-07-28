import React, { Fragment, useState, useContext } from 'react'
import Nav from '../components/Nav'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import { useQuery, useMutation } from 'react-apollo'
import { flaggedNotes } from '../graphql/queries'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UpdateNote } from '../graphql/mutations'
import Paginate from '../components/Paginate'
import TodoList from '../components/TodoList'
import CenteredContent from '../components/CenteredContent'

export default function Todo({ history }) {
  const [offset, setOffset] = useState(0)
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
      refetch()
    })
  }

  const { loading, error, data, refetch } = useQuery(flaggedNotes, {
    variables: {
      offset, limit
    }
  })
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
      refetch()
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
  if (loading) return <Loading />
  if (error) return <ErrorPage error={error.message} />

  return (
    <Fragment>
      <Nav navName="Todo" menuButton="back" backTo="/" />
      
      <TodoList
       isDialogOpen={isDialogOpen}
       handleModal={handleModal}
       saveDate={saveDate}
       selectedDate={selectedDate}
       handleDateChange={handleDateChange}
      //  data={data}
      //  isLoading={isLoading}
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

