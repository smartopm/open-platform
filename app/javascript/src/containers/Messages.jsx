import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Checkbox, Divider, ListItem, List } from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
        margin: "auto"
    }
}));
export default function Messages() {

    const classes = useStyles();

    return (
        <div className="container">
            <div className={classes.root}>
                <List>
                    <ListItem>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Checkbox edge="start" disableRipple />
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Grid item xs>
                                        <Typography gutterBottom variant="subtitle1">
                                            Standard license
                  </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            By: 1920x1080 • JPEG
                  </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Created: <i>1030114</i>
                                        </Typography>
                                    </Grid>
                                    <Grid item />
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant="body2"
                                        style={{ cursor: "pointer", marginBottom: 30 }}
                                    >
                                        Due Date: Remove
                </Typography>
                                    <Typography variant="subtitle1">
                                        <i>$19.00</i>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                </List>
            </div>
        </div>
    );

}
