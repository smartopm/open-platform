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
  Select,
  FormControl,
  InputLabel
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { useMutation, useQuery } from 'react-apollo'
import { useTheme } from '@material-ui/styles'
import { StyleSheet, css } from 'aphrodite'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import FormLinks, { useStyles } from './FormLinks'
import { FormsQuery } from '../graphql/forms_queries'
import Loading from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'
import CenteredContent from '../../../components/CenteredContent'
import TitleDescriptionForm from './TitleDescriptionForm'
import { DateAndTimePickers } from '../../../components/DatePickerDialog'
import { FormCreateMutation, FormUpdateMutation } from '../graphql/forms_mutation'
import { formStatus } from '../../../utils/constants'
import { ActionDialog } from '../../../components/Dialog'
import MessageAlert from '../../../components/MessageAlert'
import FloatButton from '../../../components/FloatButton'
import { objectAccessor, formatError } from '../../../utils/helpers'
import SwitchInput from './FormProperties/SwitchInput';
import {Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';


// here we get existing google forms and we mix them with our own created forms
export default function FormLinkList({ userType, community }) {
  const { data, error, loading, refetch } = useQuery(FormsQuery, {
    fetchPolicy: 'cache-and-network'
  })
  const [createForm] = useMutation(FormCreateMutation)
  const history = useHistory()
  const classes = useStyles()
  const { t } = useTranslation(['form', 'common'])
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState({ isError: false, detail: '' })
  const [anchorEl, setAnchorEl] = useState(null)
  const [formId, setFormId] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)


  const menuOpen = Boolean(anchorEl)

  function handleOpenMenu(event, id) {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setFormId(id)
  }

  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />

  return (
    <div>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={() => setAlertOpen(false)}
      />
      <FormDialog
        formMutation={createForm}
        message={message}
        setMessage={setMessage}
        open={open}
        setOpen={setOpen}
        setAlertOpen={setAlertOpen}
        refetch={refetch}
      />
      <List data-testid="forms-link-holder" style={{ cursor: 'pointer' }}>
        <FormLinks community={community} />
        {data.forms.length ? data.forms.map(form => (
          <Fragment key={form.id}>
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
                      className={`${css(styles.menuButton)} form-menu-open-btn`}
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
                  formName={form.name}
                  anchorEl={anchorEl}
                  handleClose={() => setAnchorEl(null)}
                  open={menuOpen}
                  refetch={refetch}
                />
              )
            }
            <Divider variant="middle" />
          </Fragment>
        ))
      : (
        <CenteredContent>
          <Typography data-testid='no-form-available'>
            {t('common:misc.no_forms')}
          </Typography>
        </CenteredContent>
    )}
      </List>

      {userType === 'admin' && (
        <FloatButton
          title={t('actions.create_a_form')}
          handleClick={() => setOpen(!open)}
          otherClassNames='new-permit-request-form-btn'
        />
      )} 
    </div>
  )
}

// TODO: This should be its own separate file
export function FormMenu({ formId, formName, anchorEl, handleClose, open, refetch }) {
  const history = useHistory()
  const [isDialogOpen, setOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [actionType, setActionType] = useState('')
  const [message, setMessage] = useState({ isError: false, detail: '' })
  const { t } = useTranslation(['form', 'common'])

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
      variables: { id: formId, status: objectAccessor(formStatus, actionType)}
    })
    .then(() => {
      setMessage({isError: false, detail: t('misc.form_action_success', { status: t(`form_status.${actionType}`)})})
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
        message={t('misc.form_confirm_message', { actionType: t(`form_status_actions.${actionType}`) })}
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
            className="edit-form-btn"
            key="edit_form"
            onClick={routeToEdit}
          >
            {t('common:menu.edit')}
          </MenuItem>
          <MenuItem
            id="publish_button"
            key="publish_form"
            onClick={() => handleConfirm('publish')}
          >
            {t('common:menu.publish')}
          </MenuItem>
          <MenuItem
            id="delete_button"
            key="delete_form"
            onClick={() => handleConfirm('delete')}
          >
            {t('common:menu.delete')}
          </MenuItem>
          <MenuItem
            id="view_entries_button"
            key="view_entries"
            onClick={() => history.push(`/form/${formId}/${formName}/entries`)}
          >
            {t('common:menu.view_entries')}
          </MenuItem>
        </div>
      </Menu>
    </>
  )
}

