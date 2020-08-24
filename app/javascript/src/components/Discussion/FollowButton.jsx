import React, { useState, useEffect } from 'react'
import {
  Chip
} from '@material-ui/core'
import { discussionUserQuery } from '../../graphql/queries'
import { useQuery, useMutation } from 'react-apollo'
import { DiscussionSubscription } from '../../graphql/mutations'
import FollowDialogueBox from './FollowDialogueBox'

export default function FollowButtion({ discussionId, authState }) {
  const { user: { name } } = authState
  const id = discussionId
  const [open, setOpen] = useState(false)
  const [updateEmail, setUpdateEmail] = useState(false)
  const [textValue, setTextValue] = useState('')
  const [subscribe, setSubscribe] = useState(null)
  const [follow] = useMutation(DiscussionSubscription)
  const { loading: isLoadings, data: followData } = useQuery(
    discussionUserQuery,
    {
      variables: { disucssionId: discussionId }
    }
  )

  useEffect(() => {
    if (!isLoadings && followData) {
      if (followData.discussionUser !== null) {
        setSubscribe(true)
      }
    }
  }, [isLoadings, followData])

  const handleClick = () => {
    setOpen(!open)
  }

  const handleEmailUpdate = () => {
    setUpdateEmail(!updateEmail)
 }
 

  const emailBody = `Hi, my name is ${name}. Please update my email address. My correct email is: ${textValue}`

  const handleSendEmail = () => {
    window.open(`mailto:support@doublegdp.com?subject=Update Email&body=${emailBody}`);
    setUpdateEmail(false)
  }

  const textFieldOnChange = event => {
    event.preventDefault()
    setTextValue(event.target.value)
  }

  const handleFollow = () => {
    setOpen(false)
    follow({ variables: { discussionId: id } }).then(() => {
      if (subscribe) {
        setSubscribe(false)
      } else {
        setSubscribe(true)
      }
    })
  }


  return (
    <>
      {subscribe ? (
        <Chip
          label="unfollow"
          clickable
          onClick={handleClick}
          color="secondary"
        />
      ) : (
          <Chip
            label="follow"
            clickable
            onClick={handleClick}
            color="primary"
          />
        )}
      <FollowDialogueBox 
        authState={authState}
        open={open}
        handleClose={handleClick}
        subscribe={subscribe}
        handleFollow={handleFollow}
        textFieldOnChange={textFieldOnChange}
        handleSendEmail={handleSendEmail}
        handleEmailUpdate={handleEmailUpdate}
        updateEmail={updateEmail}
      />
    </>
  )
}
