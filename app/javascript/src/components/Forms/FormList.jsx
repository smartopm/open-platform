import React, { Fragment } from 'react'
import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography,
  Box
} from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { useQuery } from 'react-apollo'
import { useHistory } from 'react-router'
import CenteredContent from '../CenteredContent'
import FormLinks from './FormLinks'
import { FormsQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'

export default function FormLinkList() {
  const { data, error, loading } = useQuery(FormsQuery)
  const history = useHistory()

  if (loading) return <Loading />
  if (error) return <ErrorPage />
 
  return (
    <div>
      <List data-testid="forms-link-holder" style={{ cursor: 'pointer' }}>
        <FormLinks />
        {data.forms.map(form => (
          <Fragment key={form.id}>
            <Divider variant="middle" />
            <ListItem
              key={form.id}
              data-testid="forms-link-building-permit"
              onClick={() => history.push(`/form/${form.id}`)}
            >
              <ListItemAvatar data-testid="forms-link-building-icon">
                <Avatar>
                  <AssignmentIcon />
                </Avatar>
              </ListItemAvatar>
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginLeft: 30
                }}
              >
                <Typography
                  variant="subtitle1"
                  data-testid="forms-building-permit"
                >
                  {form.name}
                </Typography>
              </Box>
            </ListItem>
          </Fragment>
        ))}
        <CenteredContent>
          <Button color="primary">Create a Form</Button>
        </CenteredContent>
      </List>
    </div>
  )
}
