import React from 'react'
import {  useParams } from 'react-router'
import GuestRequestForm from '../Components/GuestRequestForm';

export default function GuestUpdate() {
  const { guestListEntryId } = useParams()
  return (
    <>
      <div className="container">
        <GuestRequestForm
          id={guestListEntryId}
        />
      </div>
    </>
  )
}
