import React, {useState} from 'react'
import UserSearch from './UserSearch'

// find a user a call the mutation to merge them
const initialData = {
    user: '',
    userId: ''
}
export default function UserMerge() {
    const [data, setData] = useState(initialData)
    console.log(data)
    return (
        <>
            <UserSearch userData={data} update={setData} />
        </>
    )
}

