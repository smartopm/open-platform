import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import UserMessageItem from './UserMessageItem';
import Nav from '../Nav';

export default function MessageList({ messages }) {
    const _messages = sortNestedMessages('messages', messages)
    return (
        <Fragment>
            <Nav navName="Messages" menuButton="back" />
            <List>
                {
                    _messages.length && _messages.map(message => (
                        <React.Fragment key={message.id}>
                            <UserMessageItem
                                id={message.id}
                                name={message.name}
                                imageUrl={message.imageUrl}
                                message={message.messages.length ? message.messages[message.messages.length - 1].message : ''}
                                messageCount={message.messages.length}
                                clientNumber={message.phoneNumber}
                            />
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))
                }
            </List>
        </Fragment>
    )
}
MessageList.defaultProps = {
    messages: []
}

MessageList.propTypes = {
    messages: PropTypes.array.isRequired,
}

export function sortNestedMessages(prop, messages) {
    prop = prop.split('.');
    let len = prop.length;

    messages.sort(function (a, b) {
        let i = 0;
        while (i < len) { a = a[prop[i]]; b = b[prop[i]]; i++; }
        if (a > b) {
            return -1;
        } else if (a < b) {
            return 1;
        } else {
            return 0;
        }
    });
    return messages;
}