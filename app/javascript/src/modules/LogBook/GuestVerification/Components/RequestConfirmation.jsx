import React, { useContext } from 'react'
import { EntryRequestContext } from '../Context';

export default function RequestConfirmation() {
  const requestContext = useContext(EntryRequestContext);
  return (
    <>
      Confirm
      {console.log(requestContext)}
    </>
  )
}