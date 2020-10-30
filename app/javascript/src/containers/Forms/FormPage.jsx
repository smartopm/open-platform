import React, { useContext } from 'react'
import { useLocation, useParams } from 'react-router'
import Form from '../../components/Forms/Form'
import FormUpdate from '../../components/Forms/FormUpdate'
import Nav from '../../components/Nav'
import { Context } from '../Provider/AuthStateProvider'

export default function FormPage(){
  const { formName, formId, userId } = useParams()
  const location = useLocation()
  const authState = useContext(Context)
  const isFormFilled = location.pathname.includes('user_form')
    return (
      <>
        <Nav navName={formName} menuButton="back" backTo="/forms" />
        <br />
        {
          isFormFilled ? <FormUpdate formId={formId} userId={userId} authState={authState} /> : <Form formId={formId} />
        }
      </>
    )
}
