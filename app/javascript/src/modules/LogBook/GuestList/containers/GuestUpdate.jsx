import React from 'react'
import {  useParams } from 'react-router'
import RequestUpdate from '../../Components/RequestUpdate';

export default function GuestUpdate() {
  const { guestListEntryId } = useParams()
  return (
    <>
      <div className="container">
        <RequestUpdate
          id={guestListEntryId}
          isGuestRequest
          guestListRequest
        />
      </div>
    </>
  )
}
