import React from 'react'
import {
  fireEvent,
    render
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ToggleButton, { MultipleToggler } from "../components/Campaign/ToggleButton"

describe('It should render the toggle button delete', () => {
  const mock = jest.fn()
 
  it('It should render toggle button', () => {
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

    expect(container.queryAllByText('Draft')[0]).toBeInTheDocument()
    expect(container.queryAllByText('Scheduled')[0]).toBeInTheDocument()
    fireEvent.click(container.queryAllByLabelText('draft')[0])
    expect(mock).toBeCalled()
  });

  it('It should render multiple toggle button', () => {
    const container = render(
      <MultipleToggler
        type='plots'
        handleType={mock}
        options={['plots', 'map', 'houses']}
      />
    )
    expect(container.queryByText('Plots')).toBeInTheDocument()
    expect(container.queryByText('Map')).toBeInTheDocument()
    expect(container.queryByText('Houses')).toBeInTheDocument()
    fireEvent.click(container.queryByLabelText('plots'))
    expect(mock).toBeCalled()
    fireEvent.click(container.queryByLabelText('houses'))
    expect(mock).toBeCalled()
  });

});
