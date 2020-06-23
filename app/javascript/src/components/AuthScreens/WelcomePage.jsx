import React from 'react'
import { Button, AppBar, Toolbar, Typography, Grid } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import ReactGA from 'react-ga';
import { useHistory } from 'react-router';
import logo from '../../../../assets/images/logo.png'
import nkwashiLogoUrl from '../../../../assets/images/logo-footer.png'
import thebeLogoUrl from '../../../../assets/images/thebe-logo.png'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CallIcon from '@material-ui/icons/Call';
import MailIcon from '@material-ui/icons/Mail';
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

export default function WelcomePage() {
    const history = useHistory()
    return (
        <>
            <AppBar position="static" style={{ backgroundColor: '#FFFFFF' }} >
                <Toolbar>
                    <div className="align-items-center d-flex justify-content-center">
                        <img src={logo}
                            style={{
                                width: 110,
                                height: 40
                            }} />
                    </div>
                    <Typography variant="h6">
                        News
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className="container_img">
                <img className="img-fluid home_hero" src="https://nkwashi.com/wp-content/uploads/2017/02/home-hero.jpg" alt="Nkwashi landing page image" />
                <div className="centered" data-testid="maintext-centered">
                    <h2 >Its not just a house, its a way of life</h2>
                </div>
                <br />
                <br />
                <CustomButton title="Schedule a call" />
                <CustomButton title="Book a tour" />
                <CustomButton title="Become a client" />
                <br />
                <br />
                <Button
                    variant="contained"
                    className={`btn ${css(styles.getStartedButton)}`}
                    onClick={() => history.push("/login")}
                >
                    Login
                 </Button>
                <br />
                <br />
                <img src={nkwashiLogoUrl} alt="community logo" />
                <br />
                <br />
                <p className={css(styles.mainText)} data-testid="maintext">
                    Our house plans are designed by among the best architectural firms on the African
                    continent and will be made available to plot owners.
                </p>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} sm={6}>
                        <LocationOnIcon className={css(styles.icon)} />
                        <p className={css(styles.mainText)} data-testid="locationtext" >11 Nalikwanda Road, Lusaka, Zambia</p>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <CallIcon className={css(styles.icon)} />
                        <p className={css(styles.mainText)}>
                            +260-211-268-915 , + 260-972-577-234 <br />
                        + 260-961-105-655, + 260-954-809-717
                        </p>
                    </Grid>
                    <Grid item xs={12} md={4} sm={12}>
                        <MailIcon className={css(styles.icon)} />
                        <p className={css(styles.mainText)}>
                            hello@thebe-im.com
                        </p>
                    </Grid>
                    <hr />
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} sm={4}>
                        <img src={thebeLogoUrl} alt="thebe logo" />
                    </Grid>
                    <Grid item xs={12} md={4} sm={4}>
                        <p className={css(styles.footerText)}>
                            ©2017. Thebe Investment Management Limited. All Rights Reserved
                        </p>
                    </Grid>
                    <Grid item xs={12} md={4} sm={4}>
                        <Button
                            startIcon={<FacebookIcon />}
                            className={css(styles.iconButton)}
                        >
                            <a className={css(styles.socialLinks)} href="https://www.facebook.com/nkwashi.soar/" target='_blank' rel="noopener noreferrer">
                                Like
                            </a>
                        </Button>
                        <Button
                            startIcon={<LinkedInIcon />}
                            className={css(styles.iconButton)}
                        >
                            <a className={css(styles.socialLinks)} href="https://www.linkedin.com/company/10478892" target='_blank' rel="noopener noreferrer">
                                Follow us
                            </a>
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export function CustomButton({ title }) {
    const route = {
        call: 'https://forms.gle/4t553oiff7XTFYnW9',
        tour: 'https://forms.gle/9N79ZwKXTPxcrAta9',
        client: 'https://forms.gle/rtSH9oou9usUfJQ98'
    }
    function getName(name) {
        return name.split(' ')[2]
    }
    function handleClicks() {
        ReactGA.event({
            category: 'OpenPage',
            action: title,
            eventLabel: 'Open page Interaction',
            nonInteraction: true
        });
        return window.open(route[getName(title)], '_blank')
    }
    return (
        <Button variant="outlined" onClick={() => handleClicks(title)} className={css(styles.customButton)}>
            {title}
        </Button>
    )
}

const styles = StyleSheet.create({
    customButton: {
        fontSize: 13,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    mainText: {
        color: '#767676',
        margin: 30,
        marginTop: 10
    },
    getStartedButton: {
        backgroundColor: "#25c0b0",
        color: "#FFF",
        width: "35%",
        height: 51,
        boxShadow: "none"
    },
    icon: {
        color: '#25c0b0'
    },
    footerText: {
        color: '#767676',
        marginTop: 10
    },
    iconButton: {
        textTransform: 'none',
    },
    socialLinks: {
        textDecoration: 'none',
        color: '#767676',
        marginLeft: -7
    }
})