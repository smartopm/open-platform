import React, { Fragment } from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography,
  Box, Fab
} from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { useQuery } from 'react-apollo'
import { StyleSheet, css } from 'aphrodite'
import { useHistory } from 'react-router'
import FormLinks, { useStyles } from './FormLinks'
import { FormsQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'

// here we get existing google forms and we mix them with our own created forms
// eslint-disable-next-line react/prop-types
export default function FormLinkList({ userType }) {
  const { data, error, loading } = useQuery(FormsQuery)
  const history = useHistory()
  const classes = useStyles()

  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />
 
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
              onClick={() => history.push(`/form/${form.id}/${form.name}`)}
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
      {userType === 'admin' && (
        <Fab
          variant="extended"
          onClick={() => history.push('/form/new')}
          color="primary"
          // eslint-disable-next-line no-use-before-define
          className={`btn ${css(styles.formButton)} `}
        >
          Create a Form
        </Fab>
      )}
    </div>
  )
}

const styles = StyleSheet.create({
  formButton: {
    height: 51,
    boxShadow: 'none',
    position: 'fixed',
    bottom: 20,
    right: 57,
    marginLeft: '30%',
    color: '#FFFFFF'
  }
})
