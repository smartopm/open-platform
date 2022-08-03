import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { EmailTemplatesQuery } from '../graphql/email_queries';
import TemplateList from '../components/TemplateList';
import { Spinner } from '../../../shared/Loading';

describe('Template List Component', () => {
  it('should return a list of all email templates', async () => {
    const templateMock = {
      request: {
        query: EmailTemplatesQuery
      },
      result: {
        data: {
          emailTemplates: [
            {
              name: 'task update',
              id: '501b718c-8687-4e78-60b732df5ab1',
              // placeholders to clean up errors
              variableNames: "",
              createdAt: "",
              subject: "",
              data: "",
              tag: "",
            }
          ]
        }
      }
    };
    const container = render(
      <MockedProvider mocks={[templateMock]} addTypename={false}>
        <TemplateList
          value={templateMock.result.data.emailTemplates[0].id}
          handleValue={jest.fn()}
          createTemplate={() => {}}
          shouldRefecth
          isRequired
        />
      </MockedProvider>
    );
    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryAllByText('Select a template')[0]).toBeInTheDocument();
      expect(container.queryByTestId('template_list')).toBeInTheDocument();
    }, 10);
  });

  it('should return an error when fetching was not successful', async () => {
    const templateMock = {
      request: {
        query: EmailTemplatesQuery
      },
      result: {
        data: null,
      },
      error: new Error('An error occurred'),
    };
    const container = render(
      <MockedProvider mocks={[templateMock]} addTypename={false}>
        <TemplateList
        // passing random values here to clean up console errors
          value="29384219312"
          handleValue={jest.fn()}
          createTemplate={() => {}}
          shouldRefecth
          isRequired
        />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByTestId('error_section').textContent).toContain('An error occurred');
    }, 10);
  });
});
