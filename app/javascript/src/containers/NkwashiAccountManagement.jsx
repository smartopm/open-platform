import React from 'react';
import { useWindowDimensions } from '../utils/customHooks'
import IframeContainer from '../components/IframeContainer'
import {  Grid } from '@material-ui/core'
import Nav from '../components/Nav';
import { StyleSheet, css } from 'aphrodite'

export default function NkwashiAccountManagement() {
    const { width, height } = useWindowDimensions()
    const url = "https://mythebe.thebe-im.com/index.php/site/login"

    return (

        <React.Fragment>
            <Nav navName="Thebe Investment Management" menuButton="back" backTo="/">
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid container justify="center" item xs={10}>
                    <div>
                        <p className={css(styles.navTitle)}><i>This application is providing access to your Thebe portal. Remember to log off once you are done.</i></p>
                    </div>
                    </Grid>
                </Grid>
            </Nav>
            <IframeContainer
                link={url}
                height={height}
                width={width}
            />
        </React.Fragment>
    )

}
const styles = StyleSheet.create({
    navTitle: {
      top: '8px',
      color: '#FFF',
      display: 'flex',
      marginLeft: 100,
      justifyContent: "center",
      fontSize: 12,
      right: 10
    }
  })
  

