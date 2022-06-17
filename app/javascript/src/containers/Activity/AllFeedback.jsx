/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from 'react'
import { useQuery } from 'react-apollo'
import { formatISO9075 } from 'date-fns'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { useTranslation } from 'react-i18next';
import { allFeedback } from '../../graphql/queries'
import Loading from '../../shared/Loading'
import ErrorPage from '../../components/Error'

// TODO: move to its own module and use the global theme and possibly reuse this

const limit = 20
export default function FeedbackPage() {
  const [offset, setOffset] = useState(0)
  const { loading, error, data } = useQuery(allFeedback, {
    variables: { limit, offset }
  })
  const { t } = useTranslation(['feedback', 'common']);
  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />

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
        {data.usersFeedback.length ? (
          data.usersFeedback.map(feedback => (
            <div key={feedback.id}>
              <hr />
              <p>
                <b>
                  {' '}
                  <a href={`/user/${feedback.user.id}`}>
                    {feedback.user.name}
                  </a>
                  {' '}
                </b>
                {' '}
                {t('misc.gave_thumbs')}
                {' '}
                {feedback.isThumbsUp ? (
                  <>
                    {t('misc.up')}
                    {' '}
                    <ThumbUpIcon />
                    {' '}
                  </>
                ) : (
                  <>
                    {t('misc.down')}
                    {' '}
                    <ThumbDownIcon />
                    {' '}
                  </>
                )}
                {' '}
                {t('misc.on')}
                {' '}
                <i style={{ color: 'grey' }}>
                  {formatISO9075(new Date(feedback.createdAt))}
                </i>
                <br />
                {feedback.review && (
                <span>
                  {' '}
                  {t('misc.review')}
                  :
                  {feedback.review} 
                </span>
)}
              </p>
            </div>
          ))
        ) : (
          <>
            <br />
            <p className="text-center" data-testid="no-feedback-txt">No Feedback Yet</p>
          </>
        )}
        <div className="d-flex justify-content-center">
          <nav aria-label="center Page navigation">
            <ul className="pagination">
              <li className={`page-item ${offset < limit && 'disabled'}`}>
                <a className="page-link" onClick={handlePreviousPage} href="#" data-testid="prev-link">
                  {t('common:misc.previous')}
                </a>
              </li>
              <li
                className={`page-item ${data.usersFeedback.length < limit &&
                  'disabled'}`}
              >
                <a className="page-link" onClick={handleNextPage} href="#" data-testid="next-link">
                  {t('common:misc.next')}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
