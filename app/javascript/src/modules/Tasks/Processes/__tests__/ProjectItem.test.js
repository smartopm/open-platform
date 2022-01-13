/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import ProjectItem from '../Components/ProjectItem';
import taskMock from '../../__mocks__/taskMock';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
const props = {
  task: taskMock,
  refetch: () => {}
};

describe('Process Item', () => {
  it('renders necessary elements', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <ProjectItem {...props} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.queryByTestId('task_body_section')).toBeInTheDocument();
  });
});
