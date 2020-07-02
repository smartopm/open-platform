import React from 'react'
import { List, ListItem, Divider, ListItemText, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { truncateString } from '../../utils/helpers';


export default function DiscussionList({ data }) {
    return (
        <div>
            <List >
                {data.length ? data.map(discussion => (
                    <Link key={discussion.id} to={`/discussions/${discussion.id}`} style={{ color: '#fff' }} className={`card-link`}>
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary={
                                    <Typography variant="h6" color='textPrimary' >
                                        {discussion.title}
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
                                            {discussion.user.name}
                                        </Typography>
                                        { discussion.description ? ` — ${truncateString(discussion.description, 100)}` : ''}
                                       
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    </Link>
                )) : 'No Discussions Topics'
                }
                <Divider component="li" />
            </List>

        </div>

    )
}
