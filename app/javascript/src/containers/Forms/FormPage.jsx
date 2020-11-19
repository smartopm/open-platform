import React, { useContext } from 'react'
import { useLocation, useParams } from 'react-router'
import Form from '../../components/Forms/Form'
import FormUpdate from '../../components/Forms/FormUpdate'
import Nav from '../../components/Nav'
import { Context } from '../Provider/AuthStateProvider'

export default function FormPage(){
  const { formName, formId, userId, type } = useParams()
  const {pathname } = useLocation()
  const authState = useContext(Context)
  const isFormFilled = pathname.includes('user_form')
  // eslint-disable-next-line no-nested-ternary
  const backTo = isFormFilled && type ? `/todo` : isFormFilled && !type ? `/user/${userId}` : '/forms'
    return (
      <>
        <Nav navName={formName} menuButton="back" backTo={backTo} />
        <br />
        {
          isFormFilled ? <FormUpdate formId={formId} userId={userId} authState={authState} /> : <Form formId={formId} pathname={pathname} />
        }
      </>
    )
}
