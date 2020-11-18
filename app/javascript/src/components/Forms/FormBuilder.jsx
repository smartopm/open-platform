import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router';
import { Button, Container } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import { useQuery } from 'react-apollo';
import CenteredContent from '../CenteredContent'
import GenericForm from './GenericForm';
import { FormPropertiesQuery } from '../../graphql/queries';
import { Spinner } from '../Loading';
import FormPropertyCreateForm from './FormPropertyCreateForm';

/**
 * @param {String} formId
 * @description puts form related components together and allow user to dynamically create different form properties
 * @returns {Node} 
 */
export default function FormBuilder({ formId }) {
  const [isAdd, setAdd] = useState(false)
  const { pathname } = useLocation()
  const { data, error, loading, refetch } = useQuery(FormPropertiesQuery, {
    variables: { formId },
    errorPolicy: 'all'
  })

  if (loading) return <Spinner />
  if (error) return error.message

  return (
    <Container maxWidth="lg">
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
            <Button variant="outlined" color="primary" disableElevation>
              Publish Form
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