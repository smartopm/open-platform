/* eslint-disable */
import React, { Fragment } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";
import PhoneMissedIcon from "@material-ui/icons/PhoneMissed";
import AddIcon from "@material-ui/icons/Add";
import { Link } from 'react-router-dom'
import Avatar from './Avatar.jsx'
import {
    Typography,
    Box,
    Chip,
    IconButton,
    ListItem,
    List,
    ListItemAvatar,
    Divider,
    Grid
} from "@material-ui/core";

export default function UserListCard({
    userData,
    handleNoteModal
}) {

    const classes = useStyles()
    return (

        <List>

            {userData.users.map(user => (
                <Fragment key={user.id}>
                    <ListItem style={{ margin: 10 }}>
                        <Grid container alignItems="center" spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Box className={classes.detailsRow} >
                                    <ListItemAvatar>
                                        <Avatar user={user} style={"medium"} />
                                    </ListItemAvatar>
                                    <Box style={{ margin: 5 }}>
                                        <Box
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-around",
                                            }}
                                        >
                                            <Link style={{ color: 'black' }} to={`/user/${user.id}`} key={user.id}>
                                                <Typography component="span" variant="subtitle1">
                                                    <strong> {user.name} </strong>
                                                </Typography>
                                            </Link>

                                            <Typography component="span" variant="body2">{user.roleName}</Typography>
                                        </Box>
                                        <Box
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-around",
                                                marginRight: 30
                                            }}
                                        >
                                            <Typography variant="body2" color="textSecondary">
                                                {user.phoneNumber}
                                            </Typography>

                                            <Typography variant="body2" color="textSecondary">
                                                {user.email}
                                            </Typography>
                                        </Box>
                                        <Box
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                flexWrap: 'wrap',
                                                listStyle: 'none',
                                                marginTop: 5,
                                            }}
                                        >
                                            {user.labels.map(label => (

                                                <Chip key={label.id}
                                                    label={label.shortDesc}
                                                    style={{ height: 25, margin: 5 }}
                                                />
                                            ))

                                            }
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box className={classes.root}>
                                    <Box style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography variant="body2">
                                            {user.notes && user.notes[0] ? user.notes[0].body : ''}
                                        </Typography>
                                    </Box>

                                    <Box
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginRight: 30
                                        }}
                                    >
                                        <IconButton onClick={() => handleNoteModal(user.id, user.name, 'Note')} >
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleNoteModal(user.id, user.name, 'Answered')}>
                                            <PhoneInTalkIcon />
                                        </IconButton >
                                        <IconButton onClick={() => handleNoteModal(user.id, user.name, 'Missed')}>
                                            <PhoneMissedIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider ariant="middle" />
                </Fragment>
            ))
            }
        </List>

    )
}

const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
        maxWidth: 400,

    },
    nameText: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },

    chipRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        margin: 5
    },
    chipHeight: {
        height: 25, marginRight: 5
    },
    detailsRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: 400
    }

}));
