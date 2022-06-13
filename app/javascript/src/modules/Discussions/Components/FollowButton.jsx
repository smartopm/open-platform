/* eslint-disable */
import React, { useState, useEffect } from 'react'
import {
  Chip
} from '@mui/material'
import { discussionUserQuery } from '../../../graphql/queries'
import { useQuery, useMutation } from 'react-apollo'
import { DiscussionSubscription } from '../../../graphql/mutations'
import FollowDialogueBox from './FollowDialogueBox'
import { validateEmail } from "../../../utils/helpers"

export default function FollowButton({ discussionId, authState }) {
  const id = discussionId
  const [open, setOpen] = useState(false)
  const [emailError, setEmailError] = useState(false)
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
 

  const emailBody = `Hi, my name is ${authState.user?.name}. Please update my email address. My correct email is: ${textValue}`

  const handleSendEmail = () => {
    const validate = validateEmail(textValue)
    if (validate) {
      setEmailError(false)
      window.open(`mailto:support@doublegdp.com?subject=Update Email&body=${emailBody}`);
      setUpdateEmail(false)
    } else {
      setEmailError(true)
    }
    
  }

  const textFieldOnChange = event => {
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
        error={emailError}
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
