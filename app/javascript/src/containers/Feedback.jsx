import React, { useState } from 'react'
import Nav from '../components/Nav'
import { StyleSheet, css } from 'aphrodite'
import { withStyles } from "@material-ui/core/styles";
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import IconButton from "@material-ui/core/IconButton";

const styles = theme => ({
    thumbDownButton: {
        margin: theme.spacing(1),
        border: 'red solid',
        borderRadius: 90,
        borderWidth: 'thick',
        padding: 25
    },
    thumbUpButton: {
        margin: theme.spacing(1),
        border: 'green solid',
        borderRadius: 90,
        borderWidth: 'thick',
        padding: 25
    },
    largeIcon: {
        fontSize: "3em"
    },
});
export function Feedback(props) {
    const { classes, history } = props;
    const [isTextAreaOpen, setTextAreaOpen] = useState(false)
    const [feedback, setFeedback] = useState('')


    function handleThumbDown() {
        setTextAreaOpen(!isTextAreaOpen)
    }

    function handleThumbUp() {
        history.push('/feedback_success')
    }

    function handleSubmitFeedback() {
        // capture feedback and re-route user
        console.log(feedback)
        history.push('/feedback_success')
    }

    return (
        <div>
            <Nav navName='Feedback' menuButton='back' />
            <div className={`container ${css(style.feedbackPage)}`}>
                <div className="row justify-content-around">
                    <div className="col-4">
                        <IconButton onClick={handleThumbDown} className={classes.thumbDownButton} aria-label="Thumb Down">
                            <ThumbDownIcon className={classes.largeIcon} />
                        </IconButton>
                    </div>
                    <div className="col-4">
                        <IconButton onClick={handleThumbUp} className={classes.thumbUpButton} aria-label="Thumb Up">
                            <ThumbUpIcon className={classes.largeIcon} />
                        </IconButton>
                    </div>
                </div>
                <br />
                <br />
                {
                    isTextAreaOpen && (
                        <form>
                            <div className="form-group">
                                <label htmlFor="feedback">We value your feedback, What can we do to improve</label>
                                <br />
                                <textarea
                                    className="form-control"
                                    placeholder="Your feedback"
                                    id="feedback"
                                    rows="4"
                                    name="feedback"
                                    value={feedback}
                                    onChange={event => setFeedback(event.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                style={{ float: 'right' }}
                                className="btn btn-outline-primary "
                                onClick={handleSubmitFeedback}
                            >
                                Submit
                            </button>
                        </form>
                    )
                }
            </div>
        </div>
    )
}
export default withStyles(styles)(Feedback);

const style = StyleSheet.create({
    feedbackPage: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -30%)'
    },
})
