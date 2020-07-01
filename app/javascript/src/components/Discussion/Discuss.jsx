import React, { useState } from 'react'
import { TextField, Button } from '@material-ui/core'

export default function Discuss({ submit }) {
    // title, description
    const initialData = { title: '', description: '' }
    const [data, setData] = useState(initialData)

    function handleSubmit() {
        submit(data)
    }
    return (
        <div className="container">
            <form
                onSubmit={handleSubmit}
                aria-label="campaign-form"
            >
                <TextField
                    label="Discussion Title"
                    required
                    value={data.title}
                    aria-label="discussion_title"
                    inputProps={{ "data-testid": "discussion_title" }}
                    onChange={e => setData({ ...data, title: e.target.value })}
                />
                
                <TextField
                    label="Discussion Title"
                    rows={5}
                    multiline
                    required
                    value={data.description}
                    aria-label="discussion_description"
                    inputProps={{ "data-testid": "discussion_description" }}
                    onChange={e => setData({ ...data, description: e.target.value})}
                />
                <div className="d-flex row justify-content-center">
                    <Button
                        variant="contained"
                        type="submit"
                        aria-label="campaign_submit"
                    >
                        <span>Create Discussion</span>
                    </Button>
                </div>
                <br />
            </form>
        </div>
    )
}