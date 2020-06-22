import React from 'react'
import { Button } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'

export default function WelcomePage() {
    return (
        <>
            
            <div className="container_img">
                <img className="img-fluid home_hero" src="https://nkwashi.com/wp-content/uploads/2017/02/home-hero.jpg" alt="Snow"/>
                <br />
                <br/>
                <CustomButton title="Schedule a call" />
                <CustomButton title="Book a tour" />
                <CustomButton title="Become a client" />
                <br />
                <br/>
                <p className={css(styles.mainText)}>
                    Our house plans are designed by among the best architectural firms on the African 
                    continent and will be made available to plot owners.
                </p>
                <div className="centered">
                    <h2 >Its not just a house, its a way of life</h2>
                </div>
                <p className={css(styles.mainText)}>We are located in Woodlands, 11 Nalikwanda Road, Lusaka, Zambia</p>
                
            </div>
        </>
    )
}

export function CustomButton({ title }) {
    return (
        <Button className={css(styles.customButton)}>
            {title}
        </Button>
    )
}

const styles = StyleSheet.create({
    fullHeightSection: {
        height: '100vh',
        color: '#FFFFFF'
    },
    customButton: {
        fontSize: 13,
        marginLeft: 10,
        marginRight: 10,
    },
    mainText: {
        color: '#343a40',
        margin: 30
    }
})