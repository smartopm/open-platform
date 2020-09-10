/* eslint-disable */
import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Button, TextField, Snackbar } from '@material-ui/core'
import { useMutation } from 'react-apollo'
import { DiscussionMutation } from '../../graphql/mutations'

export default function Discuss({ update }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [msg, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [createDiscuss] = useMutation(DiscussionMutation)

    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        createDiscuss({ variables: { title, description } })
            .then(() => {
                setMessage('Discussion created')
                setLoading(false)
                setTimeout(() => {
                    update()
                }, 1000)
                setOpen(!open)
            }
            )
            .catch(err => {
                setLoading(false)
                setMessage(err.message)
            })
    }

    return (
        <div className="container">
            <Snackbar
                color={"success"}
                open={open} autoHideDuration={6000}
                onClose={() => setOpen(!open)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                message="Discussion topic successfully created"
            />
            <form
                onSubmit={handleSubmit}
                aria-label="discuss-form"
            >
                    <TextField
                        name="title"
                        label="Discussion Title"
                        style={{ width: '63vw' }}
                        placeholder="Type a comment here"
                        onChange={e => setTitle(e.target.value)}
                        value={title}
                        margin="normal"
                        inputProps={{
                            "aria-label":"discuss_title"
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                        required
                    />
                    <TextField
                        name="description"
                        label="Discussion Description"
                        style={{ width: '63vw'}}
                        placeholder="Type a comment here"
                        onChange={e => setDescription(e.target.value)}
                        value={description}
                        multiline
                        rows={3}
                        margin="normal"
                        inputProps={{
                            "aria-label": "discuss_description"
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                        required
                    />
                <br />
                <div className="d-flex row justify-content-center">
                    <Button
                        variant="contained"
                        aria-label="discussion_cancel"
                        color="secondary"
                        onClick={update}
                        className={`btn ${css(discussStyles.cancelBtn)}`}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        disabled={loading}
                        aria-label="discussion_submit"
                        className={`btn ${css(discussStyles.submitBtn)}`}
                    >
                        {loading ? 'Submitting ...' : 'Submit'}
                    </Button>
                </div>
                <br />
                <p className="text-center">
                    {Boolean(msg.length) && msg}
                </p>
            </form>
            br
        </div>
    )
}
export const discussStyles = StyleSheet.create({
    submitBtn: {
        width: '30%',
        height: 51,
        boxShadow: 'none',
        marginTop: 50,
        alignItems: 'center',
        ':hover': {
            color: '#FFFFFF'
        }
    },
    cancelBtn: {
        width: '30%',
        marginRight: '20vw',
        height: 51,
        marginTop: 50,
        alignItems: 'center',
        ':hover': {
            color: '#FFFFFF'
        }
    }
})
