import React from 'react'
import DynamicContactFields from '../app/javascript/src/modules/Community/components/DynamicContactFields'
import FormOptionInput from '../app/javascript/src/modules/Forms/components/FormOptionInput'

export function MultiFields(){
  const [options, setOptions] = React.useState([""])
  return <FormOptionInput label="Option" options={options} setOptions={setOptions} />
}


export default {
  title: 'Components/DynamicFields',
  component: DynamicContactFields,
  subcomponents: { MultiFields }
}

const FieldTemplate = args => <DynamicContactFields {...args} />

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
