import React from 'react';
import { render, screen , waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import TaskDocuments from '../Components/TaskDocuments';
import { TaskDocumentsQuery } from '../graphql/task_queries';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Task Documents', () => {
  // props
  const attachments = [
    {
      id: '92348129',
      filename: 'picture.png',
      url: 'https://picture.png',
      created_at: "2020-10-01",
      uploaded_by: "John Doe"
    }
  ];

  const DocumentsMock = [
    {
      request: {
        query: TaskDocumentsQuery,
        variables: { taskId: '302df8c3-27bb-4175-adc1-43857e972eb4' }
      },
      result: {
        data: {
          task: {
            attachments,
            id: '302df8c3-27bb-4175-adc1-43857e972eb4',
          }
        }
      }
    }
  ];

  it('renders properly when there are documents', async () => {
    render(
      <MockedProvider mocks={DocumentsMock} addTypename={false}>
        <BrowserRouter>
          <TaskDocuments taskId='302df8c3-27bb-4175-adc1-43857e972eb4' />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('add_document')).toBeInTheDocument();
      expect(screen.queryByTestId('opening_divider')).toBeInTheDocument();
      expect(screen.queryByTestId('filename')).toBeInTheDocument();
      expect(screen.queryByTestId('filename').textContent).toContain('picture.png');
      expect(screen.queryByTestId('uploaded_at')).toBeInTheDocument();
      expect(screen.queryByTestId('uploaded_at').textContent).toContain('2020-10-01');
      expect(screen.queryByTestId('uploaded_by')).toBeInTheDocument();
      expect(screen.queryByTestId('uploaded_by').textContent).toContain('John Doe');
      expect(screen.queryByTestId('more_details')).toBeInTheDocument();
      expect(screen.queryByTestId('closing_divider')).toBeInTheDocument();
    });
  });
});
