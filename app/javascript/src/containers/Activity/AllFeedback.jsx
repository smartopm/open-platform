import React, { Fragment, useState } from 'react'
import Nav from '../../components/Nav'
import { useQuery } from 'react-apollo'
import { allFeedback } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { formatISO9075 } from 'date-fns'

export default function FeedbackPage() {
    const { loading, error, data, } = useQuery(allFeedback)

    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />

    return (
        <Fragment>
            <Nav navName='Feedback' menuButton='back' />
            <div className='container'>
                {
                    Boolean(data.getFeedback.length) ? (
                        data.getFeedback.map(feedback => (
                            <div key={feedback.id}>
                                <hr />
                                <p>
                                    <b> <a href={`/user/${feedback.user.id}`}>{feedback.user.name}</a> </b> gave a thumbs {feedback.isThumbsUp ? '👍 up' : '👎🏾 down'} on <i style={{ color: 'grey' }}>{formatISO9075(new Date(feedback.createdAt))}</i>

                                </p>
                            </div>
                        ))
                    ) : (
                            <>
                                <br />
                                <p className='text-center'>
                                    No Feedback Yet
                                </p>
                            </>
                        )
                }
            </div>
        </Fragment>
    )
}