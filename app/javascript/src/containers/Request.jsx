import React from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import { withFormik } from 'formik';

import Nav from '../components/Nav'
import RequestForm from '../components/RequestForm.jsx';
import Loading from "../components/Loading.jsx";

import {UserQuery} from "../graphql/queries"
import {CreatePendingUserMutation, UpdatePendingUserMutation} from "../graphql/mutations"
import crudHandler from "../graphql/crud_handler"

function firstName(name=''){
  return name.split(' ')[0] || ''
}

function lastName(name=''){
  return name.split(' ')[1] || ''
}


export default function RequestFormContainer({match, history}) {

  const {isLoading, error, result, createOrUpdate, loadRecord} = crudHandler({
    typeName: 'user',
    readLazyQuery: useLazyQuery(UserQuery),
    updateMutation: useMutation(UpdatePendingUserMutation),
    createMutation: useMutation(CreatePendingUserMutation),
  });
  console.log('Loading', isLoading)
  console.log('error', error)
  console.log('result', result)

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
        history.push(`/user/${data.result.user.id}`)
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

