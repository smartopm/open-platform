/* eslint-disable */
import React, { Fragment, useState } from 'react'
import Nav from '../../components/Nav'
import { useQuery } from 'react-apollo'
import { allFeedback } from '../../graphql/queries'
import Loading from '../../shared/Loading'
import ErrorPage from '../../components/Error'
import { formatISO9075 } from 'date-fns'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'

const limit = 20
export default function FeedbackPage() {
  const [offset, setOffset] = useState(0)
  const { loading, error, data } = useQuery(allFeedback, {
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
    <Fragment>
      <Nav navName="Feedback" menuButton="back" backTo="/" />
      <div className="container">
        {data.usersFeedback.length ? (
          data.usersFeedback.map(feedback => (
            <div key={feedback.id}>
              <hr />
              <p>
                <b>
                  {' '}
                  <a href={`/user/${feedback.user.id}`}>
                    {feedback.user.name}
                  </a>{' '}
                </b>{' '}
                gave a thumbs{' '}
                {feedback.isThumbsUp ? (
                  <>
                    Up <ThumbUpIcon />{' '}
                  </>
                ) : (
                  <>
                    Down <ThumbDownIcon />{' '}
                  </>
                )}{' '}
                on{' '}
                <i style={{ color: 'grey' }}>
                  {formatISO9075(new Date(feedback.createdAt))}
                </i>
                <br />
                {feedback.review && <span> Review: {feedback.review} </span>}
              </p>
            </div>
          ))
        ) : (
          <Fragment>
            <br />
            <p className="text-center" data-testid="no-feedback-txt">No Feedback Yet</p>
          </Fragment>
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
                className={`page-item ${data.usersFeedback.length < limit &&
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
    </Fragment>
  )
}
