/* eslint-disable no-unused-vars */
import React, { Fragment, useState } from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography,
  Box, Fab, Dialog, DialogTitle, DialogContent, useMediaQuery
} from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { useQuery } from 'react-apollo'
import { useTheme } from '@material-ui/styles'
import { StyleSheet, css } from 'aphrodite'
import { useHistory } from 'react-router'
import FormLinks, { useStyles } from './FormLinks'
import { FormsQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'
import CenteredContent from '../CenteredContent'
import TitleDescriptionForm from './TitleDescriptionForm'

// here we get existing google forms and we mix them with our own created forms
// eslint-disable-next-line react/prop-types
export default function FormLinkList({ userType }) {
  const { data, error, loading, refetch } = useQuery(FormsQuery)
  const history = useHistory()
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  function submitForm() {
}
function updateList() {
    refetch()
    setOpen(!open)
}


  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />
 
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        fullWidth
        maxWidth="lg"
        onClose={() => setOpen(!open)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <CenteredContent>
            <span>Create a form</span>
          </CenteredContent>
        </DialogTitle>
        <DialogContent>
          <TitleDescriptionForm 
            close={updateList} 
            type="form" 
            save={submitForm} 
            data={{
                  loading: isLoading,
                  msg: message
                }}
          />
        </DialogContent>
      </Dialog>
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
          onClick={() => setOpen(!open)}
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
