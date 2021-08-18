import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
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
  it('should accept actions', () => {
    const removeMock = jest.fn()
    const updateMock = jest.fn()
    const actions = {
      handleRemoveOption: removeMock,
      handleOptionChange: updateMock
    }
    const container = render(
      <FormOptionWithOwnActions actions={actions} value="option 1" id={3} />
    )
    expect(container.queryByText('misc.option_with_count')).toBeInTheDocument()
    expect(container.queryByLabelText('remove')).not.toBeDisabled()

    fireEvent.click(container.queryByLabelText('remove'))
    expect(removeMock).toBeCalled()
  })
})
