/* eslint-disable react/prop-types */
import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { withStyles } from "@material-ui/core/styles";
import CheckIcon from '@material-ui/icons/Check';
import IconButton from "@material-ui/core/IconButton";
import { Redirect } from "react-router-dom";
import useTimer from '../../utils/customHooks'

const styles = theme => ({
    checkedIcon: {
        margin: theme.spacing(1),
        border: 'rgb(37, 192, 176) solid',
        borderRadius: 90,
        borderWidth: 'thick',
        padding: 25,
        color: 'rgb(37, 192, 176)'
    },
    largeIcon: {
        fontSize: "3em"
    },
});

export function FeedbackSuccess(props) {
    const { classes } = props;
    const time = useTimer(10, 1000)

    if (time === 0) {
        return <Redirect to="/" />;
    }
    return (
      <div className={`container ${css(style.feedbackPage)}`}>
        <p className='text-center' data-testid='feedback-txt'>Thank you for your feedback</p>
        <div className="row justify-content-around">
          <div className="">
            <IconButton className={classes.checkedIcon} aria-label="Check Icon">
              <CheckIcon className={classes.largeIcon} />
            </IconButton>
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
