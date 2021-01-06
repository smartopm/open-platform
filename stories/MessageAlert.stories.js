import React from 'react'
import MessageAlert from '../app/javascript/src/components/MessageAlert'

export default {
  title: 'Components/MessageAlert',
  component: MessageAlert
}

const AlertTemplate = args => <MessageAlert {...args} />

export const SuccessAlert = AlertTemplate.bind({})
SuccessAlert.args = {
  open: true,
  handleClose: () => {},
  message: 'Successfully uploaded users',
  type: 'success'
}

export const ErrorAlert = AlertTemplate.bind({})
ErrorAlert.args = {
  open: true,
  handleClose: () => {},
  handleOnSave: () => {},
  message: 'ooops something went wrong',
  type: 'error'
}
