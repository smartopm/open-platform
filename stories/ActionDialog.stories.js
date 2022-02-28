import React from 'react'
import { ActionDialog } from '../app/javascript/src/components/Dialog'

export default {
  title: 'Components/ActionDialog',
  component: ActionDialog
}

const DialogTemplate = args => <ActionDialog {...args} />

export const Warning = DialogTemplate.bind({})
Warning.args = {
  open: true,
  handleClose: () => {},
  handleOnSave: () => {},
  message: 'Are you sure to delete this ...',
  type: 'warning'
}

export const Confirm = DialogTemplate.bind({})
Confirm.args = {
  open: true,
  handleClose: () => {},
  handleOnSave: () => {},
  message: 'Are you sure to update this ...',
  type: 'confirm'
}
