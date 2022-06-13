import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import FormOptionInput, { FormOptionWithOwnActions } from '../../components/FormOptionInput'

// Note: There is an error that exit with code 0 Uncaught [TypeError: activeElement.attachEvent is not a function]
// It is caused by the autoFocus on MUI Inputs
describe('Form Option Input component', () => {
  it('should have input field and a remove button', () => {
    const updateMock = jest.fn()
    const numbers = ['', '', '']
    const container = render(
      <FormOptionInput
        label="Phone Number"
        options={numbers}
        setOptions={updateMock}
      />
    )
    expect(container.queryByText('Phone Number 1')).toBeInTheDocument()
    expect(container.queryByText('Phone Number 2')).toBeInTheDocument()
    expect(container.queryByTestId('add_type')).toBeInTheDocument()
    expect(container.queryAllByLabelText('remove')[0]).not.toBeDisabled()

    fireEvent.click(container.queryAllByLabelText('remove')[0])
    expect(updateMock).toBeCalled()
  })
})

describe('Form with its own actions', () => {
  it('should render correctly', () => {
    const removeMock = jest.fn()
    const updateMock = jest.fn()
    const options = [
      { id: '123', info: 'xyz@gmail.com', contactType: 'email' },
      { id: '456', info: '123 Address Estate', contactType: 'address' },
    ]
    const actions = {
      handleRemoveOption: removeMock,
      handleOptionChange: updateMock
    }
    const container = render(
      <FormOptionWithOwnActions actions={actions} options={options} />
    )

    expect(container.queryAllByText('misc.option_with_count')).toHaveLength(2)
    expect(container.queryAllByTestId('option-text-field')).toHaveLength(2)
    expect(container.queryAllByTestId('remove-option-btn')).toHaveLength(2)

    expect(container.queryAllByLabelText('remove')[0]).not.toBeDisabled()
    expect(container.queryAllByLabelText('remove')[1]).not.toBeDisabled()

    fireEvent.click(container.queryAllByTestId('remove-option-btn')[0])
    expect(removeMock).toBeCalled()
  })
})
