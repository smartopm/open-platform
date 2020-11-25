import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router';
import { Button, Container, Snackbar } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import { Alert } from '@material-ui/lab';
import { useMutation, useQuery } from 'react-apollo';
import CenteredContent from '../CenteredContent'
import GenericForm from './GenericForm';
import { FormPropertiesQuery } from '../../graphql/queries';
import { Spinner } from '../Loading';
import FormPropertyCreateForm from './FormPropertyCreateForm';
import DeleteDialogueBox from '../Business/DeleteDialogue';
import { FormUpdateMutation } from '../../graphql/mutations/forms';
import { formStatus } from '../../utils/constants';

/**
 * @param {String} formId
 * @description puts form related components together and allow user to dynamically create different form properties
 * @returns {Node} 
 */
export default function FormBuilder({ formId }) {
  const [isAdd, setAdd] = useState(false)
  const [open, setOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [message, setMessage] = useState({ isError: false, detail: '' })

  const { pathname } = useLocation()
  const { data, error, loading, refetch } = useQuery(FormPropertiesQuery, {
    variables: { formId },
    errorPolicy: 'all'
  })
  const [publish] = useMutation(FormUpdateMutation)

  function handleConfirmPublish(){
    setOpen(!open)
  }
  function handleAlertClose(){
    setAlertOpen(false)
  }

  function publishForm(){
    setIsPublishing(true)
    setOpen(!open)
    publish({
      variables: { id: formId, status: formStatus.publish }
    })
    .then(() => {
      setMessage({isError: false, detail: 'Successfully published the form'})
      setIsPublishing(false)
      setAlertOpen(true)
    })
    .catch(err => {
      setMessage({ isError: true, detail: err.message })
      setIsPublishing(false)
      setAlertOpen(true)
    })
  }
  if (loading) return <Spinner />
  if (error) return error.message

  return (
    <Container maxWidth="lg">
      <DeleteDialogueBox 
        open={open}
        handleClose={handleConfirmPublish}
        handleAction={publishForm}
        title="form"
        action="publish"
      />

      <Snackbar open={alertOpen} autoHideDuration={2000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={message.isError ? 'error' : 'success'}>
          {message.detail}
        </Alert>
      </Snackbar>

      <br />
      <GenericForm 
        formId={formId}
        pathname={pathname}
        formData={data}
        refetch={refetch}
        editMode
      />
      {
        isAdd && <FormPropertyCreateForm formId={formId} refetch={refetch} />
      }
      <br />
      <CenteredContent>
        <Button 
          onClick={() => setAdd(!isAdd)}
          startIcon={<Icon>{!isAdd ? 'add' : 'close'}</Icon>}
          variant="outlined"
        >
          {!isAdd ? 'Add Field' : 'Cancel'} 
        </Button>
      </CenteredContent>
      <br />
      <CenteredContent>
        {
          Boolean(data.formProperties.length) && (
            <Button variant="outlined" color="primary" onClick={handleConfirmPublish}>
              { isPublishing ? 'Publishing the form ...' : 'Publish Form' }
            </Button>
          )
        }
      </CenteredContent>
    </Container>
  )
}

FormBuilder.propTypes = {
  formId: PropTypes.string.isRequired
}