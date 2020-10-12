import React, { Fragment } from 'react'
import {
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
import FormLinks, { useStyles } from './FormLinks'
import { FormsQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'

// here we get existing google forms and we mix them with our own created forms
export default function FormLinkList() {
  const { data, error, loading } = useQuery(FormsQuery)
  const history = useHistory()
  const classes = useStyles()

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
              data-testid="community_form"
              onClick={() => history.push(`/form/${form.id}?name=${form.name}`)}
            >
              <ListItemAvatar data-testid="community_form_icon">
                <Avatar>
                  <AssignmentIcon />
                </Avatar>
              </ListItemAvatar>
              <Box className={classes.listBox}>
                <Typography
                  variant="subtitle1"
                  data-testid="form_name"
                >
                  {form.name}
                </Typography>
              </Box>
            </ListItem>
          </Fragment>
        ))}
      </List>
    </div>
  )
}
