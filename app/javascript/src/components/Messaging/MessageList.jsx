import React from 'react';
import PropTypes from 'prop-types'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import UserMessageItem from './UserMessageItem';

export default function MessageList({ messages }) {
    return (
        <List>
            {
                messages.length && messages.map(message => (
                    <React.Fragment key={message.id}>
                        <UserMessageItem
                            id={message.user.id}
                            name={message.user.name}
                            imageUrl={message.user.imageUrl}
                            message={message.smsContent}
                            senderName={message.sender.name}
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
