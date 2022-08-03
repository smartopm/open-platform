import React from 'react';
import EmailEditor from 'react-email-editor';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import EmailBuilderDialog from '../components/EmailBuilderDialog';
import EmailTemplatesMutation, { EmailUpdateMutation } from '../graphql/email_mutations';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

// this does not help much
jest.mock('react-email-editor')

describe('Email Builder Component', () => {
  const props = {
    emailId: '03942342',
  };
  const updateRequestMock = {
    request: {
      query: EmailUpdateMutation,
      variables: {
        id: props.emailId,
        body: 'some new template',
        data: { some: 'thing' }
      }
    },
    result: {
      data: {
        emailTemplateUpdate: {
          emailTemplate: {
            id: props.emailId
          }
        }
      }
    }
  };

  const createRequestMock = {
    request: {
        query: EmailTemplatesMutation,
        variables: {
          id: props.emailId,
          name: 'Greet',
          subject: 'template',
          body: 'some new template',
          data: { some: 'thing' }
        }
      },
      result: {
        data: {
          emailTemplateCreate: {
            emailTemplate: {
              id: props.emailId
            }
          }
        }
      }
    };

  it('should render properly', async () => {
    const container = render(
      <MockedProvider mocks={[updateRequestMock, createRequestMock]}>
        <BrowserRouter>
          <MockedSnackbarProvider>
            <EmailBuilderDialog  />
          </MockedSnackbarProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    render(<EmailEditor />)
    expect(container.queryByTestId('submit_btn').textContent).toContain('common:form_actions.save')

    fireEvent.click(container.queryByTestId('submit_btn'));

    await waitFor(() => {
      expect(container.queryByTestId('close_btn')).toBeInTheDocument()
      expect(container.queryByTestId('fullscreen_dialog')).toBeInTheDocument()
      fireEvent.click(container.queryByTestId('close_btn'))
    }, 20)

  });
});
