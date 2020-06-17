import React from 'react'
import { Grid, Button } from '@material-ui/core'
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
                spacing={3} item xs={6} >
                <CustomButton title="Schedule a call" />
                <CustomButton title="Book a tour"/>
                <CustomButton title="Become a client" />
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
        fontSize: 13
    }
})