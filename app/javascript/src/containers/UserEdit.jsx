/* eslint-disable */
import React from 'react'
import { useLazyQuery, useMutation } from 'react-apollo'
import Nav from '../components/Nav'
import UserForm from '../components/UserForm.jsx'
import Loading from '../components/Loading.jsx'
import crudHandler from '../graphql/crud_handler'
import { useFileUpload } from '../graphql/useFileUpload'
import { useApolloClient } from 'react-apollo'
import { UserQuery } from '../graphql/queries'
import { UpdateUserMutation, CreateUserMutation } from '../graphql/mutations'
import { ModalDialog } from '../components/Dialog'
import { saniteError } from '../utils/helpers'
import { requiredFields } from '../utils/constants'

const initialValues = {
  name: '',
  email: '',
  phoneNumber: '',
  requestReason: '',
  userType: '',
  state: '',
  signedBlobId: '',
  imageUrl: '',
  subStatus: ''
}
export default function FormContainer({ match, history, location }) {
  const previousRoute = location.state && location.state.from
  const isFromRef = previousRoute === 'ref' || false

  // let title = 'New User'
  // if (result && result.id) {
  //   title = 'Editing User'
  // } else if (isFromRef) {
  //   title = 'Referrals'
  // }

  const { onChange, status, url, signedBlobId } = useFileUpload({
    client: useApolloClient()
  })

  function handleModal(type) {
    if (type === 'grant') {
      setModalAction('grant')
    } else {
      setModalAction('deny')
    }
    setDenyModal(!isModalOpen)
  }

  function handleModalConfirm() {
    createOrUpdate({
      id: result.id,
      state: modalAction === 'grant' ? 'valid' : 'banned'
    })
      .then(() => {
        setDenyModal(!isModalOpen)
      })
      .then(() => {
        history.push('/pending')
      })
  }

  return (
    <>
      <Nav
        navName={'user edit'} //TODO: @olivier ==> change this to a dynamica title
        menuButton="back"
        backTo={match.params.id ? `/user/${match.params.id}` : '/'}
      />

      {/* <ModalDialog
        handleClose={handleModal}
        handleConfirm={handleModalConfirm}
        open={isModalOpen}
        imageURL={result.avatarUrl}
        action={modalAction}
        name={data.name}
      /> */}
      <br />
      {/* {Boolean(msg.length) && !isFromRef && (
        <p className="text-danger text-center">
          {saniteError(requiredFields, msg)}
        </p>
      )} */}
      <UserForm />
      {/* {showResults ? (
        <div className="d-flex row justify-content-center">
          <p>Thank you for your referral. We will reach out to them soon.</p>
        </div>
      ) : (
        Boolean(msg.length) && (
          <p className="text-danger text-center">
            This user already exists in the system.
          </p>
        )
      )} */}
    </>
  )
}

FormContainer.displayName = 'UserForm'
