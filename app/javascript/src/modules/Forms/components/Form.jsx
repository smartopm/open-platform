import React from 'react'
import { Container } from '@material-ui/core'
import CategoryList from './Category/CategoryList'
import FormContextProvider from '../Context'

export default function Form() {
  return (
    <FormContextProvider>
      <Container maxWidth="md">
        <CategoryList editMode={false} />
      </Container>
    </FormContextProvider>
  )
}
