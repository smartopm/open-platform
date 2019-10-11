import React from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';

import Nav from '../components/Nav'
import RequestForm from '../components/RequestForm.jsx';
import Loading from "../components/Loading.jsx";

const QUERY = gql`
query User($id: ID!) {
  result: user(id: $id) {
    name
    userType
    vehicle
    requestReason
    id
    expiresAt
    name
    email
  }
}
`;


const CREATE_PENDING_MEMBER = gql`
mutation CreatePendingUserMutation(
    $name: String!,
    $requestReason: String!,
    $vehicle: String
  ) {
  result: userCreatePending(
      name: $name,
      requestReason: $requestReason,
      vehicle: $vehicle,
    ) {
      id
      name
      vehicle
      requestReason
  }
}
`;

const UPDATE_PENDING_MEMBER = gql`
mutation UpdatePendingUserMutation(
    $id: ID!,
    $name: String!,
    $requestReason: String!,
    $vehicle: String
  ) {
  result: userUpdatePending(
      id: $id,
      name: $name,
      requestReason: $requestReason,
      vehicle: $vehicle,
    ) {
      id
      name
      vehicle
      requestReason
  }
}
`;


// Break this out into it's own module
const crudHandler = ({createMutation, readLazyQuery, updateMutation}) => {
  // Create a record or Modify an existing record
  const [loadRecord, {loading: recordLoading, error: queryError, data: queryResult }] = readLazyQuery;
  const [updateRecord, {loading: updateLoading, error: updateError, data: updatedResult }] = updateMutation;
  const [createRecord, {loading: createLoading, error: createError, data: createdResult }] = createMutation;
  const isLoading = recordLoading || updateLoading || createLoading
  const {result} = updatedResult || createdResult || queryResult || {result:{}}
  const error = updateError || createError || queryError
  const isNewRecord = !result.id

  function createOrUpdate(data) {
    if (result.id) {
      data.id = result.id // Ensure ID is set
      return updateRecord({variables: data})
    } else {
      return createRecord({variables: data})
    }
  }


  return {
    isLoading,
    isNewRecord,
    result,
    error,
    createOrUpdate,
    loadRecord
  }

}

function firstName(name=''){
  return name.split(' ')[0] || ''
}

function lastName(name=''){
  return name.split(' ')[1] || ''
}


export default function RequestFormContainer({match, history}) {

  const {isLoading, error, result, createOrUpdate, loadRecord} = crudHandler({
    readLazyQuery: useLazyQuery(QUERY),
    updateMutation: useMutation(UPDATE_PENDING_MEMBER),
    createMutation: useMutation(CREATE_PENDING_MEMBER),
  });

  function submitMutation({firstName, lastName, requestReason, vehicle}) {
    return createOrUpdate({
      name: [firstName, lastName].join(' '),
      requestReason,
      vehicle,
    })
  }

  const FormContainer = withFormik({
    mapPropsToValues: () => ({
      firstName: firstName(result.name),
      lastName: lastName(result.name),
      requestReason: result.requestReason || '',
      vehicle: result.vehicle || '',
    }),

    // Custom sync validation
    validate: values => {
      const errors = {};

      if (!values.firstName) {
        errors.firstName = 'Required';
      }
      if (!values.lastName) {
        errors.lastName = 'Required';
      }
      if (!values.requestReason) {
        errors.requestReason = 'Required';
      }

      return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
      submitMutation(values).then(({data})=> {
        setSubmitting(false)
        history.push(`/id_verify/${data.result.id}`)
      })
    },

    displayName: 'RequestForm',
  })(Container);
  if (!isLoading && !result.id && !error) {
    loadRecord({variables: {id: match.params.userId}})
  } else if (isLoading) {
    return (<Loading/>)
  } 
  return (<FormContainer />)
}

export function Container(props) {
  return (
    <div>
      <Nav navName="New Request" menuButton="cancel" />
      <RequestForm {...props} />
    </div>
  )
}

Container.displayName = "RequestForm"

