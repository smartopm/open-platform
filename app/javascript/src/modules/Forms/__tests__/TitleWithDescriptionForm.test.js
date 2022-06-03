import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import TitleDescriptionForm from '../components/TitleDescriptionForm'

describe('Form with a title and a description component', () => {
  it('should have both title and description and option child element', () => {
      const saveMock = jest.fn()
      const closeMock = jest.fn()
      const dataMock = {
          loading: false,
          msg: "Success"
      }
    const container = render(
      <TitleDescriptionForm
        save={saveMock}
        type="form"
        close={closeMock}
        data={dataMock}
      >
        <h5>Additional Node Element</h5>
      </TitleDescriptionForm>
    )
    expect(container.queryByText("Additional Node Element")).toBeInTheDocument()
    expect(container.queryByText("Success")).toBeInTheDocument()
    expect(container.queryByText("form_actions.cancel")).toBeInTheDocument()
    expect(container.queryByText("form_actions.submit")).toBeInTheDocument()
    expect(container.queryByText("form_actions.submit")).not.toBeDisabled()
    expect(container.queryByLabelText("form_title")).toBeInTheDocument()
    expect(container.queryByLabelText("form_description")).toBeInTheDocument()

    // try firing some events
    fireEvent.change(container.queryByLabelText("form_title"),  { target: { value: 'This is a new form' } })
    expect(container.queryByLabelText("form_title").value).toBe('This is a new form')

    fireEvent.change(container.queryByLabelText("form_description"),  { target: { value: 'This is a good form description' } })
    expect(container.queryByLabelText("form_description").value).toBe('This is a good form description')

    fireEvent.click(container.queryByText("form_actions.submit"))
    expect(saveMock).toBeCalled()

    fireEvent.click(container.queryByText("form_actions.cancel"))
    expect(closeMock).toBeCalled()
  })
})
