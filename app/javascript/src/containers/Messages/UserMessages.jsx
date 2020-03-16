import React from 'react';
import { useParams } from "react-router-dom";


export default function UserMessages() {
    const { id } = useParams()
    return (
        <p>
            This will contain messages for this user {id}
        </p>
    )
}

