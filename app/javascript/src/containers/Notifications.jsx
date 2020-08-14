import React, { Fragment, useState, useContext } from 'react'
import Nav from '../components/Nav'
import { useMutation, useQuery } from 'react-apollo'
import NotificationPage from '../components/NotificationPage'
import { NotificationPreference } from '../graphql/mutations'
import { UserLabelsQuery } from '../graphql/queries'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'

export default function Notifications() {
    const authState = useContext(AuthStateContext)
    const [checkedState, setCheckedState] = useState({
        com_news_sms: false,
        com_news_email: false
    })

    const { data, error } = useQuery(UserLabelsQuery, {
        variables: { userId: authState.user.id }
    })

    const [loading, setLoading] = useState(false)
    const [preferences, setPreference] = useState([])
    const [notificationPreference] = useMutation(NotificationPreference)

    if (data) {

        let str = data.userLabels.map(label => label.shortDesc === "com_news_sms")
        console.log(str)

    }


    function handleChange(e) {

        setCheckedState({ ...checkedState, [e.target.name]: e.target.checked })
        !checkedState.com_news_email ? setPreference([...preferences, e.target.name]) : setPreference(preferences.filter(label => label !== e.target.name))
    }

    function handleSmsChange(e) {
        setCheckedState({ ...checkedState, [e.target.name]: e.target.checked })
        !checkedState.com_news_sms ? setPreference([...preferences, e.target.name]) : setPreference(preferences.filter(label => label !== e.target.name))
    }

    function handleSave() {

        setLoading(true)
        notificationPreference({
            variables: { preferences: preferences.join() }

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
