import React, { useContext, Fragment, useState } from 'react';
import { useQuery } from 'react-apollo'
import { useHistory } from "react-router-dom";
import { MessagesQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import MessageList from '../../components/Messaging/MessageList'
import ReactPaginate from "react-paginate"

export default function AllMessages() {
    const limit = 2
    const [offset, setOffset] = useState(0)
    const { loading, error, data } = useQuery(MessagesQuery)
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
    const _messages = filterMessages(data.users)

    function handlePageClick(data) {
        const { selected } = data;
        const offset = Math.ceil(selected * limit);
        console.log(offset)
        console.log(data)
        return _messages.slice(limit, offset);
    }
    // handlePageClick = data => {
    //     const { selected } = data;
    //     const offset = Math.ceil(selected * Session.get("limit"));
    //     Session.set("skip", offset);
    // };
    return (
        <Fragment>
            <MessageList messages={_messages} />
            <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={<span>...</span>}
                breakClassName={"break-me"}
                pageCount={2}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination "}
                activeClassName={"active blue"}
                pageLinkClassName={"link"}
            />
        </Fragment>

    )
}
export function filterMessages(messages) {
    const filteredMessages = messages.filter(function (message) {
        return message.messages.length !== 0
    })
    return filteredMessages;
}

