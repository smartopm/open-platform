import React, { useContext } from 'react'
import { useLocation, useParams } from 'react-router'
import Form from '../components/Form'
import FormUpdate from '../components/FormUpdate'
import { Context } from '../../../containers/Provider/AuthStateProvider'

export default function FormPage(){
  const { formId, userId, formUserId } = useParams()
  const {pathname } = useLocation()
  const authState = useContext(Context)
  const isFormFilled = pathname.includes('user_form')
    return (
      <>
        <br />
        {
          isFormFilled ? <FormUpdate userId={userId} formUserId={formUserId} authState={authState} /> : <Form formId={formId} pathname={pathname} />
        }
      </>
    )
}
