import React, { useContext } from 'react'
import { useLocation, useParams } from 'react-router'
import Form from '../components/Form'
import FormUpdate from '../components/FormUpdate'
import { Context } from '../../../containers/Provider/AuthStateProvider'

export default function FormPage(){
  const { formId, userId } = useParams()
  const {pathname } = useLocation()
  const authState = useContext(Context)
  const isFormFilled = pathname.includes('user_form')
    return (
      <>
        <br />
        {
          isFormFilled ? <FormUpdate formId={formId} userId={userId} authState={authState} /> : <Form formId={formId} pathname={pathname} />
        }
      </>
    )
}
