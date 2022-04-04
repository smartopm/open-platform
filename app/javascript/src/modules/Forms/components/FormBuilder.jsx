import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Container } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-apollo'
import CenteredContent from '../../../components/CenteredContent'
import { AllEventLogsQuery } from '../../../graphql/queries'
import { FormPropertiesQuery, FormQuery } from '../graphql/forms_queries'
import { Spinner } from '../../../shared/Loading'
import { FormUpdateMutation } from '../graphql/forms_mutation'
import { formStatus } from '../../../utils/constants'
import Toggler from '../../Campaigns/components/ToggleButton'
import FormTimeline from '../../../shared/TimeLine'
import { ActionDialog } from '../../../components/Dialog'
import { formatError } from '../../../utils/helpers'
import MessageAlert from '../../../components/MessageAlert'
import Form from './Category/Form'
import FormContextProvider from '../Context'
import ErrorPage from '../../../components/Error';
import FormDialog from './FormDialog'

/**
 * @param {String} formId
 * @description puts form related components(fields) together and allow user to dynamically create different form properties
 * @returns {Node}
 */
export default function FormBuilder({ formId }) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const { t } = useTranslation(['form', 'common']);
  const [type, setType] = useState(t('misc.form'));
  const { data, error, loading } = useQuery(FormPropertiesQuery, {
    variables: { formId },
    errorPolicy: 'all'
  });
  const formLogs = useQuery(AllEventLogsQuery, {
    variables: {
      refId: formId,
      refType: 'Forms::Form',
      subject: null
    }
  });
  const [updateForm] = useMutation(FormUpdateMutation)
  const formData = useQuery(FormQuery, {
    variables: { id: formId }
  })

  function handleType(_event, value) {
    setType(value)
    formLogs.refetch()
  }

  function handleConfirmPublish() {
    setOpen(!open)
  }

  function handleAlertClose() {
    setAlertOpen(false)
  }

  function publishForm() {
    setIsPublishing(true)
    setOpen(!open)
    updateForm({
      variables: { id: formId, status: formStatus.publish }
    })
      .then(() => {
        setMessage({
          isError: false,
          detail: t('misc.published_form')
        })
        setIsPublishing(false)
        setAlertOpen(true)
      })
      .catch(err => {
        setMessage({ isError: true, detail: formatError(err.message) })
        setIsPublishing(false)
        setAlertOpen(true)
      })
  }

  if (loading || formLogs.loading || formData.loading) return <Spinner />
  if (error || formLogs.error || formData.error) return  <ErrorPage title={error?.message || formLogs?.error?.message} />

  return (
    <>
      <FormDialog
        actionType="update"
        form={formData.data.form}
        formMutation={updateForm}
        message={message}
        setMessage={setMessage}
        open={dialogOpen}
        setOpen={setDialogOpen}
        setAlertOpen={setAlertOpen}
      />
      <FormContextProvider>
        <Container maxWidth="md">
          <ActionDialog
            open={open}
            handleClose={handleConfirmPublish}
            handleOnSave={publishForm}
            message={t('misc.are_you_sure_to_publish')}
            type="confirm"
          />

          <MessageAlert
            type={message.isError ? 'error' : 'success'}
            message={message.detail}
            open={alertOpen}
            handleClose={handleAlertClose}
          />

          <br />
          <Toggler
            type={type}
            handleType={handleType}
            data={{
          type: t('misc.form'),
          antiType: t('misc.updates')
        }}
          />
          <br />
          {type !== t('misc.updates') ? (
            <>
              <Form formId={formId} editMode />
              <br />
              <br />
              <CenteredContent>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setDialogOpen(true)}
                >
                  {t('actions.edit_form')}
                </Button>
              </CenteredContent>
              <br />
              <CenteredContent>
                {Boolean(data.formProperties.length) && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleConfirmPublish}
                  disabled={isPublishing}
                  startIcon={isPublishing && <Spinner />}
                >
                  {isPublishing ? t('misc.publishing_form') : t('actions.publish_form')}
                </Button>
              )}
              </CenteredContent>
            </>
      ) : (
        <FormTimeline data={formLogs.data?.result} />
      )}
        </Container>
      </FormContextProvider>
    </>
  )
}

FormBuilder.propTypes = {
  formId: PropTypes.string.isRequired
}
