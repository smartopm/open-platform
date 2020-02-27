import React, { Fragment } from 'react'
import { useQuery } from 'react-apollo'
import Nav from '../components/Nav'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UsersQuery } from '../graphql/queries'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '../components/Avatar'
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Grid from "@material-ui/core/Grid";





const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    inline: {
        display: "inline"
    },
    centericon: {
        margin: -10,
        display: "flex",
        marginRight: "40%"
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest
        })
    },
    expandOpen: {
        transform: "rotate(180deg)"
    }
}));



export default function UsersList() {
    const classes = useStyles();
    const { loading, error, data } = useQuery(UsersQuery)

    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />


    return (
        <Fragment>
            <Nav navName='Users' menuButton='back' />

            <div className="container">

                <List >
                    {
                        data.users.map((user) => (
                            <Fragment key={user.id}>

                                <ListItem alignItems="flex-start">

                                    <Grid container wrap="nowrap" spacing={2}>
                                        <Grid item>
                                            <Avatar user={user} />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <ListItemText
                                                primary={user.name}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            className={classes.inline}
                                                            color="textPrimary"
                                                        >
                                                            {user.email}
                                                        </Typography>
                                                        {user.notes[0] ? " — " + user.notes[0].body : " — No Notes"}

                                                    </React.Fragment>
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={4}>
                                            <ListItemSecondaryAction>
                                                <ListItemText
                                                    primary={user.roleName}
                                                    style={{ marginTop: 0 }}

                                                />
                                            </ListItemSecondaryAction>
                                        </Grid>
                                    </Grid>



                                </ListItem>

                                <Divider variant="inset" component="li" />

                            </Fragment>

                        ))
                    }


                </List>

            </div>
        </Fragment >
    )
}

