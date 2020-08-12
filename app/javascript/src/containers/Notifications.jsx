import React, { Fragment, useState } from 'react'
import Nav from '../components/Nav'
import { useQuery, useMutation } from 'react-apollo'
import NotificationPage from '../components/NotificationPage'
import { LabelsQuery } from '../graphql/queries'
import { NotificationPreference } from '../graphql/mutations'

export default function Notifications() {
    let labelId
    const [checkedState, setCheckedState] = useState({
        com_news_sms: false,
        com_news_email: false
    })
    const [preferences, setPreferences] = useState([])
    const [notificationPreference] = useMutation(NotificationPreference)
    const { data } = useQuery(LabelsQuery)
    if (data) {
        const labels = data.labels.filter(function (user) {
            return user.shortDesc === "com_news_email"
        })
    }

    function handleChange(e) {
        setCheckedState({ ...checkedState, [e.target.name]: e.target.checked })
        //filter new array and get id for selected element
        if (data) {
            labelId = data.labels.filter(user => user.shortDesc === e.target.name)
            setPreferences([...preferences,labelId.map(label=>label.id).toString()]) 
        }
        console.log(preferences)
    }

    function handleSave() {

        notificationPreference({
            variables: { preferences: preferences }

        }).then(() => {

        })


    }


    return (
        <div>
            <Fragment>
                <Nav navName="Notifications" menuButton="back" backTo="/" />
                <NotificationPage
                    handleChange={handleChange}
                    checkedState={checkedState}
                    handleSave={handleSave} />
            </Fragment>
        </div>
    )
}
