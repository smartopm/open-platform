import React from 'react'
import { useLocation, useParams } from 'react-router';
import Nav from '../../components/Nav';
import RequestUpdate from '../../components/Request/RequestUpdate';


export default function RequestUpdatePage(){
  const { state } = useLocation()
  const { logs, id } = useParams()
  const previousRoute = state?.from || logs
  return (
    <>
      <Nav
        navName={
          // eslint-disable-next-line no-nested-ternary
          previousRoute === 'logs'
            ? 'Request Access'
            : previousRoute === 'enroll'
              ? 'Enroll User'
              : 'Approve Request'
        }
        menuButton="cancel"
        backTo={`/entry_logs/?offset=${state?.offset}`}
      />
      <RequestUpdate id={id} />
    </>
  )
}