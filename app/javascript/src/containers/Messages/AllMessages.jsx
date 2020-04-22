import React, { Fragment, useState } from 'react'
import { useQuery } from 'react-apollo'
import { MessagesQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import MessageList from '../../components/Messaging/MessageList'
import Nav from '../../components/Nav'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import SearchIcon from '@material-ui/icons/Search'
import InputAdornment from '@material-ui/core/InputAdornment'

const limit = 50
export default function AllMessages() {
  const [offset, setOffset] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const { loading, error, data, refetch } = useQuery(MessagesQuery, {
    variables: {
      searchTerm,
      offset,
      limit
    }
  });

  if (loading) return <Loading />
  if (error) return <ErrorPage error={error.message} />

  function handleNextPage() {
    setOffset(offset + limit)
  }
  function handlePreviousPage() {
    if (offset < limit) {
      return
    }
    setOffset(offset - limit)
  }

  function handleChange(event) {
      console.log(event.target.value)
    setSearchTerm(event.target.value)
    console.log(searchTerm)
  }

  return (
    <Fragment>
        <Nav navName="Messages" menuButton="back" backTo="/" />
        <OutlinedInput
        value={searchTerm}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        aria-describedby="search messages input"
        inputProps={{
          'aria-label': 'search'
        }}
        fullWidth
        labelWidth={0}
        placeholder="search message content, user name and phone number"
      />
      <MessageList messages={data.messages} />
      <div className="d-flex justify-content-center">
        <nav aria-label="center Page navigation">
          <ul className="pagination">
            <li className={`page-item ${offset < limit && 'disabled'}`}>
              <a className="page-link" onClick={handlePreviousPage} href="#">
                Previous
              </a>
            </li>
            <li
              className={`page-item ${data.messages.length < limit &&
                'disabled'}`}
            >
              <a className="page-link" onClick={handleNextPage} href="#">
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </Fragment>
  )
}
