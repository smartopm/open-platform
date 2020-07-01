import React from 'react'
import { Link } from 'react-router-dom'
import { List, ListItem, ListItemAvatar, Avatar, Divider, Typography, Box } from '@material-ui/core'

export default function Business({ businessData }) {
    return (
        <div className="container">
            <List>
                {
                    businessData.businesses.map(business => (
                        <Link to={`/business/${business.id}`}>
                            <ListItem key={business.id}>
                                <ListItemAvatar>
                                    <Avatar>
                                        {business.name.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>
                                <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <Typography data-testid="business-name">
                                        {business.name}
                                    </Typography>
                                    <Typography data-testid="business-category">
                                        {business.name}
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
