import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import { StyleSheet, css } from 'aphrodite'
import { withStyles } from "@material-ui/core/styles";
import CheckIcon from '@material-ui/icons/Check';
import IconButton from "@material-ui/core/IconButton";
import { Redirect } from "react-router-dom";

const styles = theme => ({
    checkedIcon: {
        margin: theme.spacing(1),
        border: 'green solid',
        borderRadius: 90,
        borderWidth: 'thick',
        padding: 25,
        color: 'green'
    },
    largeIcon: {
        fontSize: "3em"
    },
});
export function FeedbackSuccess(props) {
    const { classes } = props;

    const [time, setTime] = useState(10);

    useEffect(() => {
        if (!time) return;

        const intervalId = setInterval(() => {
            setTime(time - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [time]);

    if (time === 0) {
        return <Redirect to="/" />;
    }
    return (
        <div>
            <Nav navName='Feedback' menuButton='back' />
            <div className={`container ${css(style.feedbackPage)}`}>
                <p className='text-center'>Thank you for your feedback</p>
                <div className="row justify-content-around">
                    <div className="">
                        <IconButton className={classes.checkedIcon} aria-label="Check Icon">
                            <CheckIcon className={classes.largeIcon} />
                        </IconButton>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default withStyles(styles)(FeedbackSuccess);

const style = StyleSheet.create({
    feedbackPage: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -30%)'
    },
})
