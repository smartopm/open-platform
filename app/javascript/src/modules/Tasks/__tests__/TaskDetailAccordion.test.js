import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import TaskDetailAccordion from '../Components/TaskDetailAccordion'
import '@testing-library/jest-dom/extend-expect'

describe('Task detail accordion Component', () => {

  it('component should be in the component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <TaskDetailAccordion
            icon={<div />}
            title='sample-title'
            component={<div />}
            openDetail
          />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByTestId('body')).toBeInTheDocument();
    expect(container.queryByTestId('title')).toHaveTextContent('sample-title');
    expect(container.queryByTestId('toggle-icon')).toBeInTheDocument();
  })
})
