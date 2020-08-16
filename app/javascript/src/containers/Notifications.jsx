import React, { Fragment, useState, useContext, useEffect } from 'react'
import Nav from '../components/Nav'
import { useMutation, useQuery } from 'react-apollo'
import NotificationPage from '../components/NotificationPage'
import { NotificationPreference } from '../graphql/mutations'
import { UserLabelsQuery } from '../graphql/queries'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import Loading from '../components/Loading'

export default function Notifications() {
    const authState = useContext(AuthStateContext)
    const [checkedState, setCheckedState] = useState({
        smsChecked: false,
        emailChecked: false
    })


    const { data, loading: labelsLoading } = useQuery(UserLabelsQuery, {
        variables: { userId: authState.user.id }
    })
    const [loading, setLoading] = useState(false)
    const [preferences, setPreference] = useState([])
    const [notificationPreference] = useMutation(NotificationPreference)

    useEffect(() => {
        if (!labelsLoading && data) {
            const smsChecked = data.userLabels.some(lab => lab.shortDesc === 'com_news_sms')
            const emailChecked = data.userLabels.some(lab => lab.shortDesc === 'com_news_email')
            setCheckedState({
                smsChecked,
                emailChecked
            })
        }
    }, [labelsLoading, data])

    if(labelsLoading) return <Loading />
    // if (data) {
    //     labelArray = data.userLabels.map(label => label.shortDesc)
    //     labelArray.includes("com_news_email") ? email = true : null
    // }

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

    console.log(checkedState)
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
