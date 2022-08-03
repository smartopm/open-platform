import React from 'react';
import { render, act, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import MailTemplates from '../components/MailTemplateList';
import { EmailTemplatesQuery } from '../graphql/email_queries';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

describe('Mail Templates Component', () => {
  it('renders Mail Templates', async () => {
    const templateMock = {
      request: {
        query: EmailTemplatesQuery,
        variables: { limit: 50, offset: 0 }
      },
      result: {
        data: {
          emailTemplates: [
            {
              id: '501b718c-8687-4e78-60b732df534ab1',
              name: 'task update',
              subject: 'greet',
              data: {},
              variableNames: {},
              createdAt: new Date(),
              tag: 'some_tag'
            }
          ]
        }
      }
    };
    await act(async () => {
      const container = render(
        <MockedProvider mocks={[templateMock]} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <MailTemplates />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(container.getByTestId('create')).toBeInTheDocument();
        expect(container.queryByText('task update')).toBeInTheDocument();
      }, 50);
    });
  });
});
