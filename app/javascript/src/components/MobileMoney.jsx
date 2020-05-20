import React, { Fragment } from 'react';
import Nav from './Nav'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles({
    text1: {
        width: '100%',
        margin: 'auto',
        textAlign: 'center',
        marginTop: '80px',
    },
    text2: {
        width: '100%',
        margin: 'auto',
        textAlign: 'center',
        marginTop: '10px',
    },
    text3: {
        width: '35%',
        margin: 'auto',
        textAlign: 'left',
        marginTop: '10px',
    },

})
export default function MobileMoney() {
    const classes = useStyles()

    return (
        <Fragment>

            <Nav navName="Mobile Money" menuButton="back" backTo="/contact" />
            <Typography paragraph variant="body1" color="textSecondary" className={classes.text1}>
                Nkwashi accepts mobile money!
            </Typography>
            <Typography paragraph variant="body1" color="textSecondary" className={classes.text2}>
                Nkwashi uses MTN&apos;s mobile money. Follow these instructions to make your payment:
            </Typography>

            <ol className={classes.text3}>
                <li>
                    Dial *303# and select &apos;Send Money&apos;
                </li>

                <li>
                    Select Send Money to &apos;Mobile User&apos; and follow the prompts
                </li>

                <li>
                    Enter Nkwashi&apos;s number &apos;0961722433&apos; and send the money through MTN
                </li>

                <li>
                    You and Nkwashi will receive a transaction message when the transaction is successfully completed
                </li>

                <li>
                    Copy the transaction message and text it directly to Nkwashi (0961722433) with your full name and NRC number
                </li>
            </ol>

        </Fragment>
    );
}