import React from 'react'
import { Button, AppBar, Toolbar, Typography } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import ReactGA from 'react-ga';
import { useHistory } from 'react-router';
import logo from '../../../../assets/images/logo.png'
import nkwashiLogoUrl from '../../../../assets/images/logo-footer.png'

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
                <img className="img-fluid home_hero" src="https://nkwashi.com/wp-content/uploads/2017/02/home-hero.jpg" alt="Nkwashi landing page image"/>
                <div className="centered" data-testid="maintext-centered">
                    <h2 >Its not just a house, its a way of life</h2>
                </div>
                <br />
                <br/>
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
                <p className={css(styles.mainText)} data-testid="maintext">
                    Our house plans are designed by among the best architectural firms on the African 
                    continent and will be made available to plot owners.
                </p>

                <p className={css(styles.mainText)} data-testid="locationtext" >We are located in Woodlands, 11 Nalikwanda Road, Lusaka, Zambia</p>
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
        color: '#343a40',
        margin: 30
    },
    getStartedButton: {
        backgroundColor: "#25c0b0",
        color: "#FFF",
        width: "35%",
        height: 51,
        boxShadow: "none"
    },
})