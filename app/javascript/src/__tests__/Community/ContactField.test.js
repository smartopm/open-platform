import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DynamicContactFields from '../../components/Community/DynamicContactFields'

describe('Dynamic Fields ', () => {
  it('should have input field and a remove button', () => {
    const onChangeMock = jest.fn()
    const onRemoveMock = jest.fn()

    const numbers = [
      {
        phone_number: '',
        category: ''
      }
    ]
    const container = render(
      <DynamicContactFields
        options={numbers}
        handleChange={onChangeMock}
        handleRemoveRow={onRemoveMock}
        data={{
          label: 'Phone Number',
          name: 'phone_number'
        }}
      />
    )
    expect(container.queryByLabelText('remove')).not.toBeDisabled()
    expect(container.queryByLabelText('Phone Number')).toBeInTheDocument()
    expect(container.queryByLabelText(/Select Category/)).toBeInTheDocument()
    expect(container.queryAllByLabelText('remove')).toHaveLength(1)

    fireEvent.click(container.queryByLabelText('remove'))
    expect(onRemoveMock).toBeCalled()
    expect(onRemoveMock).toBeCalledWith(0)
  })
})
