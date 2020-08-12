import React, { Fragment, useState } from 'react'
import Nav from '../components/Nav'
import { useQuery, useMutation } from 'react-apollo'
import NotificationPage from '../components/NotificationPage'
import { LabelsQuery } from '../graphql/queries'
import { NotificationPreference } from '../graphql/mutations'

export default function Notifications() {
    let labelId = []
    const [checkedState, setCheckedState] = useState({
        com_news_sms: false,
        com_news_email: false
    })
    const [preferences, setPreference] = useState([])
    const [notificationPreference] = useMutation(NotificationPreference)
    const { data } = useQuery(LabelsQuery)

    function handleChange(e) {

        setCheckedState({ ...checkedState, [e.target.name]: e.target.checked })
        if (data && !checkedState.com_news_email) {
            labelId = [...new Set(data.labels.filter(label => label.shortDesc === e.target.name).map(lab => lab.id))]
            setPreference([...preferences,labelId.toString()])
        }
        else {
            labelId = [...new Set(labelId.filter(label => label.shortDesc !== e.target.name).map(lab => lab.id))]
            setPreference([...preferences,labelId.toString()])
        }
        console.log(preferences,labelId)
    }

    function handleSmsChange(e) {
        setCheckedState({ ...checkedState, [e.target.name]: e.target.checked })
        if (data && !checkedState.com_news_sms) {
            labelId = [...new Set(data.labels.filter(label => label.shortDesc === e.target.name).map(lab => lab.id))]
            setPreference([...preferences,labelId.toString()])
        }
        else {
            labelId = [...new Set(labelId.filter(label => label.shortDesc !== e.target.name).map(lab => lab.id))]
            setPreference([...preferences,labelId.toString()])
        }

        console.log(labelId)

    }

    function handleSave() {


        notificationPreference({
            variables: { preferences: preferences.toString() }

        }).then(() => {

        })


    }


    return (
        <div>
            <Fragment>
                <Nav navName="Notifications" menuButton="back" backTo="/" />
                <NotificationPage
                    handleChange={handleChange}
                    handleSmsChange={handleSmsChange}
                    checkedState={checkedState}
                    handleSave={handleSave} />
            </Fragment>
        </div>
    )
}
