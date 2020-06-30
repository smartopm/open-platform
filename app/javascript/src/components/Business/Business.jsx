import React from 'react'
import { Link } from 'react-router-dom'
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@material-ui/core'

export default function Business({ businessData }) {
    return (
        <div className="container">
            <List>
                {
                 <ListItem>
                     <ListItemAvatar>
                         <Avatar>
                             B
                         </Avatar>
                     </ListItemAvatar>
                     <ListItemText primary="Test Test" />
                     <Divider variant="middle" />
                 </ListItem>
                }
            </List>

        </div>
    )
}
