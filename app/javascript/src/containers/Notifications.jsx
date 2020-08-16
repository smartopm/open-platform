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
    const [savePreferredNotification] = useMutation(NotificationPreference)

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

    function handleChange(e) {
        setCheckedState({ ...checkedState, [e.target.name]: e.target.checked })
    }

    function handleSave() {
      setLoading(true)
      // fill an array with keys that are only checked
        const preferences = [
            checkedState.smsChecked ? 'com_news_sms' : null,
            checkedState.emailChecked ? 'com_news_email' : null
        ]

      savePreferredNotification({
        variables: { preferences: preferences.filter(Boolean).join() }
      }).then(() => {
        setLoading(false)
      }).catch(err => console.log(err.message))
    }
    return (
        <div>
            <Fragment>
                <Nav navName="Notifications" menuButton="back" backTo="/" />
                 <NotificationPage
                    handleChange={handleChange}
                    checkedState={checkedState}
                    loading={loading}
                    handleSave={handleSave} /> 
            </Fragment>
        </div>
    )
}
