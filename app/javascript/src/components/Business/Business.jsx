import React from 'react'
import { Link } from 'react-router-dom'
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@material-ui/core'

export default function Business({ businessData }) {
    return (
        <div className="container">
            <List>
                {
                    businessData.businesses.map(business =>(
                    <Link to={`/business/${business.id}`}>
                        <ListItem key={business.id}>
                            <ListItemAvatar>
                                <Avatar>
                                {business.name.charAt(0)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={business.name}/>
                            <Divider variant="middle" />
                        </ListItem>
                    </Link>
                    ))
                }
            </List>

        </div>
        
    )
}
