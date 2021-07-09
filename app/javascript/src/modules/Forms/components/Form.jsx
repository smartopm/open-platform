/* eslint-disable no-use-before-define */
import React from 'react'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { FormPropertiesQuery } from '../graphql/forms_queries'
import GenericForm from './GenericForm'
import { Spinner } from '../../../shared/Loading'

export default function Form({ formId, pathname }) {
  const { data: formData, error, loading, refetch } = useQuery(FormPropertiesQuery, {
    variables: { formId },
    errorPolicy: 'all'
  })

  if (loading) return <Spinner />
  if (error) return error.message

  return (
    <>
      <GenericForm
        formId={formId}
        pathname={pathname}
        formData={formData}
        editMode={false}
        refetch={refetch}
      />
    </>
  )
}

Form.propTypes = {
  formId: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
}
