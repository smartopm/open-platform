import React from 'react'
import {  useParams } from 'react-router'
import RequestUpdate from '../../Components/RequestUpdate';
import EntryRequestContextProvider from '../../GuestVerification/Context';

export default function GuestUpdate() {
  const { guestListEntryId } = useParams()
  return (
    <>
      <div className="container">
        <EntryRequestContextProvider>
          <RequestUpdate
            id={guestListEntryId === "new-guest-entry" ? null : guestListEntryId}
            isGuestRequest
            guestListRequest
            isScannedRequest={false}
          />
        </EntryRequestContextProvider>
      </div>
    </>
  )
}
