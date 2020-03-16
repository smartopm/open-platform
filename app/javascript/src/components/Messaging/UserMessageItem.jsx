import React from 'react';
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';


export default function UserMessageItem({ name, imageUrl, senderName, message }) {
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt={name} src={imageUrl} />
            </ListItemAvatar>
            <ListItemText
                primary={name}
                secondary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                        >
                            {senderName}
                        </Typography>
                        {message}
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}

UserMessageItem.propTypes = {
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    senderName: PropTypes.string,
    message: PropTypes.string.isRequired,
}
