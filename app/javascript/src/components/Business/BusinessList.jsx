import React from 'react'
import { Link } from 'react-router-dom'
import { List, ListItem, ListItemAvatar, Divider, Typography, Box } from '@material-ui/core'
import Avatar from '../Avatar'

export default function BusinessList({ businessData }) {
    return (
      <div className="container">
        <List>
          {
                    businessData.businesses.map(business => (
                      <Link key={business.id} to={`/business/${business.id}`} className="card-link">
                        <ListItem key={business.id}>
                          <ListItemAvatar>
                            {
                            // eslint-disable-next-line 
                            }<Avatar imageUrl={business.imageUrl} style="medium" />
                          </ListItemAvatar>
                          <Box
                            style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    marginLeft: 30
                                }}
                          >
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
