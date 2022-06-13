import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import TaskDetailAccordion from '../Components/TaskDetailAccordion'


describe('Task detail accordion Component', () => {

  it('component should render without error', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <TaskDetailAccordion
            icon={<div />}
            title='sample-title'
            component={<div />}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByTestId('body')).toBeInTheDocument();
    expect(container.queryByTestId('title')).toHaveTextContent('sample-title');
    expect(container.queryByTestId('toggle-icon')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('toggle-icon'));
    expect(container.queryByTestId('component')).toBeInTheDocument();
  })
})
