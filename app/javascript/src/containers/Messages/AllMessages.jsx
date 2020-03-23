import React, { useContext, Fragment, useState } from 'react';
import { useQuery } from 'react-apollo'
import { useHistory } from "react-router-dom";
import { MessagesQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import MessageList from '../../components/Messaging/MessageList'

const limit = 10
export default function AllMessages() {
    const [offset, setOffset] = useState(0)
    const { loading, error, data } = useQuery(MessagesQuery, {
        variables: {
            offset,
            limit
        }
    })
    const authState = useContext(AuthStateContext)
    let history = useHistory();

    if (authState.user.userType !== 'admin') {
        history.push('/')
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
