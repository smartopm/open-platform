import React from "react";
import { useLocation } from "react-router";
import Nav from "../../components/Nav";
import RequestForm from "../../components/Request/RequestForm";

export default function EntryRequest(){
  const location  = useLocation()

  const title = location.pathname.includes('visit_request') ? 'New Visit Request' : 'New Log'
  return (
    <>
      <Nav navName={title} menuButton="cancel" backTo="/" />
      <RequestForm path={location.pathname} />
    </>
  )
}