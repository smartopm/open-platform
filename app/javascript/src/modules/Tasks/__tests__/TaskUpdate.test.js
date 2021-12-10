import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import TaskUpdate from '../containers/TaskUpdate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Feedback Component', () => {
  it('redirects to / and do not render task', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <TaskUpdate
            handleTaskCompletion={jest.fn}
          />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
