import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import UserMessageItem from './UserMessageItem';
import Nav from '../Nav';

export default function MessageList({ messages }) {
    return (
        <Fragment>
            <Nav navName="Messages" menuButton="back" />
            <List>
                {
                    messages.length && messages.map(message => (
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

