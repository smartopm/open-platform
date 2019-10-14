import React from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import { withFormik } from 'formik';

import Nav from '../components/Nav'
import UserForm from '../components/UserForm.jsx';
import Loading from "../components/Loading.jsx";
import crudHandler from "../graphql/crud_handler"

import {UserQuery} from "../graphql/queries"
import {UpdateUserMutation, CreateUserMutation} from "../graphql/mutations"

export default function UserFormContainer({match, history}) {

  const {isLoading, error, result, createOrUpdate, loadRecord} = crudHandler({
    typeName: 'user',
    readLazyQuery: useLazyQuery(UserQuery),
    updateMutation: useMutation(UpdateUserMutation),
    createMutation: useMutation(CreateUserMutation),
  });

  function submitMutation({name, userType, requestReason, vehicle, state, email, phoneNumber}) {
    console.log("Submit")
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
      console.log('submit', values)
      submitMutation(values).then(({data})=> {
        console.log(data)
        setSubmitting(false)
        history.push(`/user/${data.result.user.id}`)
      }).catch((err)=>console.log(err))
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

