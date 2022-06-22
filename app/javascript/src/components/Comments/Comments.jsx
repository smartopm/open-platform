/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { CommentsPostQuery } from '../../graphql/queries'
import Loading from '../../shared/Loading'
import ErrorPage from '../Error'
import CommentList from './CommentList'

export default function Comments() {
  const limit = 20
  const [offset, setOffset] = useState(0)

  const { loading, error, data } = useQuery(CommentsPostQuery, {
    variables: { limit, offset }
  })

  function handleNextPage() {
    setOffset(offset + limit)
  }

  function handlePreviousPage() {
    if (offset < limit) {
      return
    }
    setOffset(offset - limit)
  }
  
  if (loading) return <Loading />

  if (error) {
    return <ErrorPage title={error.message || error} />
  }

  return (
    <>
      <CommentList data={data.fetchComments} />
      <div className="d-flex justify-content-center" data-testid='container'>
        <nav aria-label="center Page navigation">
          <ul className="pagination">
            <li className={`page-item ${offset < limit && 'disabled'}`}>
              <a className="page-link" onClick={handlePreviousPage} href="#" data-testid='previous'>
                Previous
              </a>
            </li>
            <li
              className={`page-item ${data.fetchComments.length < limit &&
                  'disabled'}`}
            >
              <a className="page-link" onClick={handleNextPage} href="#" data-testid='next'>
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}