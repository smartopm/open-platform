// page that renders the form being created
import React from 'react'
import Form from '../../components/Forms/Form'
import Nav from '../../components/Nav'

export default function FormPage(){
    return (
      <>
        <Nav navName="My Form" menuButton="back" backTo="/forms" />
        <br />
        <Form />
      </>
    )
}
