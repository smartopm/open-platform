import React from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'

export default function WelcomePage() {
    return (
        <Grid container spacing={3}>
            <Grid item xs={6} sm={6} className={css(styles.fullHeightSection)}>
                Full Height
            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="flex-start"
                spacing={3} item xs={6}
            >
                <CustomButton title="Schedule a call" />
                <CustomButton title="Book a tour"/>
                <CustomButton title="Become a client" />

                {/* title */}
                <Typography align="center" variant="h3" className={css(styles.mainText)}>
                    Its not just a house, its a way of life
                </Typography>
                <Typography align="center" variant="body1" paragraph>
                    Our house plans are designed by among the best architectural firms on the African continent
                    and will be made available to plot owners.
                </Typography>
            </Grid>
        </Grid>
    )
}

export function CustomButton({title}) {
    return (
        <Grid item xs>
            <Button className={css(styles.customButton)}>
                {title}
            </Button>
        </Grid>
    )
}

const styles = StyleSheet.create({
    fullHeightSection: {
        height: '100vh',
        backgroundColor: '#66a59a',
        color: '#FFFFFF'
    },
    customButton: {
        backgroundColor: '#66a59a',
        color: '#FFFFFF',
        fontSize: 13,
        marginTop: '10vh'
    },
    mainText: {
        marginTop: '-20vh'
    }
})