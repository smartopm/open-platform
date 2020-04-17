import React, { Fragment, useState, useContext } from 'react'
import Nav from '../../components/Nav'
import { useQuery } from 'react-apollo'
import { allFeedback } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { formatISO9075 } from 'date-fns'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import { Redirect } from 'react-router'


const limit = 20
export default function FeedbackPage() {
    const [offset, setOffset] = useState(0)
    const authState = useContext(AuthStateContext)
    const { loading, error, data, } = useQuery(allFeedback, {
        variables: { limit, offset }
    })
    if (authState.user.userType === 'security_guard') {
        return <Redirect push to="/guard_home" />
    }
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
            <Nav navName='Feedback' menuButton='back'  backTo="/" />
            <div className='container'>
                {
                    data.usersFeedback.length ? (
                        data.usersFeedback.map(feedback => (
                            <div key={feedback.id}>
                                <hr />
                                <p>
                                    <b> <a href={`/user/${feedback.user.id}`}>{feedback.user.name}</a> </b> gave a thumbs {feedback.isThumbsUp ? <>Up <ThumbUpIcon /> </> : <>Down <ThumbDownIcon /> </>} on <i style={{ color: 'grey' }}>{formatISO9075(new Date(feedback.createdAt))}</i>
                                    <br />
                                    {
                                        feedback.review && <span> Review: {feedback.review} </span>
                                    }
                                </p>
                            </div>
                        ))
                    ) : (
                            <Fragment>
                                <br />
                                <p className='text-center'>
                                    No Feedback Yet
                                </p>
                            </Fragment>
                        )
                }
                <div className="d-flex justify-content-center">
                    <nav aria-label="center Page navigation">
                        <ul className="pagination">
                            <li className={`page-item ${offset < limit && 'disabled'}`}>
                                <a className="page-link" onClick={handlePreviousPage} href="#">
                                    Previous
                                </a>
                            </li>
                            <li
                                className={`page-item ${data.usersFeedback.length < limit &&
                                    'disabled'}`}
                            >
                                <a className="page-link" onClick={handleNextPage} href="#">
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