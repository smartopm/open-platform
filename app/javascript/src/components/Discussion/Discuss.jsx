import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Button, TextField } from '@material-ui/core'
import { useMutation } from 'react-apollo'
import { DiscussionMutation } from '../../graphql/mutations'

export default function Discuss({ update }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [msg, setMessage] = useState('')
    const [createDiscuss] = useMutation(DiscussionMutation)

    function handleSubmit(e) {
        e.preventDefault()
        createDiscuss({ variables: { title, description } })
            .then(() => {
                setMessage('Discussion created')
                update()
            }
            )
            .catch(err => {
                setMessage(err.message)
            })
    }

    return (
        <div className="container">
            <form
                onSubmit={handleSubmit}
                aria-label="discuss-form"
            >
                <div className="form-group">
                    <TextField
                        name="title"
                        label="Discussion Title"
                        style={{ width: '80vw' }}
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
                </div>
                <div className="form-group">
                    <TextField
                        name="description"
                        label="Discussion Description"
                        style={{ width: '80vw'}}
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
                </div>
                <br />
                <div className="d-flex row justify-content-center">
                    <Button
                        variant="contained"
                        aria-label="discussion_cancel"
                        color="secondary"
                        onClick={update}
                        className={`btn ${css(styles.cancelBtn)}`}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        aria-label="discussion_submit"
                        className={`btn ${css(styles.submitBtn)}`}
                    >
                        Submit
                    </Button>
                </div>
                <br />
                <p className="text-center">
                    {Boolean(msg.length) && msg}
                </p>
            </form>
        </div>
    )
}
const styles = StyleSheet.create({
    submitBtn: {
        backgroundColor: '#25c0b0',
        color: '#FFF',
        width: '30%',
        height: 51,
        boxShadow: 'none',
        marginTop: 50,
        alignItems: 'center'
    },
    cancelBtn: {
        width: '30%',
        marginRight: '20%',
        height: 51,
        marginTop: 50,
        alignItems: 'center'
    }
})
