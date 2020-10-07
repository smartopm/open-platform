/* eslint-disable */
import React, { useContext } from 'react'
import { Button, List } from '@material-ui/core'
import CenteredContent from '../CenteredContent'
import FormLinks from './FormLinks'

export default function FormLinkList() {
  return (
    <div>
      <List
        data-testid="forms-link-holder"
        style={{ cursor: 'pointer' }}
      >
        <FormLinks />
        <CenteredContent>
          <Button color="primary">Create a Form</Button>
        </CenteredContent>
      </List>
    </div>
  )
}
