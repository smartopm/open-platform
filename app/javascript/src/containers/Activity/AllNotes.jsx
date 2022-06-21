/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from 'react'
import { useQuery } from 'react-apollo'
import { allNotes } from '../../graphql/queries'
import Loading from '../../shared/Loading'
import ErrorPage from '../../components/Error'
import DateContainer from '../../components/DateContainer'

// TODO: move to its own module and use the global theme
const limit = 20
export default function Notes() {
  const [offset, setOffset] = useState(0)
  const { loading, error, data } = useQuery(allNotes, {
    variables: { limit, offset }
  })

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

  return (
    <>

      <div className="container">
        {data.allNotes.length ? (
          data.allNotes.map(note => (
            <div key={note.id}>
              <hr />
              <p>
                <b>
                  <a style={{color: 'black'}} href={`/user/${note.author.id}`} data-testid='name'>{note.author.name}</a>
                  {' '}
                </b>
                {' '}
                created a note for
                {' '}
                <b>
                  <a style={{color: 'black'}} href={`/user/${note.user.id}`} data-testid='user'>{note.user.name}</a>
                </b>
                {' '}
                on
                {' '}
                <i style={{ color: 'grey' }}>
                  <DateContainer date={note.createdAt} />
                </i>
                <br />
                {note.body}
              </p>
            </div>
          ))
        ) : (
          <>
            <br />
            <p className="text-center" data-testid='no-notes-txt'>No Notes Yet</p>
          </>
        )}
        <div className="d-flex justify-content-center">
          <nav aria-label="center Page navigation">
            <ul className="pagination">
              <li className={`page-item ${offset < limit && 'disabled'}`}>
                <a className="page-link" onClick={handlePreviousPage} href="#" data-testid="prev-link">
                  Previous
                </a>
              </li>
              <li
                className={`page-item ${data.allNotes.length < limit &&
                  'disabled'}`}
              >
                <a className="page-link" onClick={handleNextPage} href="#" data-testid="next-link">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
