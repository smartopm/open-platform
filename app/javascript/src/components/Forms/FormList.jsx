import React, { Fragment, useState } from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  Grid,
  IconButton,
  MenuItem,
  Menu,
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { useMutation, useQuery } from 'react-apollo'
import { useTheme } from '@material-ui/styles'
import { StyleSheet, css } from 'aphrodite'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import FormLinks, { useStyles } from './FormLinks'
import { FormsQuery } from '../../graphql/queries'
import Loading from '../../shared/Loading'
import ErrorPage from '../Error'
import CenteredContent from '../CenteredContent'
import TitleDescriptionForm from './TitleDescriptionForm'
import { DateAndTimePickers } from '../DatePickerDialog'
import { FormCreateMutation, FormUpdateMutation } from '../../graphql/mutations/forms'
import { formStatus } from '../../utils/constants'
import { ActionDialog } from '../Dialog'
import MessageAlert from '../MessageAlert'
import FloatButton from '../FloatButton'
import { propAccessor } from '../../utils/helpers'

// here we get existing google forms and we mix them with our own created forms
export default function FormLinkList({ userType }) {
  const { data, error, loading, refetch } = useQuery(FormsQuery)
  const [createForm] = useMutation(FormCreateMutation)
  const history = useHistory()
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [expiresAt, setExpiresAtDate] = useState(null)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [anchorEl, setAnchorEl] = useState(null)
  const [formId, setFormId] = useState("")

  const menuOpen = Boolean(anchorEl)

  function handleOpenMenu(event, id) {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setFormId(id)
  }
  function submitForm(title, description) {
    createForm({
      variables: { name: title, expiresAt, description }
    })
      .then(() => {
        setMessage('Form created')
        setLoading(false)
        setTimeout(() => {
          updateList()
        }, 1000)
        setOpen(!open)
      })
      .catch(err => {
        setLoading(false)
        setMessage(err.message)
      })
  }

  function updateList() {
    refetch()
    setOpen(!open)
  }

  function handleDateChange(date) {
    setExpiresAtDate(date)
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
          >
            <DateAndTimePickers
              label="Form Expiry Date"
              required
              selectedDateTime={expiresAt}
              handleDateChange={handleDateChange}
              pastDate
            />
          </TitleDescriptionForm>
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
              <Grid container spacing={1} style={{ marginTop: '8px' }}>
                <Grid item xs={1}>
                  <ListItemAvatar data-testid="community_form_icon">
                    <Avatar>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemAvatar>
                </Grid>
                <Grid item xs={9}>
                  <Box className={classes.listBox}>
                    <Typography variant="subtitle1" data-testid="form_name">
                      {form.name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  {userType === 'admin' && (
                    <IconButton
                      className={css(styles.menuButton)}
                      aria-label={`more-${form.name}`}
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={event => handleOpenMenu(event, form.id)}
                      dataid={form.id}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </ListItem>
            {
              formId === form.id && (
                <FormMenu
                  formId={formId}
                  anchorEl={anchorEl}
                  handleClose={() => setAnchorEl(null)}
                  open={menuOpen}
                  refetch={refetch}
                />
              )
            }
          </Fragment>
        ))}
      </List>

      {userType === 'admin' && (
        <FloatButton 
          title="Create a Form"
          handleClick={() => setOpen(!open)}
        />
      )}
    </div>
  )
}

export function FormMenu({ formId, anchorEl, handleClose, open, refetch }) {
  const history = useHistory()
  const [isDialogOpen, setOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [actionType, setActionType] = useState('')
  const [message, setMessage] = useState({ isError: false, detail: '' })

  const [publish] = useMutation(FormUpdateMutation)

  function handleConfirm(type){
    setOpen(!isDialogOpen)
    handleClose()
    setActionType(type)
  }

  function handleAlertClose(){
    setAlertOpen(false)
  }

  function updateForm(){
    publish({
      variables: { id: formId, status: propAccessor(formStatus, actionType)}
    })
    .then(() => {
      setMessage({isError: false, detail: `Successfully ${propAccessor(formStatus, actionType)} the form`})
      setOpen(!isDialogOpen)
      setAlertOpen(true)
      handleClose()
      refetch()
    })
    .catch(err => {
      setMessage({ isError: true, detail: err.message })
      setOpen(!isDialogOpen)
      setAlertOpen(true)
    })
  }

  function routeToEdit(event){  
    event.stopPropagation()
    history.push(`/edit_form/${formId}`)
  }

  return (
    <>

      <ActionDialog
        open={isDialogOpen}
        handleClose={() => handleConfirm('')}
        handleOnSave={updateForm}
        message={`Are you sure to ${actionType} this form`}
        type={actionType === 'delete' ? 'warning' : 'confirm'}
      />

      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={handleAlertClose}
      />
      <Menu
        id={`long-menu-${formId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted={false}
        PaperProps={{
        style: {
          width: 200
        }
      }}
      >
 
        <div>
          <MenuItem
            id="edit_button"
            key="edit_form"
            onClick={routeToEdit}
          >
            Edit
          </MenuItem>
          <MenuItem
            id="publish_button"
            key="publish_form"
            onClick={() => handleConfirm('publish')}
          >
            Publish
          </MenuItem>
          <MenuItem
            id="delete_button"
            key="delete_form"
            onClick={() => handleConfirm('delete')}
          >
            Delete
          </MenuItem>
        </div>
      </Menu>
    </>
  )
}

FormMenu.defaultProps = {
  anchorEl: {}
}
FormMenu.propTypes = {
  formId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object
}

FormLinkList.propTypes = {
  userType: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  menuButton: {
    float: 'right'
  }
})
