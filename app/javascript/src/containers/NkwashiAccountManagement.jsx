import React from 'react';
import { useWindowDimensions } from '../utils/customHooks'
import IframeContainer from '../components/IframeContainer'
import { Grid, Typography } from '@material-ui/core'
import Nav from '../components/Nav';
import Popover from '@material-ui/core/Popover';
import { StyleSheet, css } from 'aphrodite'

export default function NkwashiAccountManagement() {
    const { width, height } = useWindowDimensions()
    const url = "https://mythebe.thebe-im.com/index.php/site/login"
    const [anchorEl, setAnchorEl] = React.useState(null);

    function openPopover() {
        setAnchorEl(event.currentTarget);
    }

    function closePopover() {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (

        <React.Fragment>
            <Nav navName="Thebe Investment Management" menuButton="back" backTo="/">
                <Grid data-testid="crf-link" container direction="row" justify="center" alignItems="center"  style={{height: 10}}>
                    <Grid container justify="center" item xs={10}>
                        <div>
                            <p className={css(styles.navTitle)}><i>This application is providing access to your Thebe portal. Remember to log off once you are done.</i></p>
                        </div>
                    </Grid>
                    <Grid item container justify="flex-end" xs={2}>

                        <div>
                            <p onClick={openPopover} style={{color: '#FFF'}}>Trouble logging in?</p>

                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={closePopover}
                                anchorOrigin={{
                                    vertical: 'right',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Typography style={{height: 50, width: 600}} >
                                    To request your login information or reset your username and password, submit a <a onClick={() => window.open('https://forms.gle/Sdbj91Sia8EpDJiN6', '_blank')}> <i><u>Client Request Form</u></i></a>
                                </Typography>
                            </Popover>

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
        marginLeft: 200,
        justifyContent: "center",
        fontSize: 12,
        right: 10
    }
})


