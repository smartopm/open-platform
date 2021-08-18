import React, { useContext } from 'react'
import { useLocation, useParams } from 'react-router'
import { Container } from '@material-ui/core'
import FormUpdate from '../components/FormUpdate'
import { Context } from '../../../containers/Provider/AuthStateProvider'
import FormContextProvider from '../Context'
import Form from '../components/Category/Form'

export default function FormPage(){
  const { userId, formUserId, formId } = useParams()
  const {pathname } = useLocation()
  const authState = useContext(Context)
  const isFormFilled = pathname.includes('user_form')
    return (
      <>
        <br />
        {
          isFormFilled
          ? <FormUpdate userId={userId} formUserId={formUserId} authState={authState} />
          : (
            <FormContextProvider>
              <Container maxWidth="md">
                <Form editMode={false} formId={formId} />
              </Container>
            </FormContextProvider>
          )
        }
      </>
    )
}