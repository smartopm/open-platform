import React from 'react';
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from "react-router-dom";


export default function UserMessageItem({ id, name, imageUrl, message, messageCount, clientNumber }) {
    let history = useHistory();

    function readMessages() {
        history.push({
            pathname: `/message/${id}`,
            state: { clientNumber, clientName: name }
        })
    }

    return (
        <ListItem alignItems="flex-start" onClick={readMessages} >
            <ListItemAvatar>
                <Avatar alt={name} src={imageUrl} />
            </ListItemAvatar>
            <ListItemText
                primary={`${name}  (${messageCount})`}
                secondary={
                    <React.Fragment>
                        {`  ${message}`}
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}

UserMessageItem.propTypes = {
    name: PropTypes.string.isRequired,
    messageCount: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
    message: PropTypes.string,
    clientNumber: PropTypes.string,
}
