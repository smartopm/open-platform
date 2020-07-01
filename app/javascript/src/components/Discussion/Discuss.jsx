import React from 'react'
import { Button } from '@material-ui/core'

export default function Discuss({ submit }) {
    return (
                    <Button
                        variant="contained"
                        type="submit"
                        aria-label="campaign_submit"
                    >
                        <span>Create Discussion</span>
                    </Button>
    )
}