import React, { Fragment, useState } from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography,
  Box,
  Grid,
  IconButton,
  MenuItem,
  Menu,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { useMutation, useQuery } from 'react-apollo'
import { StyleSheet, css } from 'aphrodite'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import FormLinks, { useStyles } from './FormLinks'
import { FormsQuery } from '../graphql/forms_queries'
import Loading from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'
import { FormCreateMutation, FormUpdateMutation } from '../graphql/forms_mutation'
import { formStatus } from '../../../utils/constants'
import { ActionDialog } from '../../../components/Dialog'
import MessageAlert from '../../../components/MessageAlert'
import FloatButton from '../../../components/FloatButton'
import { objectAccessor } from '../../../utils/helpers'
import FormDialog from './FormDialog'
import CenteredContent from '../../../shared/CenteredContent'


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
              onClick={() => history.push(`/form/${form.id}`)}
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
                      size="large"
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
  );
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

const styles = StyleSheet.create({
  menuButton: {
    float: 'right'
  }
})
