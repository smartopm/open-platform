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
                    <ListItem style={{margin: 10}}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Box className={classes.detailsRow} >
                                    <ListItemAvatar>
                                        <Avatar imageUrl={user.imageUrl} style={"medium"} />
                                    </ListItemAvatar>
                                    <Box>
                                        <Box
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-around"
                                            }}
                                        >
                                        <Link to={`/user/${user.id}`} key={user.id}>
                                            <Typography  component="span" variant="body2">
                                               <strong> {user.name} </strong>
                                            </Typography>
                                        </Link>
                                            <span>{' / '} </span>
                                            <Typography variant="subtitle1">{user.roleName}</Typography>
                                        </Box>
                                        <Box
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-around",
                                                marginRight: 30
                                            }}
                                        >
                                            <Typography variant="body2" color="textSecondary">
                                                {user.phoneNumber || 'None'}
                                            </Typography>
                                            <span>{' / '} </span>
                                            <Typography variant="body2" color="textSecondary">
                                                {user.email}
                                            </Typography>
                                        </Box>
                                        <Box
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "flex-start",
                                                marginTop: 5
                                            }}
                                        >
                                            <Chip
                                                label="Basic"
                                                style={{ height: 25, marginRight: 5 }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box className={classes.root}>
                                    <Box>
                                        <Typography variant="body2">
                                            {user.notes && user.notes[0] ? user.notes[0].body : 'None'}
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
                                        <IconButton onClick={() => handleNoteModal(user.id, user.name,'Note')} >
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton onClick={()=>handleNoteModal(user.id, user.name,'Answered')}>
                                            <PhoneInTalkIcon />
                                        </IconButton >
                                        <IconButton onClick={() => handleNoteModal(user.id, user.name,'Missed')}>
                                            <PhoneMissedIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider  />
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
        width: 400
    }

}));
