import React, { useContext, Fragment } from 'react';
import { useQuery } from 'react-apollo'
import { useHistory } from "react-router-dom";
import { MessagesQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import MessageList from '../../components/Messaging/MessageList'

export default function AllMessages() {
    const { loading, error, data } = useQuery(MessagesQuery)
    const authState = useContext(AuthStateContext)
    let history = useHistory();

    if (authState.user.userType !== 'admin') {
        history.push('/')
    }
    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />

    const _messages = filterMessages(data.users)

    return (
        <Fragment>
            <MessageList messages={_messages} />

        </Fragment>

    )
}
export function filterMessages(messages) {
    const filteredMessages = messages.filter(function (message) {
        return message.messages.length !== 0
    })
    return filteredMessages;
}

