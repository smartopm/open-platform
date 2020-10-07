/* eslint-disable */
import React, { useContext } from 'react'
import { Button, List } from '@material-ui/core'
import CenteredContent from '../CenteredContent'
import { useQuery } from 'react-apollo'
import FormLinks from './FormLinks'
import { FormsQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'

export default function FormLinkList() {
  const { data, error, loading } = useQuery(FormsQuery)

  if (loading) return <Loading />
  if (error) return <ErrorPage />
  
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

