/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { StyleSheet, css } from 'aphrodite';
import withStyles from '@mui/styles/withStyles';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import IconButton from '@mui/material/IconButton';
import { useMutation } from 'react-apollo';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { createFeedback } from '../graphql/mutations';
import { ifNotTest } from '../../../utils/helpers';

const redLike = 'rgb(299, 63, 69)';
const greenLike = 'rgb(37, 192, 176)';

const styles = theme => ({
  thumbDownButton: {
    margin: theme.spacing(1),
    border: `${redLike} solid`,
    borderRadius: 90,
    borderWidth: 'thick',
    padding: 25,
    color: redLike
  },
  thumbUpButton: {
    margin: theme.spacing(1),
    border: `${greenLike} solid`,
    borderRadius: 90,
    borderWidth: 'thick',
    padding: 25,
    color: greenLike
  },
  largeIcon: {
    fontSize: '3em'
  }
});

// TODO: handle errors from this page
export function Feedback(props) {
  const { classes, history } = props;
  const [isTextAreaOpen, setTextAreaOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackCreate] = useMutation(createFeedback);
  const { t } = useTranslation(['feedback', 'common']);
  function handleThumbDown() {
    setTextAreaOpen(!isTextAreaOpen);
  }

  function handleThumbUp() {
    setIsSubmitting(true);
    feedbackCreate({ variables: { isThumbsUp: true } })
      .then(() => {
        history.push('/feedback_success');
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  function handleSubmitFeedback() {
    feedbackCreate({ variables: { isThumbsUp: false, review: feedback } })
      .then(() => {
        history.push('/feedback_success');
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  function handleSkipReview() {
    feedbackCreate({ variables: { isThumbsUp: false } })
      .then(() => {
        history.push('/feedback_success');
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  return (
    <div>
      <div className={`container ${css(style.feedbackPage)}`}>
        <div className="row justify-content-around">
          <div className="col-4">
            <IconButton
              onClick={handleThumbDown}
              className={classes.thumbDownButton}
              aria-label="Thumb Down"
              data-testid="thumbdown-icon"
              size="large"
            >
              <ThumbDownIcon className={classes.largeIcon} />
            </IconButton>
          </div>
          <div className="col-4">
            <IconButton
              onClick={handleThumbUp}
              className={classes.thumbUpButton}
              aria-label="Thumb Up"
              data-testid="thumbup-icon"
              size="large"
            >
              {isSubmitting ? (
                <CircularProgress size={70} />
              ) : (
                <ThumbUpIcon className={classes.largeIcon} />
              )}
            </IconButton>
          </div>
        </div>
        <br />
        <br />
        {isTextAreaOpen && (
          <form data-testid="feedback-form">
            <div className="form-group">
              <label htmlFor="feedback">
                {t('feedback.value_your_feedback')}
              </label>
              <br />
              <TextField
                className="form-control"
                id="feedback"
                multiline
                name="feedback"
                value={feedback}
                autoFocus={ifNotTest()}
                onChange={event => setFeedback(event.target.value)}
              />
            </div>
            <Button
              variant="outlined"
              style={{ float: 'left' }}
              onClick={handleSkipReview}
              color="secondary"
            >
              {t('actions.skip')}
            </Button>
            <Button
              variant="outlined"
              style={{ float: 'right' }}
              onClick={handleSubmitFeedback}
              color="primary"
            >
              {t('common:form_actions.submit')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
export default withStyles(styles)(Feedback);

const style = StyleSheet.create({
  feedbackPage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -30%)'
  }
});
