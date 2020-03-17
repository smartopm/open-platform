import React from 'react';
import PropTypes from 'prop-types'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import UserMessageItem from './UserMessageItem';

export default function MessageList({ messages }) {
    const _messages = sortNestedMessages('messages', messages)
    console.log(_messages)
    return (
        // <div />
        <List>
            {
                _messages.length && _messages.map(message => (
                    <React.Fragment key={message.id}>
                        <UserMessageItem
                            id={message.id}
                            name={message.name}
                            imageUrl={message.imageUrl}
                            message={message.messages.length ? message.messages[0].message : ''}
                            senderName={message.messages.length ? message.messages[0].user.name : ''}
                        />
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))
            }
        </List>
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
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    });
    return messages;
}