// TODO: This should be its own separate file
export function FormDialog({actionType, form, formMutation, open, setOpen, message, setMessage, setAlertOpen, refetch}){
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const { t } = useTranslation('form')
  const [expiresAt, setExpiresAtDate] = useState(form?.expiresAt || null)
  const [isLoading, setLoading] = useState(false);
  const [multipleSubmissionsAllowed, setMultipleSubmissionsAllowed] = useState(form ? form.multipleSubmissionsAllowed : true)
  const [preview, setPreview] = useState(form ? form.preview : false)
  const authState = React.useContext(AuthStateContext);
  const [roles, setRoles] = useState(form?.roles || [])
  const communityRoles = authState?.user?.community?.roles

  function handleDateChange(date) {
    setExpiresAtDate(date)
  }

  function submitForm(title, description) {
    const variables = { name: title, expiresAt, description, multipleSubmissionsAllowed, preview, roles }
    if (actionType === 'update'){
      variables.id = form?.id
    }
    setLoading(true);
    formMutation({
      variables
    })
      .then(() => {
        setMessage({isError: false, detail: actionType === 'update' ? t('misc.form_updated') : t('misc.form_created')});
        setAlertOpen(true);
        refetch();
        setLoading(false);
        setOpen(!open);
        if(actionType === 'update'){
          window.location.reload();
        }
      })
      .catch(err => {
        setLoading(false);
        setMessage({ isError: true, detail: formatError(err.message) });
        setAlertOpen(true);
      })
  }

  return(
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
          <span>{actionType === 'create' ? t('actions.create_a_form') : t('actions.edit_form')}</span>
        </CenteredContent>
      </DialogTitle>
      <DialogContent>
        <TitleDescriptionForm
          formTitle={form?.name || ''}
          formDescription={form?.description || ''}
          close={() => setOpen(false)}
          type="form"
          save={submitForm}
          data={{
            loading: isLoading,
            msg: message.detail
          }}
        >
          <div style={{marginLeft : '-15px', display: 'inline-block'}}>
            <SwitchInput
              name="multipleSubmissionsAllowed"
              label={t('misc.limit_1_response')}
              value={!multipleSubmissionsAllowed}
              handleChange={event => setMultipleSubmissionsAllowed(!event.target.checked)}
            />

            <SwitchInput
              name="previewable"
              label={t('misc.previewable')}
              value={preview}
              handleChange={event => setPreview(event.target.checked)}
              className="form-previewbale-switch-btn"
            />
          </div>
          <div>
            <FormControl style={{minWidth:  250, maxWidth: 400}}>
              <InputLabel id="multiple-roles-label">{t('misc.select_roles')}</InputLabel>
              <Select
                id="multiple-roles"
                multiple
                value={roles}
                onChange={event => setRoles(event.target.value)}
                MenuProps={{
                getContentAnchorEl: () => null,
                PaperProps: {
                  style: {
                    maxHeight: 190,
                    minWidth: 250,
                    marginTop: 35
                  },
                },
              }}
              >
                {communityRoles &&
              communityRoles.map(key => (
                <MenuItem key={key} value={key}>
                  {t(`common:user_types.${key}`)}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
          </div>
          <DateAndTimePickers
            label={t('misc.form_expiry_date')}
            selectedDateTime={expiresAt}
            handleDateChange={handleDateChange}
            pastDate
          />
        </TitleDescriptionForm>
      </DialogContent>
    </Dialog>
  )
}

FormMenu.defaultProps = {
  anchorEl: {}
}
FormMenu.propTypes = {
  formId: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object
}

FormLinkList.propTypes = {
  userType: PropTypes.string.isRequired,
  community: PropTypes.string.isRequired,
}

FormDialog.defaultProps = {
  refetch: () => {},
  actionType: 'create',
  form: null,

}

FormDialog.propTypes = {
  actionType: PropTypes.string,
  form: PropTypes.shape({
    id: PropTypes.string.isRequired,
    multipleSubmissionsAllowed: PropTypes.bool.isRequired,
    preview: PropTypes.bool.isRequired,
    expiresAt: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(
      PropTypes.string
    )
  }),
  formMutation: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  message: PropTypes.shape({
    detail: PropTypes.string.isRequired,
    isError: PropTypes.bool.isRequired
  }).isRequired,
  setMessage: PropTypes.func.isRequired,
  setAlertOpen: PropTypes.func.isRequired,
  refetch: PropTypes.func
}

const styles = StyleSheet.create({
  menuButton: {
    float: 'right'
  }
})