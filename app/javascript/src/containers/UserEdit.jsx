import React from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';

import Nav from '../components/Nav'
import UserForm from '../components/UserForm.jsx';
import Loading from "../components/Loading.jsx";

const QUERY = gql`
query User($id: ID!) {
  result: user(id: $id) {
    name
    userType
    roleName
    vehicle
    requestReason
    id
    expiresAt
    email
  }
}
`;


const CREATE_USER = gql`
mutation CreateUserMutation(
    $name: String!,
    $email: String,
    $phoneNumber: String,
    $userType: String!,
    $state: String,
    $vehicle: String
    $requestReason: String,
  ) {
  result: userCreate(
      name: $name,
      userType: $userType,
      email: $email,
      phoneNumber: $phoneNumber,
      requestReason: $requestReason,
      vehicle: $vehicle,
      state: $state,
    ) {
      id
      name
      vehicle
      requestReason
  }
}
`;

const UPDATE_USER = gql`
mutation UpdateUserMutation(
    $id: ID!,
    $name: String,
    $email: String,
    $phoneNumber: String,
    $userType: String,
    $requestReason: String,
    $vehicle: String
    $state: String,
  ) {
  result: userUpdate(
      id: $id,
      name: $name,
      email: $email,
      phoneNumber: $phoneNumber,
      userType: $userType,
      requestReason: $requestReason,
      vehicle: $vehicle,
      state: $state,
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


export default function UserFormContainer({match, history}) {

  const {isLoading, error, result, createOrUpdate, loadRecord} = crudHandler({
    readLazyQuery: useLazyQuery(QUERY),
    updateMutation: useMutation(UPDATE_USER),
    createMutation: useMutation(CREATE_USER),
  });

  function submitMutation({name, userType, requestReason, vehicle, state, email, phoneNumber}) {
    return createOrUpdate({
      name,
      requestReason,
      userType,
      vehicle,
      state,
      email,
      phoneNumber,
    })
  }

  const FormContainer = withFormik({
    mapPropsToValues: () => ({
      name: result.name,
      email: result.email || '',
      phoneNumber: result.phoneNumber || '',
      userType: result.userType,
      expiresAt: result.expiresAt || false,
      state: result.state,
      vehicle: result.vehicle || '',
    }),

    // Custom sync validation
    validate: values => {
      const errors = {};

      if (!values.name) {
        errors.name = 'Required';
      }
      if (!values.userType) {
        errors.userType = 'Required';
      }

      return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
      console.log(values)
      submitMutation(values).then(({data})=> {
        setSubmitting(false)
        history.push(`/user/${data.result.id}`)
      })
    },

    displayName: 'UserForm',
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
      <UserForm {...props} />
    </div>
  )
}

Container.displayName = "UserForm"

