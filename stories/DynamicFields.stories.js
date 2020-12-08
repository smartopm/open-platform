import React from 'react'
import DynamicContactFields from '../app/javascript/src/components/Community/DynamicContactFields'
import FormOptionInput from '../app/javascript/src/components/Forms/FormOptionInput'

export default {
  title: 'Components/DynamicFields',
  component: DynamicContactFields,
  subcomponents: { FormOptionInput }
}

const FieldTemplate = args => <DynamicContactFields {...args} />
const SingleOptionTemplate = args => <FormOptionInput {...args} />

export const Email = FieldTemplate.bind({})

const emails = [
  {
    email: 'abc@gmail.com',
    category: 'sales'
  },
  {
    email: '',
    category: ''
  }
]
Email.args = {
  options: emails,
  handleChange: () => {},
  handleRemoveRow: () => {},
  data: {
    label: 'Email',
    name: 'email'
  }
}

export const PhoneNumber = FieldTemplate.bind({})
const numbers = [
  {
    phone_number: '',
    category: ''
  }
]
PhoneNumber.args = {
  options: numbers,
  handleChange: () => {},
  handleRemoveRow: () => {},
  data: {
    label: 'Phone Number',
    name: 'phone_number'
  }
}

export const SingleOption = SingleOptionTemplate.bind({})

SingleOption.args = {
  id: 1,
  option: ['', ''],
  actions: {
    handleRemoveOption: () => {},
    handleOptionChange: () => {}
  }
}
