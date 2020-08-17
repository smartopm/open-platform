import React, { Fragment, useState } from 'react'
import Nav from '../components/Nav'
import { useMutation } from 'react-apollo'
import NotificationPage from '../components/NotificationPage'
import { NotificationPreference } from '../graphql/mutations'

export default function Notifications() {

    const [checkedState, setCheckedState] = useState({
        com_news_sms: false,
        com_news_email: false
    })
    
    const [loading, setLoading] = useState(false)
    const [preferences, setPreference] = useState([])
    const [notificationPreference] = useMutation(NotificationPreference)

    function handleChange(e) {

        setCheckedState({ ...checkedState, [e.target.name]: e.target.checked })
        !checkedState.com_news_email ? setPreference([...preferences,e.target.name]) : null
    }

    function handleSmsChange(e) {
        setCheckedState({ ...checkedState, [e.target.name]: e.target.checked })
        !checkedState.com_news_sms ? setPreference([...preferences,e.target.name]) : null

    }

    function handleSave() {
        setLoading(true)
        notificationPreference({
            variables: { preferences: preferences.toString() }

        }).then(() => {
            setLoading(false)
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
                    loading={loading}
                    handleSave={handleSave} />
            </Fragment>
        </div>
    )
}
