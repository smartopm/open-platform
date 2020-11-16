/* eslint-disable no-use-before-define */
import React from 'react'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { FormPropertiesQuery } from '../../graphql/queries'
import GenericForm from './GenericForm'
import { Spinner } from '../Loading'

export default function Form({ formId, pathname }) {
  const { data: formData, error, loading } = useQuery(FormPropertiesQuery, {
    variables: { formId },
    errorPolicy: 'all'
  })

  if (loading) return <Spinner />
  if (error) return error.message

  return (
    <>
      <GenericForm formId={formId} pathname={pathname} formData={formData} />
    </>
  )
}

Form.propTypes = {
  formId: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
}
