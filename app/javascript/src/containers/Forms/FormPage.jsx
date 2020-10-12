// page that renders the form being created
import React from 'react'
import { useParams } from 'react-router'
import Form from '../../components/Forms/Form'
import Nav from '../../components/Nav'

export default function FormPage(){
  const { formName } = useParams()
    return (
      <>
        <Nav navName={formName} menuButton="back" backTo="/forms" />
        <br />
        <Form />
      </>
    )
}
