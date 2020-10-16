/* eslint-disable */
import React, { Fragment, useState, useContext, useEffect } from 'react'
import Nav from '../../components/Nav'
import { useMutation, useQuery } from 'react-apollo'
import NotificationPage from '../../components/NotificationPage'
import { NotificationPreference } from '../../graphql/mutations'
import { UserLabelsQuery } from '../../graphql/queries'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import Loading from '../../components/Loading'
import { Snackbar } from '@material-ui/core'

export default function Notifications() {
    const authState = useContext(AuthStateContext)
    const [checkedState, setCheckedState] = useState({
        smsChecked: false,
        emailChecked: false,
        weeklyEmailReminderChecked: false
    })

    const { data, loading: labelsLoading, error } = useQuery(UserLabelsQuery, {
        variables: { userId: authState.user.id }
    })
    const [loading, setLoading] = useState(false)
    const [snackBarOpen, setOpenSnackBar] = useState(false)
    const [message, setMessage] = useState('Your changes have been saved successfully')
    const [savePreferredNotification] = useMutation(NotificationPreference)

    useEffect(() => {
        if (!labelsLoading && !error && data) {
            const smsChecked = data.userLabels.some(lab => lab.shortDesc === 'com_news_sms')
            const emailChecked = data.userLabels.some(lab => lab.shortDesc === 'com_news_email')
            const weeklyEmailReminderChecked = data.userLabels.some(lab => lab.shortDesc === 'weekly_point_reminder_email')

            setCheckedState({
                smsChecked,
                emailChecked,
                weeklyEmailReminderChecked
            })
        }
    }, [labelsLoading, data, error])

    function handleChange(e) {
        setCheckedState({ ...checkedState, [e.target.name]: e.target.checked })
    }

    function handleSave() {
      setLoading(true)
      // fill an array with keys that are only checked
      const preferences = [
        checkedState.smsChecked ? 'com_news_sms' : null,
        checkedState.emailChecked ? 'com_news_email' : null,
        checkedState.weeklyEmailReminderChecked ? 'weekly_point_reminder_email' : null
      ]

      savePreferredNotification({
        variables: { preferences: preferences.filter(Boolean).join() }
      })
        .then(() => {
          setLoading(false)
          setOpenSnackBar(!snackBarOpen)
        })
        .catch(err => {
          setMessage(err.message)
          setOpenSnackBar(!snackBarOpen)
        })
    }
    if(labelsLoading) return <Loading />
    return (
        <div>
            <Fragment>
                <Nav navName="Preferences" menuButton="back" backTo="/" />
                <Snackbar
                    open={snackBarOpen} autoHideDuration={3000}
                    onClose={() => setOpenSnackBar(!snackBarOpen)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    message={message}
                />
                 <NotificationPage
                    handleChange={handleChange}
                    checkedState={checkedState}
                    loading={loading}
                    handleSave={handleSave} />
            </Fragment>
        </div>
    )
}
