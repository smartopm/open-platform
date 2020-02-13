import React, { useState, useContext } from 'react'
import Nav from '../components/Nav'
import { StyleSheet, css } from 'aphrodite'
import { withStyles } from '@material-ui/core/styles'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import IconButton from '@material-ui/core/IconButton'
import { useMutation } from 'react-apollo'
import { createFeedback } from '../graphql/mutations'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'

const styles = (theme) => ({
    thumbDownButton: {
        margin: theme.spacing(1),
        border: 'red solid',
        borderRadius: 90,
        borderWidth: 'thick',
        padding: 25,
    },
    thumbUpButton: {
        margin: theme.spacing(1),
        border: 'green solid',
        borderRadius: 90,
        borderWidth: 'thick',
        padding: 25,
    },
    largeIcon: {
        fontSize: '3em',
    },
})
export function Feedback(props) {
    const { classes, history } = props
    const [isTextAreaOpen, setTextAreaOpen] = useState(false)
    const [feedback, setFeedback] = useState('')
    const authState = useContext(AuthStateContext)
    const [feedbackCreate] = useMutation(createFeedback)



    function handleThumbDown() {
        setTextAreaOpen(!isTextAreaOpen)
    }

    function handleThumbUp() {
        feedbackCreate({ variables: { isThumbsUp: true } })
            .then(() => {
                history.push('/feedback_success')
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    function handleSubmitFeedback() {
        feedbackCreate({ variables: { isThumbsUp: false } })
            .then(() => {
                history.push('/feedback_success')
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    return (
        <div>
            <Nav navName='Feedback' menuButton='back' />
            <div className={`container ${css(style.feedbackPage)}`}>
                <div className='row justify-content-around'>
                    <div className='col-4'>
                        <IconButton
                            onClick={handleThumbDown}
                            className={classes.thumbDownButton}
                            aria-label='Thumb Down'
                        >
                            <ThumbDownIcon className={classes.largeIcon} />
                        </IconButton>
                    </div>
                    <div className='col-4'>
                        <IconButton
                            onClick={handleThumbUp}
                            className={classes.thumbUpButton}
                            aria-label='Thumb Up'
                        >
                            <ThumbUpIcon className={classes.largeIcon} />
                        </IconButton>
                    </div>
                </div>
                <br />
                <br />
                {isTextAreaOpen && (
                    <form>
                        <div className='form-group'>
                            <label htmlFor='feedback'>
                                We value your feedback. Do you have a suggestion on how we can
                                improve?
              </label>
                            <br />
                            <textarea
                                className='form-control'
                                id='feedback'
                                rows='4'
                                name='feedback'
                                value={feedback}
                                autoFocus
                                onChange={(event) => setFeedback(event.target.value)}
                            />
                        </div>
                        <button
                            type='button'
                            style={{ float: 'left' }}
                            className='btn btn-outline-primary '
                            onClick={() => history.push('/feedback_success')}
                        >
                            Skip
                        </button>
                        <button
                            type='button'
                            style={{ float: 'right' }}
                            className='btn btn-outline-success '
                            onClick={handleSubmitFeedback}
                        >
                            Submit
                    </button>
                    </form>
                )}
            </div>
        </div>
    )
}
export default withStyles(styles)(Feedback)

const style = StyleSheet.create({
    feedbackPage: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -30%)',
    },
})
