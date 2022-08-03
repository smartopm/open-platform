import React from 'react'
import {
  fireEvent,
    render
} from '@testing-library/react'

import ToggleButton, { MultipleToggler } from "../components/ToggleButton"

describe('It should render the toggle button delete', () => {
  const mock = jest.fn()
 
  it('should render toggle button', () => {
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

    expect(container.queryByText('Draft')).toBeInTheDocument()
    expect(container.queryByText('Scheduled')).toBeInTheDocument()
    fireEvent.click(container.queryByLabelText('draft'))
    expect(mock).toBeCalled()
  });

  it('should render multiple toggle button', () => {
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
