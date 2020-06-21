import React from 'react'
import { Grid, Button, Typography, Box, Container } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'

export default function WelcomePage() {
    return (
        <Grid container spacing={5} justify="flex-start">
            <Grid item xs>
                <Grid container direction="row">
                    <Grid item xs={4}>
                        <CustomButton title="Schedule a call" />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomButton title="Schedule a call" />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomButton title="Schedule a call" />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className={css(styles.fullHeightSection)}>
                <img src="https://nkwashi.com/wp-content/uploads/2019/10/20190821-NkanshiZikoPhotography975A9968104.jpg"
                    style={{
                        width: '80%',
                        margin: '0 10% 0 10%'
                    }}
                />
            </Grid>
        </Grid>
    )
}

export function CustomButton({title}) {
    return (
            <Button className={css(styles.customButton)}>
                {title}
            </Button>
    )
}

const styles = StyleSheet.create({
    fullHeightSection: {
        height: '100vh',
        // backgroundColor: '#66a59a',
        color: '#FFFFFF'
    },
    customButton: {
        backgroundColor: '#66a59a',
        color: '#FFFFFF',
        fontSize: 13,
        marginLeft: 10,
        marginRight: 10,
        marginTop: '5vh'
    },
    mainText: {
        marginTop: '-20vh'
    }
})