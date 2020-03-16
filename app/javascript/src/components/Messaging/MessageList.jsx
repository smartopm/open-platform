import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import UserMessageItem from './UserMessageItem';

export default function MessageList() {
    return (
        <List>
            {
                messages.map(message => (
                    <React.Fragment key={message.id}>
                        <UserMessageItem
                            name={"receiver"}
                            // imageUrl={}
                            message={message.smsContent}
                            senderName={message.user.name}
                        />
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))
            }
        </List>
    )
}

const messages = [
    {
        "receiver": "260971500748",
        "smsContent": "Hello You, hope you are well",
        "userId": "aaff3c8c-4ed2-4d74-8d36-7fa9e63692fc",
        "id": "14f706a7-8dd9-42da-b92c-307d603af515",
        "createdAt": "2020-03-16T09:50:20Z",
        "user": {
            "id": "aaff3c8c-4ed2-4d74-8d36-7fa9e63692fc",
            "name": "Olivier JM Maniraho"
        }
    },
    {
        "receiver": "260971500748",
        "smsContent": "Hello You, hope you are well",
        "userId": "aaff3c8c-4ed2-4d74-8d36-7fa9e63692fc",
        "id": "94a5fc3d-2d24-441e-a7e1-24ad013698ea",
        "createdAt": "2020-03-16T09:43:25Z",
        "user": {
            "id": "aaff3c8c-4ed2-4d74-8d36-7fa9e63692fc",
            "name": "Olivier JM Maniraho"
        }
    },
    {
        "receiver": "260971500748",
        "smsContent": "Hello You, hope you are well",
        "userId": "aaff3c8c-4ed2-4d74-8d36-7fa9e63692fc",
        "id": "8be3f2b5-a84f-44d8-9ee3-9d6f140b3986",
        "createdAt": "2020-03-13T13:45:31Z",
        "user": {
            "id": "aaff3c8c-4ed2-4d74-8d36-7fa9e63692fc",
            "name": "Olivier JM Maniraho"
        }
    },
    {
        "receiver": "260971500748",
        "smsContent": "Hello Olivier, hope you are well",
        "userId": "aaff3c8c-4ed2-4d74-8d36-7fa9e63692fc",
        "id": "194332ff-c179-4a74-ad25-c34cfa43ebf1",
        "createdAt": "2020-03-13T13:42:38Z",
        "user": {
            "id": "aaff3c8c-4ed2-4d74-8d36-7fa9e63692fc",
            "name": "Olivier JM Maniraho"
        }
    },
    {
        "receiver": "260971500748",
        "smsContent": "Hello Olivier, hope you are well",
        "userId": "aaff3c8c-4ed2-4d74-8d36-7fa9e63692fc",
        "id": "aa27d12b-f6a4-47d0-b223-cd1400e73f23",
        "createdAt": "2020-03-13T13:31:39Z",
        "user": {
            "id": "aaff3c8c-4ed2-4d74-8d36-7fa9e63692fc",
            "name": "Olivier JM Maniraho"
        }
    }
]