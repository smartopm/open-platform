import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import FormOptionInput from '../../components/Forms/FormOptionInput'

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
    expect(container.queryByText('Add Phone Number')).toBeInTheDocument()
    expect(container.queryAllByLabelText('remove')[0]).not.toBeDisabled()

    fireEvent.click(container.queryAllByLabelText('remove')[0])
    expect(updateMock).toBeCalled()
  })
})
