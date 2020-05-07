import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Button, Grid } from '@material-ui/core'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import WhatsAppIcon from '@material-ui/icons/WhatsApp'
import PhoneIcon from '@material-ui/icons/Phone'
import { StyleSheet, css } from 'aphrodite'

const useStyles = makeStyles({
    root: {
        width: '100%',
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'center'
    },

    title: {
        fontSize: 14
    },
    pos: {
        margin: 10
    }
})

export default function SupportCard({handleSendMessage}) {
    const classes = useStyles()
    // hard coding CSM number
    // TODO: @olivier ==> Find a better to get numbers && ids for CSM dynamically
    const CSMNumber = '260974624243'

    return (
        <Fragment>
            <div className="justify-content-center align-items-center container">
                <Typography paragraph variant="body1" color="textSecondary">
                    Nkwashi partners with DoubleGDP on this mobile app to better connect
                    with clients and residents, and to deliver efficient and responsive
                    public services. Today we have digital IDs to make gate access faster,
                    easier, and more secure than paper logs. We also have registration
                    kiosk at the showroom and support desk functionality to ensure your
                    queries are answered to your satisfaction.
                </Typography>

                <Typography
                    variant="body1"
                    color="textSecondary"
                    component="p"
                    align="center"
                >
                    We love receiving questions and feedback. You can contact us through
                    any of the following channels:
                </Typography>
            </div>
            <div className="justify-content-center align-items-center container">
                <Grid container direction="row" className={classes.root}>
                    <Grid item>
                        <MailOutlineIcon />
                    </Grid>

                    <Grid item>
                        <Typography
                            className={classes.pos}
                            color="textSecondary"
                            gutterBottom
                        >
                            <a href="mailto:support@doublegdp.com">support@doublegdp.com</a>
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container direction="row" className={classes.root}>
                    <Grid item>
                        <PhoneIcon />
                    </Grid>

                    <Grid item>
                        <Typography className={classes.pos} color="textSecondary">
                            <a href="tel:+260976261199">+260 976 261199</a>
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container direction="row" className={classes.root}>
                    <Grid item>
                        <PhoneIcon />
                    </Grid>

                    <Grid item>
                        <Typography className={classes.pos} color="textSecondary">
                            <a href={`tel:+${CSMNumber}`}>+260 974 624243</a>
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container direction="row" className={classes.root}>
                    <Grid item>
                        <WhatsAppIcon />
                    </Grid>

                    <Grid item>
                        <Typography className={classes.pos} color="textSecondary">
                            <a href={`https://api.whatsapp.com/send?phone=${CSMNumber}`}>
                                {' '}
                            +260 974 624243
                            </a>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container direction="row" className={classes.root}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        className={css(styles.chatButton)}
                    >
                        Support Chat
                    </Button>
                </Grid>
            </div>
        </Fragment>
    );

}

const styles = StyleSheet.create({
    chatButton: {
        backgroundColor: '#25c0b0',
        color: '#FFF',
        width: '55%',
        height: 51,
        boxShadow: 'none',
        marginTop: 50
    }
})
