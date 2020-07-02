import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Button } from '@material-ui/core'
import { useMutation } from 'react-apollo'
import { DiscussionMutation } from '../../graphql/mutations'

export default function Discuss() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [msg, setMessage] = useState('')

    const [createDiscuss] = useMutation(DiscussionMutation)

    function handleSubmit(e) {
        e.preventDefault()
        createDiscuss({ variables: { title, description } })
            .then(() =>
                setMessage('Discussion created')
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
                    <label className="bmd-label-static" htmlFor="title">
                        Discussion Title
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        onChange={e => setTitle(e.target.value)}
                        value={title}
                        name="title"
                        aria-label="discuss_title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="bmd-label-static" htmlFor="description">
                        Description
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        onChange={e => setDescription(e.target.value)}
                        value={description}
                        name="description"
                        aria-label="discuss_description"
                        required
                    />
                </div>
                <br />
                <div className="d-flex row justify-content-center">
                    <Button
                        variant="contained"
                        type="submit"
                        aria-label="discussion_submit"
                        className={`btn ${css(styles.getStartedButton)}`}
                    >
                        <span>Submit</span>
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
    getStartedButton: {
        backgroundColor: '#25c0b0',
        color: '#FFF',
        width: '30%',
        height: 51,
        boxShadow: 'none',
        marginTop: 50,
        alignItems: 'center'
    }
})
