import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router'
import { Button, Container } from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-apollo'
import CenteredContent from '../../../components/CenteredContent'
import GenericForm from './GenericForm'
import { AllEventLogsQuery } from '../../../graphql/queries'
import { FormPropertiesQuery } from '../graphql/forms_queries'
import { Spinner } from '../../../shared/Loading'
import FormPropertyCreateForm from './FormPropertyCreateForm'
import { FormUpdateMutation } from '../graphql/forms_mutation'
import { formStatus } from '../../../utils/constants'
import Toggler from '../../../components/Campaign/ToggleButton'
import FormTimeline from '../../../shared/TimeLine'
import { ActionDialog } from '../../../components/Dialog'
import { formatError } from '../../../utils/helpers'
import MessageAlert from '../../../components/MessageAlert'

/**
 * @param {String} formId
 * @description puts form related components(fields) together and allow user to dynamically create different form properties
 * @returns {Node}
 */
export default function FormBuilder({ formId }) {
  const [isAdd, setAdd] = useState(false)
  const [open, setOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [message, setMessage] = useState({ isError: false, detail: '' })
  const [type, setType] = useState('form')
  const { pathname } = useLocation()
  const { t } = useTranslation(['form', 'common'])
  const { data, error, loading, refetch } = useQuery(FormPropertiesQuery, {
    variables: { formId },
    errorPolicy: 'all'
  })
  const formLogs = useQuery(AllEventLogsQuery, {
    variables: {
      refId: formId,
      refType: 'Forms::Form',
      subject: null
    }
  })
  const [publish] = useMutation(FormUpdateMutation)

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
    publish({
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
  if (loading || formLogs.loading) return <Spinner />
  if (error || formLogs.error) return error?.message || formLogs?.error.message

  return (
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
      {type === 'form' ? (
        <>
          <GenericForm
            formId={formId}
            pathname={pathname}
            formData={data}
            refetch={refetch}
            editMode
          />

          {isAdd && (
            <FormPropertyCreateForm formId={formId} refetch={refetch} />
          )}
          <br />
          <CenteredContent>
            <Button
              onClick={() => setAdd(!isAdd)}
              startIcon={<Icon>{!isAdd ? 'add' : 'close'}</Icon>}
              variant="outlined"
            >
              {!isAdd ? t('actions.add_field') : t('common:form_actions.cancel')}
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
  )
}

FormBuilder.propTypes = {
  formId: PropTypes.string.isRequired
}
