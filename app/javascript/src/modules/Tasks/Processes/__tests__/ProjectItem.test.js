/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, screen, waitFor } from '@testing-library/react';
import ProjectItem from '../Components/ProjectItem';
import taskMock from '../../__mocks__/taskMock';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
const props = {
  task: taskMock,
  processId: '123-3456',
  refetch: () => { },
  processName: 'Process Name',
};

describe('Process Item', () => {
  it('renders necessary elements', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProjectItem {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('task_body_section')).toBeInTheDocument();
    }, 5)
  });
});
