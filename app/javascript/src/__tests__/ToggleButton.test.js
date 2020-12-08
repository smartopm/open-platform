import React from 'react'
import {
  fireEvent,
    render
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ToggleButton from "../components/Campaign/ToggleButton"

describe('It should render the toggle button delete', () => {
  const mock = jest.fn()
  const container = render(
    <ToggleButton
      type='draft'
      handleType={mock}
      data={{
        type: 'draft',
        antiType: 'scheduled'
      }}
    />
  )
  it('It should render toggle button', () => {
    expect(container.queryByText('Draft')).toBeInTheDocument()
    expect(container.queryByText('Scheduled')).toBeInTheDocument()
    fireEvent.click(container.queryByLabelText('draft'))
    expect(mock).toBeCalled()
  });
});