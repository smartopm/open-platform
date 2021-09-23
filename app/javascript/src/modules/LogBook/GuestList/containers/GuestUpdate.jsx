import React from 'react'
import {  useParams } from 'react-router'
// import GuestRequestForm from '../Components/GuestRequestForm';
import RequestUpdate from '../../Components/RequestUpdate';

export default function GuestUpdate() {
  const { guestListEntryId } = useParams()
  const isGuestRequest = true
  const fromGuestListPage = true
  return (
    <>
      <div className="container">
        <RequestUpdate
          id={guestListEntryId}
          isGuestRequest={isGuestRequest}
          fromGuestListPage={fromGuestListPage}
        />
      </div>
    </>
  )
}
