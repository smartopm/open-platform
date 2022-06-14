import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import routeData from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import ProjectDocument from '../Components/ProjectDocument';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { DocumentCommentsQuery } from '../graphql/process_queries';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Project Document Component', () => {
  jest.useFakeTimers();
  const mockParams = {
    pathname: '/processes',
    search: '?document_id=50da896a-9217-43b9-a28f-03a13c7d401f'
  };

  beforeEach(() => {
    jest.spyOn(routeData, 'useLocation').mockReturnValue(mockParams);
  });

  const attachments = [
    {
      id: 'jwhedwedwedwe',
      filename: 'sample.pdf',
      task_id: 'wejdghjfewf',
      created_at: '2022-05-05',
      uploaded_by: 'sample name',
      task_name: 'sample task name',
      comment_count: 2
    }
  ];

  const documentCommentsMock = [
    {
      request: {
        query: DocumentCommentsQuery,
        variables: { taggedDocumentId: '50da896a-9217-43b9-a28f-03a13c7d401f' }
      },
      result: {
        data: {
          documentComments: [
            {
              id: 'rfghd56',
              body: 'a comment body',
              createdAt: '2022-05-05',
              user: {
                id: 'ytuwi76845',
                name: 'John',
                imageUrl: 'https://url'
              },
              note: {
                id: 'ytfa76',
                body: 'not body'
              }
            }
          ]
        }
      }
    }
  ];

  it('should render correctly', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={documentCommentsMock} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProjectDocument attachments={attachments} loading={false} refetch={jest.fn()} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('documents')).toBeInTheDocument();
      expect(screen.getByText('sample.pdf')).toBeInTheDocument();
      expect(screen.getByText('sample task name')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('open-comments'));
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('more_details'));
      expect(screen.getByText('document.download')).toBeInTheDocument();
      expect(screen.getByText('document.delete')).toBeInTheDocument();

      fireEvent.click(screen.queryByTestId('delete_button'));
      expect(screen.queryByText('document.delete_confirmation_message')).toBeInTheDocument();
      expect(screen.queryByTestId('proceed_button')).toBeInTheDocument();

      fireEvent.click(screen.queryByTestId('proceed_button'));
    });
  });

  it('should render No Document Information', () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProjectDocument attachments={[]} loading={false} refetch={jest.fn()} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(screen.getByText('document.no_document')).toBeInTheDocument();
  });

  it('should render loader', () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProjectDocument attachments={[]} loading refetch={jest.fn()} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render error', () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProjectDocument
                attachments={[]}
                loading={false}
                refetch={jest.fn()}
                error="sample error message"
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(screen.getByText('sample error message')).toBeInTheDocument();
  });
});
