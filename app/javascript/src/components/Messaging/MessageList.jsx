import React from 'react';
import PropTypes from 'prop-types'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import UserMessageItem from './UserMessageItem';

export default function MessageList({ messages }) {
    return (
        <List>
            {
                messages.map(message => (
                    <React.Fragment key={message.id}>
                        <UserMessageItem
                            name={"receiver"}
                            // imageUrl={}
                            message={message.smsContent}
                            senderName={message.user.name}
                        />
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))
            }
        </List>
    )
}

MessageList.propTypes = {
    messages: PropTypes.Array.isRequired,
}
