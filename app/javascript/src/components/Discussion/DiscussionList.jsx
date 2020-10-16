/* eslint-disable */
import React from 'react'
import { List, ListItem, Divider, ListItemText, Typography, ListItemAvatar, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete'
import { truncateString } from '../../utils/helpers';
import Avatar from '../Avatar';
import { css, StyleSheet } from 'aphrodite';


export default function DiscussionList({ data }) {
    function deleteDiscussion(e, id){
        e.stopPropagation();
        e.preventDefault()
        // call the delete mutation right here
        console.log(id)
    }
    return (
        <div className={css(styles.discussionList)}>
            <List >
                {data.length ? data.map(discussion => (
                    <Link key={discussion.id} /* to={`/discussions/${discussion.id}`} */ onClick={() => console.log('clicked ')} className={`card-link`}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar style={{ marginRight: 20 }}>
                                <Avatar user={discussion.user} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="h6" color='textSecondary' data-testid="disc_title">
                                        {discussion.title}
                                    </Typography>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                        >
                                            {discussion.user.name}
                                        </Typography>
                                        { discussion.description ? ` — ${truncateString(discussion.description, 100)}` : ''}
                                        <span style={{ float: 'right' }}>
                                        <IconButton onClick={event => deleteDiscussion(event, discussion.id)} edge="end" aria-label="delete" className={css(styles.deleteBtn)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        </span>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />
                    </Link>
                )) : 'No Discussions Topics'
                }
            </List>
        </div>
    )
}

const styles = StyleSheet.create({
    discussionList: {
        marginLeft: '11%',
        marginRight: '12%',
        '@media (max-width: 700px)': {
            marginLeft: '2%',
            marginRight: '2%',
        }
    }
})