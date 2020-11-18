import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import FormOptionInput from '../../components/Forms/FormOptionInput'


// Note: There is an error that exit with code 0 Uncaught [TypeError: activeElement.attachEvent is not a function]
// It is caused by the autoFocus on MUI Inputs
describe('Form Option Input component', () => {
  it('should have input field and a remove button', () => {
      const removeMock = jest.fn()
      const updateMock = jest.fn()
    const actions = {
        handleRemoveOption: removeMock,
        handleOptionChange: updateMock
    }
    const container = render(
      <FormOptionInput
        actions={actions}
        value="option 1"
        id={3}
      />
    )
    expect(container.queryByText("option 3")).toBeInTheDocument()
    expect(container.queryByLabelText("remove")).not.toBeDisabled()

    fireEvent.click(container.queryByLabelText("remove"))
    expect(removeMock).toBeCalled()
  })
})
