/* eslint-disable react/prop-types */
import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import withStyles from '@mui/styles/withStyles';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from "@mui/material/IconButton";
import { Redirect } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import useTimer from '../../../utils/customHooks';

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
    const time = useTimer(10, 1000);
    const { t } = useTranslation('feedback');

    if (time === 0) {
        return <Redirect to="/" />;
    }
    return (
      <div className={`container ${css(style.feedbackPage)}`}>
        <p className='text-center' data-testid='feedback-txt'>{t('feedback.thankyou_for_feedback')}</p>
        <div className="row justify-content-around">
          <div className="">
            <IconButton className={classes.checkedIcon} aria-label="Check Icon" size="large">
              <CheckIcon className={classes.largeIcon} />
            </IconButton>
          </div>
        </div>

      </div>
    );
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
