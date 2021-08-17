import React from 'react'
import { Container } from '@material-ui/core'
import CategoryList from './Category/CategoryList'

export default function Form() {
  return (
    <Container maxWidth="md">
      <CategoryList editMode={false} />
    </Container>
  )
}
