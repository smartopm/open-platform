import React from 'react'
import { useLocation, useParams } from 'react-router'
import Form from '../../components/Forms/Form'
import FormUpdate from '../../components/Forms/FormUpdate'
import Nav from '../../components/Nav'

export default function FormPage(){
  const { formName, formId } = useParams()
  const location = useLocation()
  const isFormFilled = location.pathname.includes('user_form')
    return (
      <>
        <Nav navName={formName} menuButton="back" backTo="/forms" />
        <br />
        {
          isFormFilled ? <FormUpdate formId={formId} /> : <Form formId={formId} />
        }
      </>
    )
}
