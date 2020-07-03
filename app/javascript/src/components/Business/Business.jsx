import React from 'react'
import { Link } from 'react-router-dom'
import { List, ListItem, ListItemAvatar, Avatar, Divider, Typography, Box } from '@material-ui/core'

export default function Business({ businessData }) {
    return (
        <div className="container">
            <List>
                {
                    businessData.businesses.map(business => (
                        <Link key={business.id} to={`/business/${business.id}`} className={`card-link`}>
                            <ListItem key={business.id}>
                                <ListItemAvatar>
                                    <Avatar>
                                        {business.name.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>
                                <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <Typography variant="subtitle1" data-testid="business-name">
                                        {business.name}
                                    </Typography>
                                    <Typography variant="caption" data-testid="business-category">
                                        {business.category}
                                    </Typography>
                                </Box>
                                <Divider variant="middle" />
                            </ListItem>
                        </Link>
                    ))
                }
            </List>

        </div>

    )
}
