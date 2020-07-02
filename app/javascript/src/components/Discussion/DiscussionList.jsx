import React from 'react'
import { List, ListItem, Divider, ListItemText, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';



export default function DiscussionList({data}) {
    return (
        <div>
            <List >
                <Link to="/discussions/" style={{color: '#fff'}} className={`card-link`}>
                    <ListItem alignItems="flex-start">
                        <ListItemText
                            primary={
                                <Typography variant="h6" color='textPrimary' >
                                    Brunch this weekend?
                            </Typography>
                            }
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        // className={classes.inline}
                                        color="textPrimary"
                                    >
                                        Ali Connors
                                </Typography>
                                    {" — I'll be in your neighborhood doing errands this…"}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                </Link>
                <Divider component="li" />
            </List>

        </div>

    )
}
